import { dictionary } from '@/utils/constants/dictionary';
import {
  Card,
  Row,
  Space,
  Breadcrumb,
  Tooltip,
  Button,
  Col,
  Typography,
  Divider,
  theme,
  Skeleton,
  Grid
} from 'antd';
import {
  HomeOutlined,
  FilePdfOutlined,
  CloseOutlined,
  DotChartOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  IEdcContractTableFileListItem,
  IEdcItemRelationDoc,
  IGetEdcContractByIdResponse,
  IGetEdcExtraByIdResponse
} from '@/modules/edc/models';
import { EdcServies } from '@/services/edc-services/edc-services';
import {
  formatDate,
  generateOptionListPerNumber
} from '@/utils/functions/functions';
import AppHandledSelect from '@/components/forms/select/handled-select';
import { selectPlaceholderText } from '@/utils/constants/texts';
import { useForm } from 'react-hook-form';
import TokenizedIframe from '@/components/display/iframe';
import AppEmpty from '@/components/display/empty';
import RejectModal from '@/components/feedback/reject-modal';
import ReturnModal from '@/components/feedback/return-modal';
import { toastOptions } from '@/configs/global-configs';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '@/components/display/DeleteConfirmationModal';
import ChangeLog from '../../change-log/change-log';

function ViewAct() {
  const { useBreakpoint } = Grid;
  const { lg } = useBreakpoint();
  const { id } = useParams();
  const { pathname } = useLocation();
  const isDraft: boolean = pathname?.includes('draft');
  const navigate = useNavigate();
  const {
    setValue,
    control,
    formState: { errors }
  } = useForm({ mode: 'onChange' });
  const [skeleton, setSkeleton] = useState<boolean>(true);
  const [edcViewItem, setEdcViewItem] =
    useState<IGetEdcContractByIdResponse['Data']>();
  const [versionLoading, setVersionLoading] = useState<boolean>(false);
  const [activePdfOnStage, setActivePdfOnStage] =
    useState<IEdcContractTableFileListItem>();
  const [showRejectForm, setShowRejectForm] = useState<boolean>(false);
  const [showReturnForm, setShowReturnForm] = useState<boolean>(false);
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState<boolean>(false);
  const getByID = async (docId: string) => {
    const res: IGetEdcExtraByIdResponse =
      await EdcServies.getInstance().getExtraById(docId, isDraft);
    if (res?.IsSuccess) {
      setEdcViewItem(res.Data);
      setSkeleton(false);
      setActivePdfOnStage(
        res.Data?.TableFileList?.find(
          (z: IEdcContractTableFileListItem) => z?.type === 1
        )
      );
    }
  };

  const getDocByVersions = async (ver: number, type: number) => {
    if (id) {
      setVersionLoading(true);
      const res = await EdcServies.getInstance().getDocByVersion(
        id,
        [
          { name: 'type', value: type },
          { name: 'version', value: ver }
        ],
        () => setVersionLoading(false)
      );
      if (res.IsSuccess) {
        setActivePdfOnStage(res.Data);
        setVersionLoading(false);
      }
      setVersionLoading(false);
      console.log(versionLoading);
    }
  };

  useEffect(() => {
    id && getByID(id);
    window.scrollTo(0, 0);
  }, [id, refreshComponent]);

  useEffect(() => {
    setValue('version', activePdfOnStage?.version);
  }, [activePdfOnStage]);

  const { useToken } = theme;
  const { token } = useToken();

  const rejectDoc = () => {
    setShowRejectForm(true);
  };

  const returnDoc = () => {
    setShowReturnForm(true);
  };

  const approveDoc = async () => {
    if (id) {
      setApproveLoading(true);
      const res = await EdcServies.getInstance().approveDoc(Number(id));
      if (res.IsSuccess) {
        setApproveLoading(false);
        setRefreshComponent(z => !z);
        toast.success(res.Data?.message, toastOptions);
      } else {
        setApproveLoading(false);
        setRefreshComponent(z => !z);
        setSkeleton(false);
      }
    }
  };

  const updateDoc = () => {
    if (edcViewItem?.DocumentTypeId === 1) {
      isDraft
        ? navigate(`/edc/update-contract/draft/${id}`)
        : navigate(`/edc/update-contract/${id}`);
    }
    if (edcViewItem?.DocumentTypeId === 2) {
      isDraft
        ? navigate(`/edc/update-addition/draft/${id}`)
        : navigate(`/edc/update-addition/${id}`);
    }
    if (edcViewItem?.DocumentTypeId === 3) {
      isDraft
        ? navigate(`/edc/update-invoice/draft/${id}`)
        : navigate(`/edc/update-invoice/${id}`);
    }
    if (edcViewItem?.DocumentTypeId === 4) {
      isDraft
        ? navigate(`/edc/update-act/draft/${id}`)
        : navigate(`/edc/update-act/${id}`);
    }
  };

  const openDeleteConfirmationModal = () => {
    setShowDeleteConfirmationModal(true);
  };

  const closeDeleteConfirmationModal = () => {
    setShowDeleteConfirmationModal(false);
  };

  const deleteDraft = async () => {
    const res = await EdcServies.getInstance().deleteExtra(Number(id));
    if (res.IsSuccess) {
      toast.success(res.Data?.message, toastOptions);
      setShowDeleteConfirmationModal(false);
      navigate('/edc');
    }
  };

  return (
    <div>
      {!skeleton ? (
        <div>
          <Card size="small" className="box box-margin-y">
            <Row justify="space-between">
              <Space>
                <Breadcrumb
                  items={[
                    {
                      title: (
                        <Link to="/home">
                          <HomeOutlined rev={undefined} />
                        </Link>
                      )
                    },

                    {
                      title: (
                        <Link to="/edc">
                          {dictionary.en.electronicDocumentCycle}
                        </Link>
                      )
                    },
                    {
                      title: `${dictionary.en.viewDoc} - ${id}`
                    }
                  ]}
                />
              </Space>
              <Space>
                <Tooltip title={dictionary.en.navigateToBack}>
                  <Button
                    onClick={() => {
                      navigate(-1);
                    }}
                    type="default"
                  >
                    <Space>
                      <CloseOutlined rev={undefined} />
                    </Space>
                  </Button>
                </Tooltip>
                {edcViewItem?.permission?.editButton && (
                  <Button type="default" onClick={updateDoc}>
                    <Space>{dictionary.en.editBtn}</Space>
                  </Button>
                )}
                {edcViewItem?.permission?.deleteButton && (
                  <Button type="default" onClick={openDeleteConfirmationModal}>
                    <Space>{dictionary.en.delete}</Space>
                  </Button>
                )}

                {edcViewItem?.permission?.returnButton && (
                  <Button type="default" onClick={returnDoc}>
                    <Space>{dictionary.en.toReturn}</Space>
                  </Button>
                )}

                {edcViewItem?.permission?.rejectButton && (
                  <Button type="default" onClick={rejectDoc}>
                    <Space>{dictionary.en.toCancel}</Space>
                  </Button>
                )}
                {edcViewItem?.permission?.approveButton && (
                  <Button
                    type="primary"
                    onClick={approveDoc}
                    disabled={approveLoading}
                    loading={approveLoading}
                  >
                    <Space>{dictionary.en.toApprove}</Space>
                  </Button>
                )}
              </Space>
            </Row>
          </Card>
          <Row gutter={15} justify="space-between">
            <Col span={8} lg={8} xl={8} md={24} style={{ height: '967px' }}>
              <Card
                size="small"
                className="box box-margin-y"
                style={{ minHeight: '53%' }}
              >
                <Typography.Text>
                  {' '}
                  {dictionary.en.generalInfo.toLocaleUpperCase('tr-TR')}
                </Typography.Text>
                <Divider
                  style={{
                    marginTop: token.marginXS,
                    marginBottom: token.marginXS
                  }}
                />
                <div>
                  <Row>
                    <Col span={12}>
                      <Typography.Paragraph
                        className="custom-text"
                        style={{
                          color: token.colorTextSecondary
                        }}
                        strong
                      >
                        {dictionary.en.documentNumber ??
                          dictionary.en.noDataText}
                        :
                      </Typography.Paragraph>
                    </Col>
                    <Col span={10} offset={2}>
                      <Typography.Paragraph
                        className="custom-text"
                        ellipsis={{
                          rows: 2,
                          tooltip:
                            edcViewItem?.DocumentCode ??
                            dictionary.en.noDataText
                        }}
                        strong
                      >
                        {edcViewItem?.DocumentCode ?? dictionary.en.noDataText}
                      </Typography.Paragraph>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Typography.Paragraph
                        className="custom-text"
                        style={{
                          color: token.colorTextSecondary
                        }}
                        strong
                      >
                        {dictionary.en.documentType ?? dictionary.en.noDataText}
                        :
                      </Typography.Paragraph>
                    </Col>
                    <Col span={10} offset={2}>
                      <Typography.Paragraph
                        className="custom-text"
                        ellipsis={{
                          rows: 2,
                          tooltip:
                            edcViewItem?.DocumentType ??
                            dictionary.en.noDataText
                        }}
                        strong
                      >
                        {edcViewItem?.DocumentType ?? dictionary.en.noDataText}
                      </Typography.Paragraph>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Typography.Paragraph
                        className="custom-text"
                        style={{
                          color: token.colorTextSecondary
                        }}
                        strong
                      >
                        {dictionary.en.receivingLegalEntity ??
                          dictionary.en.noDataText}
                        :
                      </Typography.Paragraph>
                    </Col>
                    <Col span={10} offset={2}>
                      <Typography.Paragraph
                        className="custom-text"
                        ellipsis={{
                          rows: 2,
                          tooltip:
                            edcViewItem?.RecieverLegalEntity ??
                            dictionary.en.noDataText
                        }}
                        strong
                      >
                        {edcViewItem?.RecieverLegalEntity ??
                          dictionary.en.noDataText}
                      </Typography.Paragraph>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Typography.Paragraph
                        className="custom-text"
                        style={{
                          color: token.colorTextSecondary
                        }}
                        strong
                      >
                        {dictionary.en.receivingLegalEntityVAT ??
                          dictionary.en.noDataText}
                        :
                      </Typography.Paragraph>
                    </Col>
                    <Col span={10} offset={2}>
                      <Typography.Paragraph
                        className="custom-text"
                        ellipsis={{
                          rows: 2,
                          tooltip:
                            edcViewItem?.RecieverLegalEntityVoen ??
                            dictionary.en.noDataText
                        }}
                        strong
                      >
                        {edcViewItem?.RecieverLegalEntityVoen ??
                          dictionary.en.noDataText}
                      </Typography.Paragraph>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Typography.Paragraph
                        className="custom-text"
                        style={{
                          color: token.colorTextSecondary
                        }}
                        strong
                      >
                        {dictionary.en.sendingLegalEntity ??
                          dictionary.en.noDataText}
                        :
                      </Typography.Paragraph>
                    </Col>
                    <Col span={10} offset={2}>
                      <Typography.Paragraph
                        className="custom-text"
                        ellipsis={{
                          rows: 2,
                          tooltip:
                            edcViewItem?.SenderLegalEntity ??
                            dictionary.en.noDataText
                        }}
                        strong
                      >
                        {edcViewItem?.SenderLegalEntity ??
                          dictionary.en.noDataText}
                      </Typography.Paragraph>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Typography.Paragraph
                        className="custom-text"
                        style={{
                          color: token.colorTextSecondary
                        }}
                        strong
                      >
                        {dictionary.en.sendingLegalEntityVAT ??
                          dictionary.en.noDataText}
                        :
                      </Typography.Paragraph>
                    </Col>
                    <Col span={10} offset={2}>
                      <Typography.Paragraph
                        className="custom-text"
                        ellipsis={{
                          rows: 2,
                          tooltip:
                            edcViewItem?.SenderLegalEntityVoen ??
                            dictionary.en.noDataText
                        }}
                        strong
                      >
                        {edcViewItem?.SenderLegalEntityVoen ??
                          dictionary.en.noDataText}
                      </Typography.Paragraph>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Typography.Paragraph
                        className="custom-text"
                        style={{
                          color: token.colorTextSecondary
                        }}
                        strong
                      >
                        {dictionary.en.docCreatedate ??
                          dictionary.en.noDataText}
                        :
                      </Typography.Paragraph>
                    </Col>
                    <Col span={10} offset={2}>
                      <Typography.Paragraph
                        className="custom-text"
                        ellipsis={{
                          rows: 2,
                          tooltip: edcViewItem?.CreatedDate
                            ? formatDate(edcViewItem?.CreatedDate)
                            : dictionary.en.noDataText
                        }}
                        strong
                      >
                        {edcViewItem?.CreatedDate
                          ? formatDate(edcViewItem?.CreatedDate)
                          : dictionary.en.noDataText}
                      </Typography.Paragraph>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Typography.Paragraph
                        className="custom-text"
                        style={{
                          color: token.colorTextSecondary
                        }}
                        strong
                      >
                        {dictionary.en.docStartdate ?? dictionary.en.noDataText}
                        :
                      </Typography.Paragraph>
                    </Col>
                    <Col span={10} offset={2}>
                      <Typography.Paragraph
                        className="custom-text"
                        ellipsis={{
                          rows: 2,
                          tooltip: edcViewItem?.StartDate
                            ? formatDate(edcViewItem?.StartDate)
                            : dictionary.en.noDataText
                        }}
                        strong
                      >
                        {edcViewItem?.StartDate
                          ? formatDate(edcViewItem?.StartDate)
                          : dictionary.en.noDataText}
                      </Typography.Paragraph>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Typography.Paragraph
                        className="custom-text"
                        style={{
                          color: token.colorTextSecondary
                        }}
                        strong
                      >
                        {dictionary.en.status ?? dictionary.en.noDataText}:
                      </Typography.Paragraph>
                    </Col>
                    <Col span={10} offset={2}>
                      <Typography.Paragraph
                        className="custom-text"
                        ellipsis={{
                          rows: 2,
                          tooltip:
                            edcViewItem?.DocumentStatus ??
                            dictionary.en.noDataText
                        }}
                        strong
                      >
                        {edcViewItem?.DocumentStatus ??
                          dictionary.en.noDataText}
                      </Typography.Paragraph>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Typography.Paragraph
                        className="custom-text"
                        style={{
                          color: token.colorTextSecondary
                        }}
                        strong
                      >
                        {dictionary.en.summary ?? dictionary.en.noDataText}:
                      </Typography.Paragraph>
                    </Col>
                    <Col span={10} offset={2}>
                      <Typography.Paragraph
                        className="custom-text"
                        ellipsis={{
                          rows: 2,
                          tooltip:
                            edcViewItem?.Description ?? dictionary.en.noDataText
                        }}
                        strong
                      >
                        {edcViewItem?.Description ?? dictionary.en.noDataText}
                      </Typography.Paragraph>
                    </Col>
                  </Row>
                </div>
              </Card>
              <Card
                size="small"
                className="box box-margin-y"
                style={{ minHeight: '8%' }}
              >
                <Typography.Text>
                  {' '}
                  {dictionary.en.documents.toLocaleUpperCase('tr-TR')}
                </Typography.Text>
                <Divider
                  style={{
                    marginTop: token.marginXS,
                    marginBottom: token.marginXS
                  }}
                />
                {edcViewItem?.TableFileList?.length ? (
                  <div>
                    {edcViewItem?.TableFileList?.map(
                      (z: IEdcContractTableFileListItem) => (
                        <Row
                          key={z.id}
                          style={{
                            cursor: 'pointer'
                          }}
                          onClick={() => setActivePdfOnStage(z)}
                        >
                          <Col span={3}>
                            <Typography.Paragraph
                              style={{
                                color: token.colorTextSecondary
                              }}
                              strong
                            >
                              <FilePdfOutlined
                                style={{
                                  fontSize: token.fontSizeXL,
                                  color: token.red
                                }}
                                rev={undefined}
                              />
                            </Typography.Paragraph>
                          </Col>
                          <Col span={21}>
                            <Typography.Paragraph
                              ellipsis={{
                                rows: 2,
                                tooltip: z?.name ?? dictionary.en.noDataText
                              }}
                              strong
                            >
                              {z?.name ?? dictionary.en.noDataText}
                            </Typography.Paragraph>
                          </Col>
                        </Row>
                      )
                    )}
                  </div>
                ) : (
                  <AppEmpty />
                )}
              </Card>
              <Card
                size="small"
                className="box box-margin-y"
                style={{
                  minHeight: '39%',
                  maxHeight: '39%',
                  overflowY: 'auto'
                }}
              >
                <Typography.Text>
                  {' '}
                  {dictionary.en.relatedDocs.toLocaleUpperCase('tr-TR')}
                </Typography.Text>
                <Divider
                  style={{
                    marginTop: token.marginXS,
                    marginBottom: token.marginXS
                  }}
                />
                {edcViewItem?.RelationDocs?.length ? (
                  <div>
                    {edcViewItem?.RelationDocs?.map(
                      (z: IEdcItemRelationDoc) => (
                        <div>
                          <Row
                            onClick={() => {
                              if (z?.DocumentTypeId === 1) {
                                z?.isDraft
                                  ? window.open(
                                      `/edc/view-contract/draft/${z?.Id}`,
                                      '_blank'
                                    )
                                  : window.open(
                                      `/edc/view-contract/${z?.Id}`,
                                      '_blank'
                                    );
                              }
                              if (z?.DocumentTypeId === 2) {
                                z?.isDraft
                                  ? window.open(
                                      `/edc/view-addition/draft/${z?.Id}`,
                                      '_blank'
                                    )
                                  : window.open(
                                      `/edc/view-addition/${z?.Id}`,
                                      '_blank'
                                    );
                              }
                              if (z?.DocumentTypeId === 3) {
                                z?.isDraft
                                  ? window.open(
                                      `/edc/view-invoice/draft/${z?.Id}`,
                                      '_blank'
                                    )
                                  : window.open(
                                      `/edc/view-invoice/${z?.Id}`,
                                      '_blank'
                                    );
                              }
                              if (z?.DocumentTypeId === 4) {
                                z?.isDraft
                                  ? window.open(
                                      `/edc/view-act/draft/${z?.Id}`,
                                      '_blank'
                                    )
                                  : window.open(
                                      `/edc/view-act/${z?.Id}`,
                                      '_blank'
                                    );
                              }
                            }}
                            style={{
                              cursor: 'pointer'
                            }}
                            // onClick={() => setActivePdfOnStage(z)}
                          >
                            {/* <Col span={3}>
                          <Typography.Paragraph
                            style={{
                              color: token.colorTextSecondary
                            }}
                            strong
                          >
                            <FilePdfOutlined
                              style={{
                                fontSize: token.fontSizeXL,
                                color: token.red
                              }}
                              rev={undefined}
                            />
                          </Typography.Paragraph>
                        </Col> */}
                            <Col span={10}>
                              <Typography.Paragraph
                                ellipsis={{
                                  rows: 2,
                                  tooltip:
                                    z?.DocumentType ?? dictionary.en.noDataText
                                }}
                                strong
                              >
                                {z?.DocumentType ?? dictionary.en.noDataText}
                              </Typography.Paragraph>
                            </Col>
                            <Col span={11}>
                              <Typography.Paragraph
                                ellipsis={{
                                  rows: 2,
                                  tooltip:
                                    z?.DocumentCode ?? dictionary.en.noDataText
                                }}
                                strong
                              >
                                {z?.DocumentCode ?? dictionary.en.noDataText}
                              </Typography.Paragraph>
                            </Col>
                          </Row>
                          <Divider
                            style={{
                              marginTop: token.marginXXS
                            }}
                          />
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <AppEmpty />
                )}
              </Card>
            </Col>
            <Col
              span={16}
              lg={16}
              xl={16}
              md={24}
              style={{ marginTop: !lg ? '90px' : '' }}
            >
              <Card size="small" className="box box-margin-y">
                <Typography.Text>
                  {' '}
                  {dictionary.en.file.toLocaleUpperCase('tr-TR')}
                </Typography.Text>
                <Divider
                  style={{
                    marginTop: token.marginXS,
                    marginBottom: token.marginXS
                  }}
                />
                {!edcViewItem?.isDraft && (
                  <Row>
                    <Col span={6}>
                      <AppHandledSelect
                        name="version"
                        control={control}
                        errors={errors}
                        label={dictionary.en.version}
                        selectProps={{
                          showSearch: true,
                          id: 'version',
                          placeholder: selectPlaceholderText(
                            dictionary.en.version
                          ),
                          className: 'w-full',
                          options: generateOptionListPerNumber(
                            Number(activePdfOnStage?.totalVersion)
                          ),
                          size: 'large'
                        }}
                        formItemProps={{
                          labelAlign: 'left',
                          labelCol: { lg: 12, md: 16 },
                          style: { fontWeight: 'bolder' }
                        }}
                        onChangeApp={(e: number) => {
                          console.log(e);
                          getDocByVersions(e, activePdfOnStage?.type || 1);
                        }}
                      />
                    </Col>
                  </Row>
                )}

                <div>
                  {!versionLoading ? (
                    <TokenizedIframe
                      style={{
                        height: '900px'
                      }}
                      tokenized
                      src={activePdfOnStage?.fileUrl ?? ''}
                    />
                  ) : (
                    <Skeleton.Node className="w-full h-full" active>
                      <DotChartOutlined
                        rev={undefined}
                        style={{ fontSize: 40, color: '#bfbfbf' }}
                      />
                    </Skeleton.Node>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
          <Row>
            {!isDraft && (
              <ChangeLog id={id} refreshComponent={refreshComponent} />
            )}
          </Row>
          <RejectModal
            setRefreshComponent={setRefreshComponent}
            id={Number(id)}
            showRejectForm={showRejectForm}
            setShowRejectForm={setShowRejectForm}
          />
          <ReturnModal
            setRefreshComponent={setRefreshComponent}
            id={Number(id)}
            showReturnForm={showReturnForm}
            setShowReturnForm={setShowReturnForm}
          />
          <DeleteConfirmationModal
            onCancel={closeDeleteConfirmationModal}
            onOk={deleteDraft}
            visible={showDeleteConfirmationModal}
          />
        </div>
      ) : (
        <div>
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
        </div>
      )}
    </div>
  );
}

export default ViewAct;

import {
  Row,
  Col,
  Card,
  Descriptions,
  Typography,
  Dropdown,
  MenuProps,
  Button,
  theme,
  Grid
} from 'antd';
import DescriptionsItem from 'antd/es/descriptions/Item';
import { MoreOutlined } from '@ant-design/icons';
import { ButtonConfig, IEdcListItem, Permission } from '@/modules/edc/models';
// import { noDataText } from '@/utils/constants/texts';
import AppTag from '@/components/feedback/tag';
import { dictionary } from '@/utils/constants/dictionary';
import { useNavigate } from 'react-router-dom';
import { EdcServies } from '@/services/edc-services/edc-services';

import { toast } from 'react-toastify';
import { toastOptions } from '@/configs/global-configs';
import { Dispatch, SetStateAction } from 'react';
import { toCapitalize } from '@/utils/functions/functions';

interface IEdcListItemCardProps extends IEdcListItem {
  setSelectedItem?: Dispatch<SetStateAction<null | IEdcListItem>>;
  handleModalVisibility?: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent?: Dispatch<SetStateAction<boolean>>;
  setShowRejectForm?: Dispatch<SetStateAction<boolean>>;
  setShowReturnForm?: Dispatch<SetStateAction<boolean>>;
}

function EdcListItemCard(props: IEdcListItemCardProps) {
  const {
    Id,
    DocumentType,
    DocumentCode,
    RecieverLegalEntity,
    RecieverLegalEntityVoen,
    SenderLegalEntity,
    SenderLegalEntityVoen,
    DocumentStatusId,
    DocumentTypeId,
    permission,
    isDraft,
    setSelectedItem,
    handleModalVisibility,
    setRefreshComponent,
    setShowRejectForm,
    setShowReturnForm
  } = props;
  const navigate = useNavigate();
  const { useBreakpoint } = Grid;
  const { lg } = useBreakpoint();

  const approveDoc = async () => {
    if (Id) {
      const res = await EdcServies.getInstance().approveDoc(Id);
      if (res.IsSuccess) {
        setRefreshComponent && setRefreshComponent(z => !z);
        toast.success(res.Data?.message, toastOptions);
      } else {
        setRefreshComponent && setRefreshComponent(z => !z);
      }
    }
  };
  const actions: MenuProps['items'] = [
    {
      label: (
        <Typography.Text>{toCapitalize(dictionary.en.view)}</Typography.Text>
      ),
      key: ButtonConfig.viewButton
    }
  ];
  const generateMenuItems = (z: Permission) => {
    if (z.editButton) {
      actions.push({
        label: (
          <Typography.Text>
            {toCapitalize(dictionary.en.editBtn)}
          </Typography.Text>
        ),
        key: ButtonConfig.editButton
      });
    }

    if (z.deleteButton) {
      actions.push({
        label: (
          <Typography.Text>
            {toCapitalize(dictionary.en.delete)}
          </Typography.Text>
        ),
        key: ButtonConfig.deleteButton
      });
    }

    if (z.approveButton) {
      actions.push({
        label: (
          <Typography.Text>
            {toCapitalize(dictionary.en.confirm)}
          </Typography.Text>
        ),
        key: ButtonConfig.approveButton
      });
    }

    if (z.rejectButton) {
      actions.push({
        label: (
          <Typography.Text>
            {toCapitalize(dictionary.en.reject)}
          </Typography.Text>
        ),
        key: ButtonConfig.rejectButton
      });
    }

    if (z.returnButton) {
      actions.push({
        label: (
          <Typography.Text>
            {toCapitalize(dictionary.en.sendBack)}
          </Typography.Text>
        ),
        key: ButtonConfig.returnButton
      });
    }
  };

  permission && generateMenuItems(permission);

  const handleMenuClick: MenuProps['onClick'] = e => {
    if (e.key === '0') {
      if (DocumentTypeId === 1) {
        isDraft
          ? navigate(`/edc/update-contract/draft/${Id}`)
          : navigate(`/edc/update-contract/${Id}`);
      }
      if (DocumentTypeId === 2) {
        isDraft
          ? navigate(`/edc/update-addition/draft/${Id}`)
          : navigate(`/edc/update-addition/${Id}`);
      }
      if (DocumentTypeId === 3) {
        isDraft
          ? navigate(`/edc/update-invoice/draft/${Id}`)
          : navigate(`/edc/update-invoice/${Id}`);
      }
      if (DocumentTypeId === 4) {
        isDraft
          ? navigate(`/edc/update-act/draft/${Id}`)
          : navigate(`/edc/update-act/${Id}`);
      }
    }
    if (e.key === '1') {
      if (setSelectedItem) setSelectedItem({ Id, isDraft });
      if (handleModalVisibility) handleModalVisibility(true);
    }
    if (e.key === '2') {
      if (DocumentTypeId === 1) {
        isDraft
          ? navigate(`/edc/view-contract/draft/${Id}`)
          : navigate(`/edc/view-contract/${Id}`);
      }
      if (DocumentTypeId === 2) {
        isDraft
          ? navigate(`/edc/view-addition/draft/${Id}`)
          : navigate(`/edc/view-addition/${Id}`);
      }
      if (DocumentTypeId === 3) {
        isDraft
          ? navigate(`/edc/view-invoice/draft/${Id}`)
          : navigate(`/edc/view-invoice/${Id}`);
      }
      if (DocumentTypeId === 4) {
        isDraft
          ? navigate(`/edc/view-act/draft/${Id}`)
          : navigate(`/edc/view-act/${Id}`);
      }
    }
    if (e.key === '3') {
      approveDoc();
    }
    if (e.key === '4') {
      setSelectedItem && setSelectedItem(props);
      setShowRejectForm && setShowRejectForm(true);
    }
    if (e.key === '5') {
      setSelectedItem && setSelectedItem(props);
      setShowReturnForm && setShowReturnForm(true);
    }
  };

  const menuProps = {
    items: actions,
    onClick: handleMenuClick
  };

  const { useToken } = theme;
  const { token } = useToken();
  return (
    <Card
      style={{
        boxShadow: token.boxShadow,
        padding: token.paddingXS
      }}
    >
      <Row gutter={16}>
        <Col
          style={{
            borderRight: `1px solid ${token.colorBorderSecondary}`
          }}
          md={12}
          lg={6}
          xl={6}
        >
          <Descriptions size="small" layout="vertical">
            <DescriptionsItem
              labelStyle={{
                fontSize: token.fontSizeSM
              }}
              label={dictionary.en.documentType}
            >
              <Typography.Paragraph
                ellipsis={{
                  rows: 2,
                  tooltip: DocumentType ?? dictionary.en.noDataText
                }}
                strong
              >
                {DocumentType ?? dictionary.en.noDataText}
              </Typography.Paragraph>
            </DescriptionsItem>
          </Descriptions>

          <Descriptions size="small" layout="vertical">
            <DescriptionsItem
              labelStyle={{
                fontSize: token.fontSizeSM
              }}
              label={dictionary.en.documentNumber}
            >
              <Typography.Paragraph
                ellipsis={{
                  rows: 1,
                  tooltip: DocumentCode ?? dictionary.en.noDataText
                }}
                strong
              >
                {DocumentCode ?? dictionary.en.noDataText}
              </Typography.Paragraph>
            </DescriptionsItem>
          </Descriptions>
        </Col>
        <Col
          style={{
            borderRight: `1px solid ${token.colorBorderSecondary}`
          }}
          md={12}
          lg={6}
          xl={6}
        >
          <Descriptions size="small" layout="vertical">
            <DescriptionsItem
              labelStyle={{
                fontSize: token.fontSizeSM
              }}
              label={dictionary.en.receivingLegalEntity}
            >
              <Typography.Paragraph
                ellipsis={{
                  rows: 2,
                  tooltip: RecieverLegalEntity ?? dictionary.en.noDataText
                }}
                strong
              >
                {RecieverLegalEntity ?? dictionary.en.noDataText}
              </Typography.Paragraph>
            </DescriptionsItem>
          </Descriptions>

          <Descriptions size="small" layout="vertical">
            <DescriptionsItem
              labelStyle={{
                fontSize: token.fontSizeSM
              }}
              label={dictionary.en.receivingLegalEntityVAT}
            >
              <Typography.Paragraph
                ellipsis={{
                  rows: 1,
                  tooltip: RecieverLegalEntityVoen ?? dictionary.en.noDataText
                }}
                strong
              >
                {RecieverLegalEntityVoen ?? dictionary.en.noDataText}
              </Typography.Paragraph>
            </DescriptionsItem>
          </Descriptions>
        </Col>
        <Col
          style={{
            borderRight: `1px solid ${token.colorBorderSecondary}`
          }}
          md={12}
          lg={6}
          xl={6}
        >
          <Descriptions size="small" layout="vertical">
            <DescriptionsItem
              labelStyle={{
                fontSize: token.fontSizeSM
              }}
              label={dictionary.en.sendingLegalEntity}
            >
              <Typography.Paragraph
                ellipsis={{
                  rows: 2,
                  tooltip: SenderLegalEntity ?? dictionary.en.noDataText
                }}
                strong
              >
                {SenderLegalEntity ?? dictionary.en.noDataText}
              </Typography.Paragraph>
            </DescriptionsItem>
          </Descriptions>

          <Descriptions size="small" layout="vertical">
            <DescriptionsItem
              labelStyle={{
                fontSize: token.fontSizeSM
              }}
              label={dictionary.en.sendingLegalEntityVAT}
            >
              <Typography.Paragraph
                ellipsis={{
                  rows: 1,
                  tooltip: SenderLegalEntityVoen ?? dictionary.en.noDataText
                }}
                strong
              >
                {SenderLegalEntityVoen ?? dictionary.en.noDataText}
              </Typography.Paragraph>
            </DescriptionsItem>
          </Descriptions>
        </Col>
        <Col
          style={{
            borderRight: lg ? `1px solid ${token.colorBorderSecondary}` : 'none'
          }}
          md={6}
          lg={4}
          xl={4}
        >
          <div className="center h-full">
            <AppTag id={DocumentStatusId} />
            {/* <Tag
              style={{
                fontSize: token.fontSizeSM,
                padding: token.paddingXS
              }}
              color="warning"
            >
              {DocumentStatus?.toLocaleUpperCase('en-EN') ??
                noDataText?.toLocaleUpperCase('en-EN')}
            </Tag> */}
          </div>
        </Col>
        <Col md={6} lg={2} xl={2}>
          <div className="center h-full">
            <Dropdown menu={menuProps} trigger={['click']}>
              <Button icon={<MoreOutlined rev={undefined} />} />
            </Dropdown>
          </div>
        </Col>
      </Row>
    </Card>
  );
}

export default EdcListItemCard;

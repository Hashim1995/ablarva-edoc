/* eslint-disable no-nested-ternary */
import { dictionary } from '@/utils/constants/dictionary';
import { useState, useEffect } from 'react';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Row,
  Space,
  Spin,
  Typography,
  theme
} from 'antd';
import { HomeOutlined, DownOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { CirculationTemplateServies } from '@/services/circulation-template-services/circulation-template-service';
import { selectOption } from '@/models/common';
import TokenizedImage from '@/components/display/image';

import {
  ICycleMemberItemView,
  IGetSingleTemplateViewResponse,
  IGetUsersResponse,
  IGroupedCycleMemberItemView
} from '../models';
import EditTemplate from '../modals/edit-template';

function ViewCirculationTemplate() {
  const { id } = useParams();
  const { useToken } = theme;
  const { token } = useToken();
  const { Meta } = Card;

  const [loading, setLoading] = useState<boolean>(false);
  const [templateData, setTemplateData] =
    useState<IGetSingleTemplateViewResponse>();

  const [groupedCycleMembers, setGroupedCycleMembers] =
    useState<IGroupedCycleMemberItemView[]>();
  const [usersList, setUsersList] = useState<selectOption[]>([]);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [showTemplateUpdateModal, setShowTemplateUpdateModal] =
    useState<boolean>(false);
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const fetchUsers = async () => {
    setUsersLoading(true);

    const res: IGetUsersResponse =
      await CirculationTemplateServies.getInstance().getUsers();
    setUsersList(res.Data.Datas);
    setUsersLoading(false);
  };

  const getTemplateItemById = async (templateId: string) => {
    setLoading(true);
    const res: IGetSingleTemplateViewResponse =
      await CirculationTemplateServies.getInstance().getSingleTemplateView(
        templateId
      );

    if (res?.IsSuccess) {
      setTemplateData(res);
      const cycleMembers: ICycleMemberItemView[] =
        res?.Data?.documentApprovalCycleMembers.sort(
          (a, b) => a.order - b.order
        );

      const groupedCycleMembersArr = cycleMembers.reduce(
        (t: IGroupedCycleMemberItemView[], i) => {
          const { order } = i;

          if (order !== null && order !== undefined) {
            const index = t.findIndex(group => group.order === order);

            if (index === -1) {
              t.push({
                order,
                users: [i]
              });
            } else {
              t[index].users.push(i);
            }
          }

          return t;
        },
        []
      );

      setGroupedCycleMembers(groupedCycleMembersArr);

      setLoading(false);
    }
  };

  useEffect(() => {
    id && getTemplateItemById(id);
    fetchUsers();
  }, [refreshComponent]);

  return (
    <div>
      {' '}
      <Card size="small" className="box box-margin-y">
        <Row justify="space-between" align="middle">
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
                  <Link to="/settings/circulation-templates">
                    {dictionary.en.internalStructure}
                  </Link>
                )
              },
              {
                title: `${dictionary.en.template} - ${templateData?.Data?.name}`
              }
            ]}
          />

          <Button
            onClick={() => {
              setShowTemplateUpdateModal(true);
            }}
            type="primary"
            loading={usersLoading}
          >
            <Space>{dictionary.en.editBtn}</Space>
          </Button>
        </Row>
      </Card>
      <Card className="box box-margin-y">
        <Spin size="large" spinning={loading}>
          <Row style={{ padding: token.paddingXS }}>
            <Col span={6} style={{ padding: 10 }}>
              <Typography.Paragraph strong>
                {dictionary.en.information}
              </Typography.Paragraph>
              {templateData?.Data?.forInfo.map(t => (
                <Row>
                  <Card style={{ width: 300, marginTop: 10 }} loading={loading}>
                    <Meta
                      style={{ alignItems: 'center' }}
                      avatar={
                        <TokenizedImage
                          tokenized
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%'
                          }}
                          useCach
                          circle
                          src={t.file?.fileUrl ?? ''}
                        />
                      }
                      title={t.name}
                      description={false}
                    />
                  </Card>
                </Row>
              ))}
            </Col>
            <Col span={18}>
              <div style={{ width: '100%', overflow: 'auto' }}>
                <div style={{ width: 'fit-content', padding: 10 }}>
                  {groupedCycleMembers?.map((t, i) => {
                    const usersLength = t.users.length;
                    const previousUsersLength =
                      groupedCycleMembers[i - 1]?.users.length;
                    const nextUsersLength =
                      groupedCycleMembers[i + 1]?.users.length;
                    return (
                      <Row
                        // className="w-full"
                        wrap={false}
                        align="bottom"
                        justify="center"
                      >
                        {t.users.map((y, z) => (
                          <Col>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: 'column'
                              }}
                            >
                              {i !== 0 &&
                                usersLength === previousUsersLength &&
                                nextUsersLength !== 1 &&
                                previousUsersLength !== 1 && (
                                  // i !== usersLength + 1 &&
                                  <>
                                    {z === Math.floor(usersLength / 2) && (
                                      <Row
                                        className="w-full"
                                        align="middle"
                                        justify={
                                          usersLength % 2 === 0
                                            ? 'start'
                                            : 'center'
                                        }
                                      >
                                        <div
                                          style={{
                                            width: 2,
                                            height: 30,
                                            background: '#000'
                                          }}
                                        />
                                      </Row>
                                    )}

                                    <Row
                                      align="middle"
                                      className="w-full"
                                      justify={
                                        z === 0
                                          ? 'end'
                                          : z === usersLength - 1
                                          ? 'start'
                                          : 'center'
                                      }
                                    >
                                      <div
                                        style={{
                                          width:
                                            (z === 0 ||
                                              z === usersLength - 1) &&
                                            usersLength >= previousUsersLength
                                              ? '50%'
                                              : '100%',
                                          height: 2,
                                          background: '#000'
                                        }}
                                      />
                                    </Row>
                                  </>
                                )}
                              {i !== 0 && (
                                <Row justify="center">
                                  <Col>
                                    <Row justify="center">
                                      {' '}
                                      <div
                                        style={{
                                          width: 2,
                                          height: 100,
                                          background: '#000'
                                        }}
                                      />
                                    </Row>
                                    <Row justify="center">
                                      <DownOutlined />
                                    </Row>
                                  </Col>
                                </Row>
                              )}
                              <Row
                                style={{ paddingInline: 30 }}
                                align="middle"
                                justify="center"
                              >
                                <Card style={{ width: 300 }} loading={loading}>
                                  <Meta
                                    style={{ alignItems: 'center' }}
                                    avatar={
                                      <TokenizedImage
                                        tokenized
                                        style={{
                                          width: 40,
                                          height: 40,
                                          borderRadius: '50%'
                                        }}
                                        useCach
                                        circle
                                        src={y.file?.fileUrl ?? ''}
                                      />
                                    }
                                    title={y.name}
                                    description={y.Profession}
                                  />
                                </Card>
                              </Row>
                              {i !== groupedCycleMembers.length - 1 &&
                                (usersLength !== 1 ||
                                  nextUsersLength !== 1) && (
                                  <>
                                    <Row align="middle" justify="center">
                                      <div
                                        style={{
                                          width: 2,
                                          height: 30,
                                          background: '#000'
                                        }}
                                      />
                                    </Row>
                                    <Row
                                      align="middle"
                                      style={{
                                        width:
                                          usersLength < nextUsersLength
                                            ? `${
                                                (nextUsersLength -
                                                  usersLength) *
                                                100
                                              }%`
                                            : '100%'
                                      }}
                                      justify={
                                        z === 0
                                          ? 'end'
                                          : z === usersLength - 1
                                          ? 'start'
                                          : 'center'
                                      }
                                    >
                                      <div
                                        style={{
                                          width:
                                            (z === 0 ||
                                              z === usersLength - 1) &&
                                            usersLength >= nextUsersLength &&
                                            usersLength !== 1
                                              ? '50%'
                                              : '100%',
                                          height: 2,
                                          background: '#000'
                                        }}
                                      />
                                    </Row>
                                  </>
                                )}
                            </div>
                          </Col>
                        ))}
                      </Row>
                    );
                  })}
                </div>
              </div>
            </Col>
          </Row>
        </Spin>
      </Card>
      {showTemplateUpdateModal && id && (
        <EditTemplate
          users={usersList}
          setShowTemplateUpdateModal={setShowTemplateUpdateModal}
          setRefreshComponent={setRefreshComponent}
          showTemplateUpdateModal={showTemplateUpdateModal}
          selectedItem={id}
        />
      )}
    </div>
  );
}

export default ViewCirculationTemplate;

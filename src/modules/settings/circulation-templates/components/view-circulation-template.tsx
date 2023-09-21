/* eslint-disable no-unused-vars */
import { dictionary } from '@/utils/constants/dictionary';
import { useState, useEffect } from 'react';
import { Breadcrumb, Button, Card, Col, Row, Space, Spin, theme } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
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
  // eslint-disable-next-line no-unused-vars
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
      const groupedCycleMembersArr: IGroupedCycleMemberItemView[] = [];

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
                  <Link to="/circulation-templates">
                    {dictionary.en.internalStructure}
                  </Link>
                )
              },
              {
                title: `${dictionary.en.template} - ${id}`
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
            <Col span={24}>
              {templateData?.Data?.documentApprovalCycleMembers.map(t => (
                <Card style={{ width: 300 }} loading={loading}>
                  <Meta
                    style={{ alignItems: 'center' }}
                    avatar={
                      <TokenizedImage
                        tokenized
                        style={{ width: 40, height: 40, borderRadius: '50%' }}
                        useCach
                        circle
                        src={t.file?.fileUrl ?? ''}
                      />
                    }
                    title={t.name}
                    description={t.Profession}
                  />
                </Card>
              ))}
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

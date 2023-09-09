import { useState } from 'react';
import { Button, Card, Col, Row, Space, Spin, theme, Typography } from 'antd';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useLocalStorage } from 'usehooks-ts';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { login } from '@/services/adapter-config/asan-login';
import { dictionary } from '@/utils/constants/dictionary';

interface IEntity {
  Id: number;
  Name: string;
  Voen: string;
  Email?: string;
  PhoneNumber?: string;
  StatusId: number;
  ActivityField?: string;
  Address?: string;
}

function LegalEntities() {
  const entities: IEntity[] = useSelector(
    (state: RootState) => state.user.entities
  );

  const navigate = useNavigate();

  // eslint-disable-next-line no-unused-vars
  const [userToken, setUserToken] = useLocalStorage<any>('userToken', null);
  const [asanToken, setAsanToken] = useLocalStorage<any>('asanToken', null);
  const [loading, setLoading] = useState(false);
  const getUserToken = async (entityId: number) => {
    try {
      setLoading(true);
      const tokenRes = await login(asanToken, entityId).then(z => z);
      setUserToken(tokenRes?.Data?.Token);
      navigate('/home');
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const logOut = () => {
    setAsanToken(null);
  };

  const { useToken } = theme;
  const { token } = useToken();
  return (
    <Row justify="center" align="middle" className="h-full">
      <Col span={6}>
        <Space className="w-full" direction="vertical" size="middle">
          <Card
            loading={entities.length === 0}
            title="Select the company which you want to continue"
          >
            {!loading ? (
              <Space className="w-full" direction="vertical" size={'small'}>
                {entities?.map((t: IEntity) => (
                  <div
                    // disabled={loading}
                    key={t.Id}
                    onClick={() => getUserToken(t.Id)}
                    aria-hidden
                    style={{
                      border: '1px solid #f0f0f0',
                      borderRadius: 6,
                      padding: token.paddingSM,
                      background: loading ? token.colorBgBase : 'initial',
                      cursor: loading ? 'not-allowed' : 'initial',
                      pointerEvents: loading ? 'all' : 'initial'
                    }}
                  >
                    <Row
                      align={'middle'}
                      justify={'space-between'}
                      style={{ cursor: 'pointer' }}
                    >
                      <Col span={21}>
                        <Typography.Title
                          style={{
                            marginTop: 0
                          }}
                          ellipsis={{
                            rows: 1,
                            tooltip: t.Name ?? dictionary.en.noDataText
                          }}
                          level={5}
                        >
                          {t.Name ?? dictionary.en.noDataText}
                        </Typography.Title>
                        <Typography.Text>
                          {t.Voen ?? dictionary.en.noDataText}
                        </Typography.Text>
                      </Col>
                      <Col span={2} offset={1}>
                        <MdKeyboardArrowRight />
                      </Col>
                    </Row>
                  </div>
                ))}
              </Space>
            ) : (
              <Space
                className="w-full"
                direction="vertical"
                align="center"
                size={'small'}
              >
                <Spin size="large" />
              </Space>
            )}
          </Card>
          <Button
            style={{ height: 40 }}
            onClick={() => logOut()}
            block
            type="primary"
          >
            {dictionary.en.signOut.toLocaleUpperCase('en-EN')}
          </Button>
        </Space>
      </Col>
    </Row>
  );
}

export default LegalEntities;

import {
  Col,
  Dropdown,
  Layout,
  MenuProps,
  Row,
  Space,
  Typography,
  theme
} from 'antd';
import { useLocalStorage } from 'usehooks-ts';
import { useState } from 'react';
import { FaMoon, FaSun, FaUsers } from 'react-icons/fa';
import { BiLogOut, BiUser } from 'react-icons/bi';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
// import { noDataText } from '@/utils/constants/texts';
import { dictionary } from '@/utils/constants/dictionary';
import NotificationsPopover from '@/modules/notifications/components/popover';
import TokenizedImage from '@/components/display/image';
import Sidebar from '../static-components/sidebar';
import Footer from '../static-components/footer';

const { Header, Content } = Layout;
const { Text } = Typography;
function LayoutPage() {
  const user = useSelector((state: RootState) => state.user.user);
  // eslint-disable-next-line no-unused-vars
  const [userToken, setUserToken] = useLocalStorage<any>('userToken', null);
  const [isDarkTheme, setDarkTheme] = useLocalStorage('darkTheme', true);
  const [dropdownActive, setDropdownActive] = useState(false);
  const navigate = useNavigate();
  const toggleTheme = () => {
    setDarkTheme((prevValue: boolean) => !prevValue);
  };

  const handleMenuClick: MenuProps['onClick'] = e => {
    if (e.key === '0') {
      navigate('personal-cabinet');
    }
    if (e.key === '1') {
      navigate('legal-cabinet');
    }
    if (e.key === '2') {
      toggleTheme();
    }
    if (e.key === '3') {
      setUserToken(null);
    }
  };

  const handleOpenChange = (flag: boolean) => {
    setDropdownActive(flag);
  };

  const items: MenuProps['items'] = [
    {
      label: (
        <Row>
          <BiUser /> <Text>{dictionary.en.personalCabinet}</Text>
        </Row>
      ),
      key: '0'
    },
    {
      label: (
        <Row>
          <FaUsers /> <Text>{dictionary.en.legalCabinet}</Text>
        </Row>
      ),
      key: '1'
    },
    {
      label: (
        <Row>
          {isDarkTheme ? (
            <>
              <FaSun /> <Text>{dictionary.en.lightMode}</Text>
            </>
          ) : (
            <>
              <FaMoon /> <Text>{dictionary.en.nightMode}</Text>
            </>
          )}
        </Row>
      ),
      key: '2'
    },
    {
      label: (
        <Row>
          <BiLogOut /> <Text>{dictionary.en.logout}</Text>
        </Row>
      ),
      key: '3'
    }
  ];

  const { useToken } = theme;
  const { token } = useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout
        style={{
          paddingRight: 40,
          paddingLeft: 40,
          paddingTop: 20,
          paddingBottom: 20
        }}
      >
        <Header
          className="box"
          style={{
            position: 'sticky',
            top: 10,
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'end',
            lineHeight: 1,
            marginBottom: '15px'
          }}
        >
          <div style={{ paddingRight: '10px' }}>
            <Row align={'middle'} gutter={16}>
              <Col>
                <NotificationsPopover />
              </Col>
              <Col>
                <Space size={1} direction="vertical">
                  <Text>
                    {user?.Name && user?.Surname
                      ? `${user?.Name} ${user?.Surname}`
                      : dictionary.en.noDataText}
                  </Text>
                  <Text style={{ fontSize: token.fontSizeSM }}>
                    {user?.getLegalEntityDto?.Name ?? dictionary.en.noDataText}
                  </Text>
                </Space>
              </Col>
              <Col>
                <Dropdown
                  overlayClassName="user-dropdown"
                  menu={{ items, onClick: handleMenuClick }}
                  onOpenChange={handleOpenChange}
                  trigger={['click']}
                  className="pointer"
                  open={dropdownActive}
                >
                  <TokenizedImage
                    useCach
                    tokenized
                    circle
                    style={{ width: 40, height: 40, borderRadius: '50%' }}
                    src={user?.getFile?.fileUrl}
                  />
                </Dropdown>
              </Col>
            </Row>
          </div>
        </Header>

        <Content style={{ overflow: 'initial' }}>
          <div style={{ minHeight: '100vh' }}>
            <Outlet />
          </div>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default LayoutPage;

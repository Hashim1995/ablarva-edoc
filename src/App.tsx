import { useNavigate, useRoutes } from 'react-router-dom';
import { ConfigProvider, theme, ThemeConfig } from 'antd';
import { Suspense, useEffect, useState } from 'react';
import { useReadLocalStorage, useLocalStorage } from 'usehooks-ts';
import { useDispatch } from 'react-redux';
import routesList from '@core/routes/routes';
import SuspenseLoader from './core/static-components/suspense-loader';
import { getMyLegalEntities } from './services/adapter-config/asan-login';
import AuthLoader from './core/static-components/auth-loader';
import { setEntities, setUser } from './redux/auth/auth-slice';
import {
  AuthService,
  IAuthResponse
} from './services/auth-services/auth-services';
import notificationSocket from './redux/notification-socket';

function App() {
  const router = useRoutes(routesList);
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const darkMode = useReadLocalStorage('darkTheme');

  const themeConfig: ThemeConfig = {
    token: {
      paddingXL: 28,
      paddingLG: 20,
      paddingMD: 16,
      paddingSM: 10,
      paddingXS: 6,
      paddingXXS: 2,
      fontSizeXL: 17,
      fontSizeLG: 14,
      fontSizeSM: 10,
      colorBorder: '#e6e1e1',
      boxShadow:
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      colorLink: '#000'
    },
    components: {
      Layout: {
        colorBgHeader: darkMode ? '#141414' : '#fff',
        colorBgTrigger: darkMode ? '#141414' : '#fff'
      },

      Form: {
        marginLG: 8
      },
      Tabs: {
        horizontalMargin: ' 0 0 10px 0'
      },
      Menu: {
        iconSize: 17
      },
      Modal: {
        wireframe: true
      }
    },
    algorithm: darkMode ? darkAlgorithm : defaultAlgorithm
  };
  const [companyListLoader, setCompanyListLoader] = useState({
    status: false,
    message: ''
  });
  const [asanToken, setAsanToken] = useLocalStorage<any>('asanToken', null);
  const dispatch = useDispatch();

  const userToken: any = useReadLocalStorage('userToken');

  const navigate = useNavigate();

  const getMe = async () => {
    try {
      setCompanyListLoader({
        status: true,
        message: 'Preparing user informations'
      });
      const res: IAuthResponse = await AuthService.getInstance().getUserData();
      dispatch(setUser(res?.Data));
    } catch (err) {
      console.log(err);
    } finally {
      setCompanyListLoader({
        status: false,
        message: ''
      });
    }
  };

  const getEntitiesList = async (token: string) => {
    try {
      setCompanyListLoader({
        status: true,
        message: 'Preparing company informations'
      });
      const res = await getMyLegalEntities(token).then(z => z);
      dispatch(setEntities(res?.Data.Datas));
    } catch (err) {
      setAsanToken(null);
      navigate('/login');
      console.log(err);
    } finally {
      setCompanyListLoader({
        status: false,
        message: ''
      });
    }
  };

  const startNotificationSocket = async () => {
    try {
      await notificationSocket.start();
      console.log('SignalR Connected.');
    } catch (err) {
      console.log(err);
      setTimeout(startNotificationSocket, 5000);
    }
  };

  useEffect(() => {
    if (!asanToken) {
      navigate('/login');
    } else if (!userToken) {
      getEntitiesList(asanToken);
      navigate('/legal-entities');
    } else if (userToken) {
      getMe();
    }
  }, [asanToken, userToken]);

  useEffect(() => {
    userToken && startNotificationSocket();
    notificationSocket.onclose(async () => {
      console.log('Connection closed, retying...');
      await startNotificationSocket();
    });
  }, []);

  return (
    <main className="h-screen">
      <ConfigProvider theme={themeConfig}>
        {companyListLoader.status ? (
          <AuthLoader title={companyListLoader.message} />
        ) : (
          <Suspense fallback={<SuspenseLoader />}>{router}</Suspense>
        )}
      </ConfigProvider>
    </main>
  );
}

export default App;

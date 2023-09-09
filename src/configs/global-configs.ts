import { GlobalToken } from 'antd';
import { ToastOptions } from 'react-toastify';

const toastOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: undefined
};

const getTimeLineStyle = (token: GlobalToken) => ({
  fontSize: token.fontSizeHeading4,
  marginTop: token.marginXS,
  padding: token.paddingXS,
  borderColor: token.colorPrimary,
  borderWidth: token.lineWidthBold,
  borderStyle: 'solid',
  borderRadius: token.borderRadius,
  color: token.colorPrimary
});

export { toastOptions, getTimeLineStyle };

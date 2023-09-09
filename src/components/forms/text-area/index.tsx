import { Input } from 'antd';
// import type { TextAreaProps } from 'rc-textarea/lib/interface';

function AppTextArea(props: any) {
  const { TextArea } = Input;

  return <TextArea {...props} />;
}

export default AppTextArea;

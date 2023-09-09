import { Empty, EmptyProps } from 'antd';
// import { noDataText } from "@/utils/constants/texts";
import { dictionary } from '@/utils/constants/dictionary';

function AppEmpty(props: EmptyProps) {
  return (
    <Empty
      description={dictionary.en.empty}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      {...props}
    />
  );
}

export default AppEmpty;

import { Select, ConfigProvider, SelectProps, Empty } from 'antd';
// import { noDataText } from '@/utils/constants/texts';
import { dictionary } from '@/utils/constants/dictionary';

function AppSelect(props: SelectProps) {
  return (
    <ConfigProvider
      renderEmpty={() => (
        <Empty
          description={dictionary.en.noDataText}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    >
      <Select {...props} />
    </ConfigProvider>
  );
}

export default AppSelect;

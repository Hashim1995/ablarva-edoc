import { dictionary } from '@/utils/constants/dictionary';
import { TabsProps } from 'antd';

const edcListTabNavs: TabsProps['items'] = [
  {
    key: '1',
    label: dictionary.en.all
  },
  {
    key: '2',
    label: dictionary.en.sent
  },
  {
    key: '3',
    label: dictionary.en.received
  },
  {
    key: '4',
    label: dictionary.en.draft.toLocaleUpperCase()
  }
];

export { edcListTabNavs };

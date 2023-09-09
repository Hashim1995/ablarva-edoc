import { selectOption } from '@/models/common';
import { dictionary } from '@/utils/constants/dictionary';
import { MenuProps } from 'antd';

const DocumentTypeId: selectOption[] = [
  {
    value: 1,
    label: dictionary.en.contract
  },
  {
    value: 2,
    label: dictionary.en.attachment
  },
  {
    value: 3,
    label: dictionary.en.invoice
  },
  {
    value: 4,
    label: dictionary.en.act
  }
];

const Status: selectOption[] = [
  {
    value: 1,
    label: dictionary.en.pending
  },
  {
    value: 2,
    label: dictionary.en.returned
  },
  {
    value: 3,
    label: dictionary.en.agreed
  },
  {
    value: 4,
    label: dictionary.en.termination
  },
  {
    value: 5,
    label: dictionary.en.signed
  },
  {
    value: 6,
    label: dictionary.en.overdue
  },
  {
    value: 7,
    label: dictionary.en.canceled
  },
  {
    value: 8,
    label: dictionary.en.draft
  }
];

const items: MenuProps['items'] = [
  {
    label: dictionary.en.attachment,
    key: '2'
  },
  {
    label: dictionary.en.invoice,
    key: '3'
  },
  {
    label: dictionary.en.act,
    key: '4'
  }
];

export { DocumentTypeId, Status, items };

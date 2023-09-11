import React from 'react';
import { Tag, theme } from 'antd';
import { Status } from '@/modules/edc/constants/static-options';
// import { noDataText } from '@/utils/constants/texts';
import { dictionary } from '@/utils/constants/dictionary';

interface CustomTagProps {
  id?: number | string | null;
  color?: string;
  label?: string;
  fontSize?: string;
}

const StatusColors: Record<string, string> = {
  Pending: '#fa8c16',
  Returned: '#f5222d',
  Agreed: '#52c41a',
  Termination: '#fadb14',
  Signed: '#13c2c2',
  Overdue: '#722ed1',
  Canceled: '#5c0011',
  Draft: '#595959'
};

function AppTag({ id, color, label, fontSize }: CustomTagProps) {
  // Find the corresponding status object in the Status array
  const matchedStatus = Status.find(status => status.value === id);

  const { useToken } = theme;
  const { token } = useToken();

  // If id is provided and matches a value in the Status array, use its label and color
  if (id && matchedStatus) {
    return (
      <Tag
        style={{
          margin: 0,
          fontSize,
          padding: token.paddingXS
        }}
        color={StatusColors[matchedStatus.label]}
      >
        {matchedStatus.label?.toLocaleUpperCase('en-EN') ??
          dictionary.en.noDataText?.toLocaleUpperCase('en-EN')}
      </Tag>
    );
  }

  // If id is not provided or doesn't match, use the provided label and color
  if (label && color) {
    return (
      <Tag
        style={{
          fontSize,
          margin: 0,
          padding: token.paddingXS
        }}
        color={color}
      >
        {' '}
        {label?.toLocaleUpperCase('en-EN') ??
          dictionary.en.noDataText?.toLocaleUpperCase('en-EN')}
      </Tag>
    );
  }

  // If neither id nor label and color are provided, return an empty span
  return (
    <Tag
      style={{
        fontSize,
        padding: token.paddingXS
      }}
      color={'blue'}
    >
      {dictionary.en.noDataText?.toLocaleUpperCase('en-EN')}
    </Tag>
  );
}

export default AppTag;

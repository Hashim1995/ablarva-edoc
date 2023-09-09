import { Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { Form, FormItemProps, SelectProps } from 'antd';
import AppSelect from './index';

interface IAppHandledSelect {
  label?: string;
  name: string;
  control?: any;
  rules?: Omit<
    RegisterOptions<FieldValues>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  required?: boolean;
  placeholder?: string;
  errors?: any;
  onChangeApp?: any;
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
  getLabelOnChange?: boolean;
}

function AppHandledSelect({
  label,
  name,
  control,
  rules,
  required,
  placeholder,
  errors,
  onChangeApp,
  selectProps,
  formItemProps,
  getLabelOnChange = false
}: IAppHandledSelect) {
  return (
    <Form.Item
      label={<span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
      // labelCol={{ span: 24 }}
      required={required}
      htmlFor={name}
      tooltip={errors[name] ? errors[name].message : ''}
      name={name}
      {...formItemProps}
    >
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <AppSelect
            value={value}
            status={required && errors[name] ? 'error' : undefined}
            onChange={(e, a) => {
              onChange(e);
              if (onChangeApp) {
                getLabelOnChange ? onChangeApp(a) : onChangeApp(e);
              }
            }}
            placeholder={placeholder}
            {...selectProps}
          />
        )}
      />
    </Form.Item>
  );
}

export default AppHandledSelect;

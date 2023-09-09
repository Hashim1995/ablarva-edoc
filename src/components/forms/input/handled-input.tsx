import { Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { Form, FormItemProps, Input, InputProps } from 'antd';

interface IAppHandledInput {
  label?: string;
  name: string;
  control: any;
  rules?: Omit<
    RegisterOptions<FieldValues>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  required?: boolean;
  inputType?: string;
  placeholder?: string;
  errors?: any;
  onChangeApp?: any;
  inputProps?: InputProps;
  formItemProps?: FormItemProps;
}

function AppHandledInput({
  label,
  name,
  control,
  rules,
  required,
  inputType,
  placeholder,
  errors,
  onChangeApp,
  inputProps,
  formItemProps
}: IAppHandledInput) {
  return (
    <Form.Item
      label={<span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
      // labelCol={{ span: 24, }}
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
          <Input
            type={inputType || 'text'}
            id={name}
            onChange={e => {
              onChange(e);
              onChangeApp && onChangeApp(e);
            }}
            value={value}
            status={required && errors[name] ? 'error' : undefined}
            placeholder={placeholder || ''}
            {...inputProps}
          />
        )}
      />
    </Form.Item>
  );
}

export default AppHandledInput;

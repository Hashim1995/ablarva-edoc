import { Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { Form, FormItemProps } from 'antd';
import AppTextArea from './index';

interface IAppHandledInput {
  label?: string;
  name: string;
  control: any;
  rules?: Omit<
    RegisterOptions<FieldValues>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  required?: boolean;
  textareaType?: string;
  placeholder?: string;
  errors?: any;
  onChangeApp?: any;
  textareaProps?: any;
  formItemProps?: FormItemProps;
}

function AppHandledTextArea({
  label,
  name,
  control,
  rules,
  required,
  placeholder,
  errors,
  onChangeApp,
  textareaProps,
  formItemProps
}: IAppHandledInput) {
  return (
    <Form.Item
      label={label}
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
          <AppTextArea
            id={name}
            onInput={(e: any) => {
              onChange(e);
              onChangeApp && onChangeApp(e);
            }}
            value={value}
            status={required && errors[name] ? 'error' : undefined}
            placeholder={placeholder || ''}
            {...textareaProps}
          />
        )}
      />
    </Form.Item>
  );
}

export default AppHandledTextArea;

import { Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { DatePicker, Form, FormItemProps, DatePickerProps } from 'antd';

interface IAppHandledDate {
  label?: string;
  name: string;
  control: any;
  rules?: Omit<
    RegisterOptions<FieldValues>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  required?: boolean;
  placeholder?: string;
  errors?: any;
  onChangeApp?: any;
  dateProps?: DatePickerProps;
  formItemProps?: FormItemProps;
}

function AppHandledDate({
  label,
  name,
  control,
  rules,
  required,
  placeholder,
  errors,
  onChangeApp,
  dateProps,
  formItemProps
}: IAppHandledDate) {
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
          <DatePicker
            value={value}
            status={required && errors[name] ? 'error' : undefined}
            onChange={e => {
              onChange(e);
              onChangeApp && onChangeApp(e);
            }}
            placeholder={placeholder}
            {...dateProps}
          />
        )}
      />
    </Form.Item>
  );
}

export default AppHandledDate;

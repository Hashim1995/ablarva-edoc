import { Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { Form, FormItemProps, Radio } from 'antd';
import { RadioProps, RadioGroupProps } from 'antd/es/radio';
import { ReactNode } from 'react';

interface IAppHandledRadio {
  label?: string;
  name: string;
  control?: any;
  rules?: Omit<
    RegisterOptions<FieldValues>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  required?: boolean;
  errors?: any;
  onChangeApp?: any;
  radioProps?: RadioProps;
  radioGroupProps?: RadioGroupProps;
  formItemProps?: FormItemProps;
  isGroup?: boolean;
  children?: ReactNode;
  val?: string | number;
}

function AppHandledRadio({
  label,
  name,
  control,
  rules,
  required,
  errors,
  onChangeApp,
  radioProps,
  radioGroupProps,
  formItemProps,
  isGroup,
  children,
  val
}: IAppHandledRadio) {
  return isGroup ? (
    <Form.Item
      label={label}
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
          <Radio.Group
            {...radioGroupProps}
            id={name}
            onChange={e => {
              onChange(e);
              onChangeApp && onChangeApp(e);
            }}
            value={value}
          >
            {children}
          </Radio.Group>
        )}
      />
    </Form.Item>
  ) : (
    <Radio id={name} value={val} {...radioProps}>
      {label}
    </Radio>
  );
}

export default AppHandledRadio;

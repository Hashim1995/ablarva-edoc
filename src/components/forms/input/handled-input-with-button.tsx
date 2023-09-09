import { Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { Col, Form, FormItemProps, Input, Row } from 'antd';
import { InputProps } from 'antd/es/input';
import { ReactNode } from 'react';

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
  btn?: ReactNode;
}

function AppHandledInputWithButton({
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
  formItemProps,
  btn
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
      <Row justify="space-between" align="middle">
        <Col span={22}>
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
        </Col>
        <Col span={2}>
          <Row justify="end">{btn}</Row>
        </Col>
      </Row>
    </Form.Item>
  );
}

export default AppHandledInputWithButton;

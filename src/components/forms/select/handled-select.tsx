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
  IsDynamic?: boolean;
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
  IsDynamic,
  getLabelOnChange = false
}: IAppHandledSelect) {
  let tooltip: string;
  let status: 'error' | 'warning' | undefined;
  if (IsDynamic) {
    const dynamicNameArray = name.split('.');
    const dynamicName = dynamicNameArray[0];
    const index = Number(dynamicNameArray[1]);
    const key = dynamicNameArray[2];

    status =
      required && errors[dynamicName] && errors[dynamicName][index]
        ? 'error'
        : undefined;
    tooltip =
      errors[dynamicName] &&
      errors[dynamicName][index] &&
      errors[dynamicName][index][key]?.message;
  } else {
    status = required && errors[name] ? 'error' : undefined;
    tooltip = errors[name] ? errors[name].message : '';
  }

  return (
    <Form.Item
      label={<span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
      // labelCol={{ span: 24 }}
      required={required}
      htmlFor={name}
      tooltip={tooltip}
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
            status={status}
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

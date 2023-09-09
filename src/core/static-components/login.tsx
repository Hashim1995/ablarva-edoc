import { useState } from 'react';
import { Button, Col, Form, Row, Space } from 'antd';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLocalStorage } from 'usehooks-ts';
import AppHandledInput from '@/components/forms/input/handled-input';
import { dictionary } from '@/utils/constants/dictionary';
import { inputValidationText } from '@/utils/constants/validations';
import { inputPlaceholderText } from '@/utils/constants/texts';
import { ILogin, ILoginResponse } from '@/models/user';
import { AuthService } from '@/services/auth-services/auth-services';

function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ILogin>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const [isFormSubmiting, setIsFormSubmiting] = useState<boolean>(false);
  // eslint-disable-next-line no-unused-vars
  const [asanToken, setAsanToken] = useLocalStorage<any>('asanToken', null);
  const onSubmit: SubmitHandler<ILogin> = async (data: ILogin) => {
    setIsFormSubmiting(true);

    const payload = {
      email: data.email,
      password: data.password
    };

    const res: ILoginResponse = await AuthService.getInstance().login(
      payload,
      () => setIsFormSubmiting(false)
    );

    if (res.IsSuccess) {
      setAsanToken(res.Data.Token);
    }
    setIsFormSubmiting(false);
  };

  return (
    <Row align={'middle'} justify={'center'} className="h-screen">
      <Col span={6}>
        <Form
          layout="vertical"
          onFinish={handleSubmit(onSubmit)}
          id="login-form"
        >
          <Space className="w-full" direction="vertical">
            <AppHandledInput
              label={dictionary.en.email}
              name="email"
              rules={{
                required: {
                  value: true,
                  message: inputValidationText(dictionary.en.email)
                },
                validate: {
                  checkOnlyEnglishChars: (value: string) =>
                    /^[\w\\.-]+@[\w\\.-]+\.\w+$/.test(value) ||
                    'Please enter a valid e-mail address.'
                }
              }}
              required
              control={control}
              inputType="text"
              placeholder={inputPlaceholderText(dictionary.en.email)}
              errors={errors}
            />
            <AppHandledInput
              label={dictionary.en.password}
              name="password"
              rules={{
                required: {
                  value: true,
                  message: inputValidationText(dictionary.en.password)
                }
              }}
              required
              control={control}
              inputType="password"
              placeholder={inputPlaceholderText(dictionary.en.password)}
              errors={errors}
            />

            <Button
              block
              disabled={isFormSubmiting}
              type="primary"
              htmlType="submit"
            >
              {dictionary.en.login}
            </Button>
          </Space>
        </Form>
      </Col>
    </Row>
  );
}

export default Login;

import { useState } from 'react';
import { Button, Col, Form, Row, Space, theme } from 'antd';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLocalStorage } from 'usehooks-ts';
import AppHandledInput from '@/components/forms/input/handled-input';
import { dictionary } from '@/utils/constants/dictionary';
import { inputValidationText } from '@/utils/constants/validations';
import { inputPlaceholderText } from '@/utils/constants/texts';
import { ILogin, ILoginResponse } from '@/models/user';
import { ReactComponent as Logo } from '@/assets/images/logo2.svg';
import { AuthService } from '@/services/auth-services/auth-services';
import { ReactComponent as Illustration } from '@/assets/images/illustration.svg';

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

  const { useToken } = theme;
  const { token } = useToken();

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
    <Row>
      <Col span={12}>
        <Row className="h-screen" align={'middle'} justify={'center'}>
          <Col span={12}>
            <Row className="w-full" align="middle">
              <Col span={15}>
                <Logo
                  className="w-full"
                  style={{
                    height: 'fit-content',
                    marginBottom: 40
                  }}
                />
              </Col>
              <Col span={24}>
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
                      loading={isFormSubmiting}
                      type="primary"
                      htmlType="submit"
                    >
                      {dictionary.en.login}
                    </Button>
                  </Space>
                </Form>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col span={12}>
        <Row
          className="w-full h-full"
          justify="center"
          align="middle"
          style={{ backgroundColor: token.colorPrimary }}
        >
          <Col span={18}>
            <Illustration className="w-full" />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default Login;

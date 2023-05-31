import { Card, Form, Typography, Input, Button, Row, Col } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useStore } from 'effector-react';
import {
  $email,
  $formPending,
  $password,
  emailChanged,
  formSubmitted,
  passwordChanged,
} from './model';
import { Link } from 'atomic-router-react';
import { routes } from '~/shared/routing';

export const SignInForm = () => {
  const formPending = useStore($formPending);

  return (
    <Card
      style={{ width: '90%', maxWidth: 400, padding: '12px 24' }}
      bordered={false}
    >
      <Form name="sign-up" initialValues={{ remember: true }}>
        <Typography.Title
          level={3}
          style={{ textAlign: 'center', margin: 0, marginBottom: 24 }}
        >
          Вход
        </Typography.Title>

        <EmailInput />

        <PasswordInput />

        <Form.Item>
          <Button
            type="primary"
            loading={formPending}
            onClick={() => formSubmitted()}
            htmlType="submit"
            style={{ width: '100%' }}
          >
            Войти
          </Button>
        </Form.Item>

        <Row justify="center">
          <Col>
            <Typography.Text>
              Нет аккаунта?{' '}
              <Link to={routes.signUp}>
                <Typography.Link>Зарегистрироваться</Typography.Link>
              </Link>
            </Typography.Text>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

const EmailInput = () => {
  const email = useStore($email);

  return (
    <Form.Item
      name="email"
      valuePropName="email"
      rules={[{ required: true, message: 'Please input your email!' }]}
    >
      <Input
        prefix={<MailOutlined rev />}
        value={email}
        onChange={(evt) => emailChanged(evt.currentTarget.value)}
        placeholder="Почта"
      />
    </Form.Item>
  );
};

const PasswordInput = () => {
  const password = useStore($password);

  return (
    <Form.Item
      name="password"
      valuePropName="password"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password
        prefix={<LockOutlined rev />}
        value={password}
        onChange={(evt) => passwordChanged(evt.currentTarget.value)}
        placeholder="Пароль"
      />
    </Form.Item>
  );
};

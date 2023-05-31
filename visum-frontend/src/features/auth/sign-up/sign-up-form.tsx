import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Card, Form, Typography, Input, Button, Row, Col } from 'antd';
import {
  $email,
  $formPending,
  $password,
  $username,
  emailChanged,
  formSubmitted,
  passwordChanged,
  usernameChanged,
} from './model';
import { useStore } from 'effector-react';
import { Link } from 'atomic-router-react';
import { routes } from '~/shared/routing';

export const SignUpForm = () => {
  const formPending = useStore($formPending);

  return (
    <Card
      style={{ width: '90%', maxWidth: 400, padding: '12px 24' }}
      bordered={false}
    >
      <Form
        name="sign-up"
        onFinish={() => {
          formSubmitted();
        }}
        initialValues={{ remember: true }}
      >
        <Typography.Title
          level={3}
          style={{ textAlign: 'center', margin: 0, marginBottom: 24 }}
        >
          Регистрация
        </Typography.Title>

        <UsernameInput />
        <EmailInput />
        <PasswordInput />

        <Form.Item>
          <Button
            type="primary"
            loading={formPending}
            htmlType="submit"
            style={{ width: '100%' }}
          >
            Зарегистрироваться
          </Button>
        </Form.Item>

        <Row justify="center">
          <Col>
            <Typography.Text>
              Уже имеете аккаунт?{' '}
              <Link to={routes.signIn}>
                <Typography.Link>Войти</Typography.Link>
              </Link>
            </Typography.Text>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

const UsernameInput = () => {
  const username = useStore($username);

  return (
    <Form.Item
      name="username"
      valuePropName="username"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input
        prefix={<UserOutlined rev />}
        value={username}
        onChange={(evt) => usernameChanged(evt.currentTarget.value)}
        placeholder="Имя"
      />
    </Form.Item>
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

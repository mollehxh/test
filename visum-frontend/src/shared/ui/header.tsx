import { BulbOutlined } from '@ant-design/icons';
import { Card, Row, Col, Button, Dropdown, MenuProps, Avatar } from 'antd';
import { useUnit } from 'effector-react';
import { useContext } from 'react';
import { ThemeContext } from '~/app/theme-provider';
import { $session, signOut } from '~/entities/session/model';

export const Header = () => {
  const t = useContext(ThemeContext);
  const session = useUnit($session);

  return (
    <Card
      style={{
        textAlign: 'center',
        borderRadius: 0,
        padding: '0 24px',
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 1049,
      }}
      bodyStyle={{ padding: '16px 0' }}
      bordered={false}
    >
      <Row align="middle" justify="space-between">
        <Col>
          <Button onClick={() => t.handleClick()} icon={<BulbOutlined rev />} />
        </Col>
        <Col
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {session && (
            <>
              <Dropdown menu={{ items }}>
                <Button type="primary">{session.username}</Button>
              </Dropdown>
              <Avatar
                style={{
                  marginLeft: 12,
                }}
                src={session.avatar}
              />
            </>
          )}
        </Col>
      </Row>
    </Card>
  );
};

const items: MenuProps['items'] = [
  {
    key: '1',
    label: <a onClick={() => signOut()}>Выход</a>,
  },
];

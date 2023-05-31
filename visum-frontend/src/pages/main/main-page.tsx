import { Input, Button, Card, Typography, Col, Row } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { routes } from '~/shared/routing';
import { AppShell, Header } from '~/shared/ui';
import { $rooms, $videoUrl, submitUrl, videoUrlChanged } from './model';
import { useUnit } from 'effector-react';

export const MainPage = () => {
  const rooms = useUnit($rooms);
  const videoUrl = useUnit($videoUrl);

  return (
    <AppShell top={<Header />}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '12px',
        }}
      >
        <div style={{ width: '100%', maxWidth: '800px', margin: '24px 0' }}>
          <Typography.Title style={{ textAlign: 'center' }}>
            Visum
          </Typography.Title>

          <div style={{ width: '100%', display: 'flex', marginBottom: '24px' }}>
            <Input
              size="large"
              style={{ flex: '1 1 auto' }}
              value={videoUrl}
              onChange={(evt) => videoUrlChanged(evt.currentTarget.value)}
              prefix={<LinkOutlined rev />}
              placeholder="Введите ссылку на Youtube видео"
            />
            <Button
              onClick={() => {
                submitUrl();
              }}
              size="large"
              type="primary"
              style={{ marginLeft: '12px' }}
            >
              Создать
            </Button>
          </div>
          <Row gutter={[16, 16]} justify="start">
            {rooms.map((room: any) => (
              <Col key={room.id} xs={24} sm={12} md={8} lg={8} xl={8}>
                <Card
                  onClick={() => {
                    routes.room.open({ roomId: String(room.roomId) });
                  }}
                  style={{ width: '100%', cursor: 'pointer' }}
                  cover={
                    <img
                      src={room.preview}
                      style={{
                        maxHeight: '144px',
                        objectFit: 'cover',
                      }}
                    />
                  }
                >
                  <Card.Meta
                    title={room.title}
                    description={room.creator.username}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </AppShell>
  );
};

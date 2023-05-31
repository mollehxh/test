import 'video-react/dist/video-react.css';
import React, { useEffect, useRef, useState } from 'react';
import { Card, Row, Col, Input, Button, List, Avatar, Collapse } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { controls } from '~/shared/routing';
import { AppShell, Header } from '~/shared/ui';
import { useBindPlayer } from '~/shared/lib/effector-youtube-player';
import {
  $message,
  $messages,
  $roomMembers,
  messageChanged,
  pauseClicked,
  playClicked,
  sendMessageClicked,
  timeChanged,
  youtubePlayer,
} from './model';
import ReactPlayer from 'react-player';
import { Controls, Player } from '~/shared/lib/effector-youtube-player/player';
import { useUnit } from 'effector-react';

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Message {
  id: string;
  text: string;
  user: User;
}

export const RoomPage = () => {
  // const [message, setMessage] = useState<string>('');
  const message = useUnit($message);
  const members = useUnit($roomMembers);
  const messages = useUnit($messages);

  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    messageChanged(event.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      sendMessageClicked();
    }
  };

  return (
    <AppShell top={<Header />}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 12px' }}>
        <Button
          style={{
            marginBottom: '24px',
          }}
          type="link"
          onClick={() => controls.back()}
        >
          <LeftOutlined rev />
          Назад
        </Button>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card
              style={{
                height: '437px',
                overflow: 'hidden',
              }}
              bodyStyle={{
                padding: 0,
                height: '100%',
              }}
            >
              <Player
                onPause={pauseClicked}
                onPlay={playClicked}
                onTimeChanged={timeChanged}
                model={youtubePlayer}
              />
            </Card>
          </Col>
        </Row>

        <Collapse style={{ marginTop: 16 }}>
          <Collapse.Panel header="Список пользователей" key="1">
            <List<User>
              dataSource={members}
              renderItem={(member: any) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={member.avatar} />}
                    title={member.username}
                  />
                </List.Item>
              )}
              style={{ overflowY: 'scroll', maxHeight: '250px' }}
            />
          </Collapse.Panel>
        </Collapse>
        <div style={{ marginTop: '16px' }}>
          <Card title="Чат">
            <List
              dataSource={messages}
              renderItem={(message) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={message.avatar} />}
                    title={message.username}
                    description={message.text}
                  />
                </List.Item>
              )}
              style={{ overflowY: 'scroll', height: '250px' }}
            />
            <div style={{ marginTop: '16px' }}>
              <div style={{ width: '100%', display: 'flex' }}>
                <Input
                  value={message}
                  onChange={handleInputChange}
                  style={{ flex: '1 1 auto' }}
                  placeholder="Введите сообщение..."
                />
                <Button
                  onClick={handleSendMessage}
                  type="primary"
                  style={{ marginLeft: '12px' }}
                >
                  Отправить
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
};

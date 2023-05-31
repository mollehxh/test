import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

export const PageLoader = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Spin indicator={<LoadingOutlined rev style={{ fontSize: 48 }} />} />
    </div>
  );
};

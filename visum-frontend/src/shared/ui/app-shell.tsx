import { Layout } from 'antd';

export const AppShell = ({ top, children }: any) => {
  return (
    <Layout style={{ minHeight: '100vh', paddingTop: 64 }}>
      {top}
      <Layout.Content>{children}</Layout.Content>
    </Layout>
  );
};

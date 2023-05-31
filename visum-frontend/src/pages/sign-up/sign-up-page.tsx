import { SignUpForm } from '~/features/auth/sign-up/sign-up-form';
import { AppShell, Header } from '~/shared/ui';

export const SignUpPage = () => {
  return (
    <AppShell top={<Header />}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '20vh',
        }}
      >
        <SignUpForm />
      </div>
    </AppShell>
  );
};

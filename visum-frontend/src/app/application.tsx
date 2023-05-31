import { RouterProvider } from 'atomic-router-react';
import { Pages } from '~/pages';
import { router } from '~/shared/routing';
import { ThemeProvider } from './theme-provider';
import 'normalize.css';

export const Application = () => {
  return (
    <>
      <ThemeProvider>
        <RouterProvider router={router}>
          <Pages />
        </RouterProvider>
      </ThemeProvider>
    </>
  );
};

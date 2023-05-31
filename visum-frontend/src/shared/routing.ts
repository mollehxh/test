import { sample } from 'effector';
import { createBrowserHistory } from 'history';
import {
  createHistoryRouter,
  createRoute,
  createRouterControls,
} from 'atomic-router';
import { appStarted } from '~/shared/config/init';

export const routes = {
  main: createRoute(),
  room: createRoute<{ roomId: string }>(),
  signIn: createRoute(),
  signUp: createRoute(),
};

export const controls = createRouterControls();

export const router = createHistoryRouter({
  routes: [
    {
      path: '/',
      route: routes.main,
    },
    {
      path: '/room/:roomId',
      route: routes.room,
    },
    {
      path: '/sign-in',
      route: routes.signIn,
    },
    {
      path: '/sign-up',
      route: routes.signUp,
    },
  ],
  controls,
});

sample({
  clock: appStarted,
  fn: () => createBrowserHistory(),
  target: router.setHistory,
});

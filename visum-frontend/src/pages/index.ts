import { createRoutesView } from 'atomic-router-react';
import { MainRoute } from './main';
import { RoomRoute } from './room';
import { SignInRoute } from './sign-in';
import { SignUpRoute } from './sign-up';

export const Pages = createRoutesView({
  routes: [MainRoute, RoomRoute, SignUpRoute, SignInRoute],
});

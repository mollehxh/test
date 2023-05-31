import { anonymousRoute, currentRoute } from './model';
import { createRouteView } from 'atomic-router-react';
import { SignInPage } from './sign-in-page';
import { PageLoader } from '~/shared/ui';

export const SignInRoute = {
  route: currentRoute,
  view: createRouteView({
    route: anonymousRoute,
    view: SignInPage,
    otherwise: PageLoader,
  }),
};

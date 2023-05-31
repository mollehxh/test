import { createRouteView } from 'atomic-router-react';
import { anonymousRoute, currentRoute } from './model';
import { SignUpPage } from './sign-up-page';
import { PageLoader } from '~/shared/ui';

export const SignUpRoute = {
  route: currentRoute,
  view: createRouteView({
    route: anonymousRoute,
    view: SignUpPage,
    otherwise: PageLoader,
  }),
};

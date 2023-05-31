import { createRouteView } from 'atomic-router-react';
import { MainPage } from './main-page';
import { authorizedRoute, currentRoute } from './model';
import { PageLoader } from '~/shared/ui';

export const MainRoute = {
  route: currentRoute,
  view: createRouteView({
    route: authorizedRoute,
    view: MainPage,
    otherwise: PageLoader,
  }),
};

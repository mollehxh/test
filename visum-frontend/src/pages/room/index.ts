import { createRouteView } from 'atomic-router-react';
import { authorizedRoute, currentRoute } from './model';
import { RoomPage } from './room-page';
import { PageLoader } from '~/shared/ui';

export const RoomRoute = {
  route: currentRoute,
  view: createRouteView({
    route: authorizedRoute,
    view: RoomPage,
    otherwise: PageLoader,
  }),
};

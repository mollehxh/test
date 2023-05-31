import {
  Effect,
  Event,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';
import {
  RouteInstance,
  RouteParams,
  RouteParamsAndQuery,
  chainRoute,
} from 'atomic-router';
import { persist } from 'effector-storage/local';
import { debug } from 'patronum';
import { getSession } from '~/shared/api/internal';

enum AuthStatus {
  Initial = 0,
  Pending,
  Anonymous,
  Authenticated,
}

export const getSessionFx = createEffect(getSession);

export const $session = createStore<any>(null);
const $authenticationStatus = createStore(AuthStatus.Initial);
export const $token = createStore('');

export const resetToken = createEvent();
export const resetSession = createEvent();
export const signOut = createEvent();

$token.on(resetToken, () => '');
$session.on(resetSession, () => null);

sample({
  clock: signOut,
  target: [resetToken, resetSession, getSessionFx],
});

persist({
  store: $token,
  key: 'token',
});

$session.on(getSessionFx.doneData, (_, session) => session);

$authenticationStatus.on(getSessionFx, (status) => {
  if (status === AuthStatus.Initial) return AuthStatus.Pending;
  return status;
});
$authenticationStatus.on(getSessionFx.done, () => AuthStatus.Authenticated);
$authenticationStatus.on(getSessionFx.fail, () => AuthStatus.Anonymous);

interface ChainParams<Params extends RouteParams> {
  otherwise?: Event<void> | Effect<void, any, any>;
}

export function chainAuthorized<Params extends RouteParams>(
  route: RouteInstance<Params>,
  { otherwise }: ChainParams<Params> = {}
): RouteInstance<any> {
  const sessionCheckStarted = createEvent<RouteParamsAndQuery<Params>>();
  const sessionReceivedAnonymous = createEvent<RouteParamsAndQuery<Params>>();

  const alreadyAuthenticated = sample({
    clock: sessionCheckStarted,
    source: $authenticationStatus,
    filter: (status) => status === AuthStatus.Authenticated,
  });

  const alreadyAnonymous = sample({
    clock: sessionCheckStarted,
    source: $authenticationStatus,
    filter: (status) => status === AuthStatus.Anonymous,
  });

  sample({
    clock: sessionCheckStarted,
    source: { status: $authenticationStatus, token: $token },
    filter: ({ status }) => status === AuthStatus.Initial,
    fn: ({ token }) => token,
    target: getSessionFx,
  });

  sample({
    clock: [alreadyAnonymous, getSessionFx.fail],
    source: { params: route.$params, query: route.$query },
    filter: route.$isOpened,
    target: sessionReceivedAnonymous,
  });

  if (otherwise) {
    sample({
      clock: sessionReceivedAnonymous,
      target: otherwise as Event<void>,
    });
  }

  return chainRoute({
    route,
    beforeOpen: sessionCheckStarted,
    openOn: [alreadyAuthenticated, getSessionFx.done],
    cancelOn: sessionReceivedAnonymous,
  });
}

export function chainAnonymous<Params extends RouteParams>(
  route: RouteInstance<Params>,
  { otherwise }: ChainParams<Params> = {}
): RouteInstance<Params> {
  const sessionCheckStarted = createEvent<RouteParamsAndQuery<Params>>();
  const sessionReceivedAuthenticated =
    createEvent<RouteParamsAndQuery<Params>>();

  const alreadyAuthenticated = sample({
    clock: sessionCheckStarted,
    source: $authenticationStatus,
    filter: (status) => status === AuthStatus.Authenticated,
  });

  const alreadyAnonymous = sample({
    clock: sessionCheckStarted,
    source: $authenticationStatus,
    filter: (status) => status === AuthStatus.Anonymous,
  });

  sample({
    clock: sessionCheckStarted,
    source: { status: $authenticationStatus, token: $token },
    filter: ({ status }) => status === AuthStatus.Initial,
    fn: ({ token }) => token,
    target: getSessionFx,
  });

  sample({
    clock: [alreadyAuthenticated, getSessionFx.done],
    source: { params: route.$params, query: route.$query },
    filter: route.$isOpened,
    target: sessionReceivedAuthenticated,
  });

  if (otherwise) {
    sample({
      clock: sessionReceivedAuthenticated,
      target: otherwise as Event<void>,
    });
  }

  return chainRoute({
    route,
    beforeOpen: sessionCheckStarted,
    openOn: [alreadyAnonymous, getSessionFx.fail],
    cancelOn: sessionReceivedAuthenticated,
  });
}

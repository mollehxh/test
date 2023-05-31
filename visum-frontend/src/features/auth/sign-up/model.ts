import { createEffect, createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';
import { $token, getSessionFx } from '~/entities/session/model';
import { createUser } from '~/shared/api/internal';
import { signUp } from '~/shared/api/shared-api';

export const usernameChanged = createEvent<string>();
export const emailChanged = createEvent<string>();
export const passwordChanged = createEvent<string>();
export const formSubmitted = createEvent();

const signUpFx = createEffect(createUser);

export const $username = createStore('');
export const $email = createStore('');
export const $password = createStore('');

export const $formPending = signUpFx.pending;

$username.on(usernameChanged, (_, username) => username);
$email.on(emailChanged, (_, email) => email);
$password.on(passwordChanged, (_, password) => password);

sample({
  clock: formSubmitted,
  source: { username: $username, email: $email, password: $password },
  filter: not($formPending),
  target: signUpFx,
});

sample({
  clock: signUpFx.doneData,
  target: $token,
});

sample({
  clock: signUpFx.done,
  source: $token,
  target: getSessionFx,
});

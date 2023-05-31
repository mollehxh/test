import { createEffect, createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';
import { $token, getSessionFx } from '~/entities/session/model';
import { loginUser } from '~/shared/api/internal';

export const emailChanged = createEvent<string>();
export const passwordChanged = createEvent<string>();
export const formSubmitted = createEvent();

const signInFx = createEffect(loginUser);

export const $email = createStore('');
export const $password = createStore('');

export const $formPending = signInFx.pending;

$email.on(emailChanged, (_, email) => email);
$password.on(passwordChanged, (_, password) => password);

sample({
  clock: formSubmitted,
  source: { email: $email, password: $password },
  filter: not($formPending),
  target: signInFx,
});

sample({
  clock: signInFx.doneData,
  target: $token,
});

sample({
  clock: signInFx.done,
  source: $token,
  target: getSessionFx,
});

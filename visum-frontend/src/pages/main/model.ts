import { createEvent, createStore, createEffect, sample } from 'effector';
import { debug } from 'patronum';
import { $session, chainAuthorized } from '~/entities/session/model';
import { createRoom, getAllRooms } from '~/shared/api/internal';

import { routes } from '~/shared/routing';

export const currentRoute = routes.main;
export const authorizedRoute = chainAuthorized(currentRoute, {
  otherwise: routes.signIn.open,
});

export const videoUrlChanged = createEvent<string>();
export const submitUrl = createEvent();

const getRoomsFx = createEffect(getAllRooms);

export const $videoUrl = createStore('');
export const $rooms = createStore<any[]>([]);

export const createRoomFx = createEffect(createRoom);

$videoUrl.on(videoUrlChanged, (_, url) => url);

$videoUrl.reset(createRoomFx.done);

sample({
  clock: currentRoute.opened,
  target: getRoomsFx,
});

sample({
  clock: getRoomsFx.doneData,
  target: $rooms,
});

sample({
  clock: submitUrl,
  source: { videoUrl: $videoUrl, session: $session },
  filter: ({ videoUrl }) => stringNotEmpty(videoUrl) && urlHasVideoId(videoUrl),
  fn: ({ videoUrl, session }) => ({
    video_url: extractVideoId(videoUrl),
    creator_id: session.userId,
  }),
  target: createRoomFx,
});

sample({
  clock: createRoomFx.doneData,
  fn: (data) => ({ roomId: String(data.room_id) }),
  target: routes.room.open,
});

function stringNotEmpty(string: string) {
  return Boolean(string.trim());
}

function urlHasVideoId(url: string) {
  return Boolean(extractVideoId(url));
}

function extractVideoId(url: string) {
  const regex =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|)([\w-]{11})(?:\S+)?$/;
  const match = url.match(regex);
  if (!match) return '';
  return match[1];
}

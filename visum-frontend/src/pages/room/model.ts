import axios from 'axios';
import { sample, createEffect, createEvent, createStore } from 'effector';
import { debug } from 'patronum';
import { $session, chainAuthorized } from '~/entities/session/model';
import {
  getAllRoomMessages,
  getUsersInRoom,
  getVideoUrlByRoomId,
} from '~/shared/api/internal';
import { createSocket } from '~/shared/lib/effector-socket.io';
import { createYouTubePlayer } from '~/shared/lib/effector-youtube-player';
import { routes } from '~/shared/routing';

export const currentRoute = routes.room;
export const authorizedRoute = chainAuthorized(currentRoute, {
  otherwise: routes.signIn.open,
});

const socket = createSocket('http://localhost:3000');
export const youtubePlayer = createYouTubePlayer();

const videoPlayed = socket.on<number>('playVideo');
const playVideoFx = socket.emit<number>('playVideo');
const videoStopped = socket.on<number>('pauseVideo');
const videoSeekedTo = socket.on<number>('seekVideo');
const seekToFx = socket.emit<number>('seekVideo');
const stopVideoFx = socket.emit<number>('pauseVideo');
const joinRoomFx = socket.emit<{ roomId: string; userId: string }>('joinRoom');
const leaveRoomFx = socket.emit<{ roomId: string; userId: string }>(
  'leaveRoom'
);

const getMessages = socket.emit('getChatMessages');
const messagesReceived = socket.on<any[]>('chatMessages');

const sendMessage = socket.emit<{
  roomId: string;
  userId: string;
  message: string;
}>('sendMessage');
const messageReceived = socket.on<string>('message');

export const $messages = createStore<any[]>([]);

export const playClicked = createEvent();
export const pauseClicked = createEvent();
export const timeChanged = createEvent<number>();

export const sendMessageClicked = createEvent();
export const $message = createStore('');
export const $roomMembers = createStore<any[]>([]);

export const getMembersFx = createEffect(getUsersInRoom);
const getRoomMessagesFx = createEffect(getAllRoomMessages);

export const messageChanged = createEvent<string>();

$message.on(messageChanged, (_, message) => message);
$messages.on(messageReceived, (messages, message) => [...messages, message]);
$messages.on(getRoomMessagesFx.doneData, (_, messages) => messages);

sample({
  clock: sendMessage.done,
  fn: () => '',
  target: $message,
});

sample({
  clock: sendMessageClicked,
  source: {
    params: currentRoute.$params,
    session: $session,
    message: $message,
  },
  fn: ({ params, session, message }) => ({
    roomId: params.roomId,
    userId: session.userId,
    message,
  }),
  target: sendMessage,
});

const getVideoUrlByRoomIdFx = createEffect(getVideoUrlByRoomId);

sample({
  clock: youtubePlayer.bindElement.done,
  source: routes.room.$params,
  fn: (params) => params.roomId,
  target: [getVideoUrlByRoomIdFx, getMembersFx, socket.connect],
});

sample({
  clock: youtubePlayer.loaded,
  target: youtubePlayer.getDuration,
});

sample({
  clock: currentRoute.opened,
  source: currentRoute.$params,
  fn: (params) => params.roomId,
  target: [getMembersFx, getRoomMessagesFx],
});

sample({
  clock: getMembersFx.doneData,
  target: $roomMembers,
});

sample({
  clock: socket.connect.done,
  source: { params: currentRoute.$params, session: $session },
  fn: ({ params, session }) => ({
    roomId: params.roomId,
    userId: session.userId,
  }),
  target: [joinRoomFx],
});
sample({
  clock: currentRoute.closed,
  source: { params: currentRoute.$params, session: $session },
  fn: ({ params, session }) => ({
    roomId: params.roomId,
    userId: session.userId,
  }),
  target: [leaveRoomFx],
});

sample({
  clock: socket.connect.done,
  fn: () => {},
  target: getMessages,
});

sample({
  clock: routes.room.closed,
  target: socket.disconnect,
});

sample({
  clock: getVideoUrlByRoomIdFx.doneData,
  target: youtubePlayer.loadVideoById,
});

sample({
  clock: youtubePlayer.loadVideoById.done,
  target: youtubePlayer.stopVideo,
});

// Play
sample({
  clock: playClicked,
  source: youtubePlayer.$time,
  target: playVideoFx,
});

sample({
  clock: videoPlayed,
  target: [youtubePlayer.seekTo, youtubePlayer.playVideo],
});

// Pause
sample({
  clock: pauseClicked,
  source: youtubePlayer.$time,
  target: stopVideoFx,
});

sample({
  clock: videoStopped,
  target: [youtubePlayer.seekTo, youtubePlayer.stopVideo],
});

// Seek

sample({
  clock: timeChanged,
  target: seekToFx,
});

sample({
  clock: videoSeekedTo,
  target: [youtubePlayer.seekTo],
});

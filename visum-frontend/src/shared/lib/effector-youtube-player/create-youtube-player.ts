import {
  attach,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';
import { YouTubePlayer } from 'youtube-player/dist/types';
import createYoutubePlayer from 'youtube-player';
import { debug } from 'patronum';

export const createYouTubePlayer = () => {
  const $videoPlayer = createStore<YouTubePlayer | null>(null);
  const $duration = createStore(0);
  const $time = createStore(0);
  const $volume = createStore(50);

  const timeChanged = createEvent<number>();
  const volumeChanged = createEvent<number>();

  $time.on(timeChanged, (_, time) => time);
  $volume.on(volumeChanged, (_, volume) => volume);

  const $status = createStore<'initial' | 'played' | 'paused'>('initial');

  const bindElementFx = createEffect((element: HTMLElement) => {
    return createYoutubePlayer(element, {
      playerVars: { autoplay: 0, controls: 0 },
    });
  });

  $videoPlayer.on(bindElementFx.doneData, (_, player) => player);

  const stopped = createEvent<number>();
  const played = createEvent<number>();
  const seeked = createEvent<number>();
  const loaded = createEvent();

  $status.on(played, () => 'played');
  $status.on(stopped, () => 'paused');

  $videoPlayer.watch(async (player) => {
    if (!player) return;

    player.on('stateChange', async (event) => {
      const currentTime = await player.getCurrentTime();

      const dur = await player.getDuration();
      if (dur !== 0) {
        loaded();
      }

      if (event.data === 2) return stopped(currentTime);
      if (event.data === 1) return played(currentTime);
    });
  });

  const loadVideoByIdFx = attach({
    source: $videoPlayer,
    effect: (videoPlayer, videoId: string) => {
      if (!videoPlayer) throw new Error('Video player is not initialized');

      videoPlayer.loadVideoById(videoId);
    },
  });
  const volumeSetFx = attach({
    source: $videoPlayer,
    effect: (videoPlayer, value: number) => {
      if (!videoPlayer) throw new Error('Video player is not initialized');

      videoPlayer.setVolume(value);
    },
  });

  const getDurationFx = attach({
    source: $videoPlayer,
    effect: async (videoPlayer) => {
      if (!videoPlayer) throw new Error('Video player is not initialized');

      const duration = await videoPlayer.getDuration();

      return duration;
    },
  });
  const getCurrentTimeFx = attach({
    source: $videoPlayer,
    effect: async (videoPlayer) => {
      if (!videoPlayer) throw new Error('Video player is not initialized');

      const duration = await videoPlayer.getCurrentTime();

      return duration;
    },
  });

  const playVideoFx = attach({
    source: $videoPlayer,
    effect: (videoPlayer) => {
      if (!videoPlayer) throw new Error('Video player is not initialized');

      videoPlayer.playVideo();
    },
  });

  const stopVideoFx = attach({
    source: $videoPlayer,
    effect: (videoPlayer) => {
      if (!videoPlayer) throw new Error('Video player is not initialized');

      videoPlayer.pauseVideo();
    },
  });

  const seekToFx = attach({
    source: $videoPlayer,
    effect: (videoPlayer, seconds: number) => {
      if (!videoPlayer) throw new Error('Video player is not initialized');

      videoPlayer.seekTo(seconds, true);
    },
  });

  sample({
    clock: volumeChanged,
    target: volumeSetFx,
  });

  sample({
    clock: loaded,
    target: getDurationFx,
  });

  sample({
    clock: getDurationFx.doneData,
    target: $duration,
  });

  return {
    bindElement: bindElementFx,
    loadVideoById: loadVideoByIdFx,
    playVideo: playVideoFx,
    stopVideo: stopVideoFx,
    seekTo: seekToFx,
    getDuration: getDurationFx,
    $time,
    $duration,
    loaded,
    played,
    stopped,
    seeked,
    timeChanged,
    $status,
    $volume,
    volumeChanged,
    getCurrentTimeFx,
  };
};

export type YouTubePlayerModel = ReturnType<typeof createYouTubePlayer>;

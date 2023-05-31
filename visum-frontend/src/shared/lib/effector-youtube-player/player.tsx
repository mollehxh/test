import { Button, Card, Slider, Tooltip } from 'antd';
import { YouTubePlayerModel } from './create-youtube-player';
import { useEffect, useRef, useState } from 'react';
import { useBindPlayer } from './use-bind-player';
import createYoutubePlayer from 'youtube-player';

import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  SoundOutlined,
  ExpandOutlined,
} from '@ant-design/icons';
import { useOnClickOutside } from 'usehooks-ts';
import { createEvent, createStore } from 'effector';
import { useUnit } from 'effector-react';

type PlayerProps = {
  model: YouTubePlayerModel;
  onPlay: () => void;
  onPause: () => void;
  onTimeChanged: () => void;
};

export const Player = (props: PlayerProps) => {
  const { model, onPlay, onPause, onTimeChanged } = props;

  const playerRef = useRef<any>(null);

  useBindPlayer({
    ref: playerRef,
    model,
  });

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (!playerRef.current) return;
      const currentTime = await model.getCurrentTimeFx();

      model.timeChanged(currentTime);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        <div
          ref={playerRef}
          style={{
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        ></div>
        <Controls
          onPlay={() => {
            onPlay();
            model.playVideo();
          }}
          onPause={() => {
            onPause();
            model.stopVideo();
          }}
          duration={model.$duration}
          time={model.$time}
          seekTo={model.seekTo}
          volume={model.$volume}
          volumeChanged={model.volumeChanged}
          onTimeChanged={onTimeChanged}
        />
      </div>
    </>
  );
};

export const Controls = ({
  onPlay,
  onPause,
  duration: $duration,
  time: $time,
  seekTo,
  volume: $volume,
  volumeChanged,
  onTimeChanged,
}: any) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const duration = useUnit<number>($duration);
  const time = useUnit<number>($time);
  const volume = useUnit<number>($volume);

  const volumeRef = useRef(null);

  useOnClickOutside(volumeRef, () => {
    setIsVolumeVisible(!isVolumeVisible);
  });

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) return onPause();
    onPlay();
  };

  const handleSliderChange = (value: any) => {
    // Handle slider change functionality
    onTimeChanged(value);
    seekTo(value);
  };

  const handleVolumeIconClick = (event: any) => {
    event.stopPropagation();
    setIsVolumeVisible(!isVolumeVisible);
  };

  return (
    <Card
      className="controoool"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        opacity: isHovered ? 1 : 0.7,
        transition: '.2s',
        position: 'absolute',
        bottom: '0',
        zIndex: 1000000,
        width: '100%',
        borderRadius: 0,
      }}
      bodyStyle={{ padding: '4px', display: 'flex', gap: 8 }}
    >
      <Button onClick={handlePlayPause} shape="circle">
        {isPlaying ? (
          <PauseCircleOutlined rev={undefined} />
        ) : (
          <PlayCircleOutlined rev={undefined} />
        )}
      </Button>

      <div
        style={{
          position: 'relative',
        }}
      >
        <Button shape="circle" onClick={handleVolumeIconClick}>
          <SoundOutlined rev={undefined} />
        </Button>
        {isVolumeVisible && (
          <Card
            ref={volumeRef}
            style={{
              position: 'absolute',
              zIndex: 10000,
              top: '-325%',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
            bodyStyle={{
              padding: '5px 0px',
            }}
          >
            <Slider
              onChange={(value) => {
                volumeChanged(value);
              }}
              max={100}
              vertical
              value={volume}
              style={{
                height: '75px',
              }}
            />
          </Card>
        )}
      </div>

      <Slider
        onChange={handleSliderChange}
        style={{ width: '100%' }}
        max={duration}
        value={time}
      />
    </Card>
  );
};

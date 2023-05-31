import { RefObject, useEffect } from 'react';
import { YouTubePlayerModel } from './create-youtube-player';

interface Config {
  ref: RefObject<any>;
  model: YouTubePlayerModel;
}

export const useBindPlayer = ({ ref, model }: Config) => {
  useEffect(() => {
    if (!ref.current) return;
    model.bindElement(ref.current);
  }, []);
};

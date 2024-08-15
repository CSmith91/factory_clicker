import React, { useEffect, useRef } from 'react';
import noise from './Audio/cannot.wav'

const AudioPlayer = ({ play }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (play && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  }, [play]);

  return (
    <audio ref={audioRef} src={noise} />
  );
};

export default AudioPlayer;
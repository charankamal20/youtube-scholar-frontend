import { useEffect, useRef } from "react";

const AlarmComponent = ({ playAlarm }: any) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (playAlarm && audioRef.current !== null) {
      audioRef.current.play();
    }
  }, [playAlarm]);

  return (
    <audio ref={audioRef} src="/path-to-your-alarm-sound.mp3" preload="auto" />
  );
};

export default AlarmComponent;

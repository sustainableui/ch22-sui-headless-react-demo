import * as React from 'react';
import { useState } from 'react';
import { Button, Typography } from '@mui/material';
import s from './low-carbon-video.module.css';

// Audio instead of video
function LowCarbonVideo({ id, audioSrc }) {
  const [audioMode, setAudioMode] = useState(true);

  function disableAudioMode() {
    setAudioMode(false);
  }

  return (
    <div className={s.container}>
      {audioMode ? (
        <audio controls className={s.audio}>
          <track default kind="captions" />
          <source src={audioSrc} type="audio/mpeg" />
          Your browser does not support the audio tag.
        </audio>
      ) : (
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${id}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
      {audioMode ? (
        <>
          <Button variant="outlined" color="warning" className={s.button} onClick={disableAudioMode}>
            Enable video
          </Button>
          <Typography variant="caption" className={s.caption}>
            Increases carbon emissions
          </Typography>
        </>
      ) : null}
    </div>
  );
}

export default LowCarbonVideo;

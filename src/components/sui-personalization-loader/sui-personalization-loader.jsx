import { useEffect } from 'react';

function SuiPersonalizationLoader({ timeoutLimit, onPersonalizationCancel, onTimeoutExpired }) {
  function handleClick(event) {
    event.preventDefault();
    onPersonalizationCancel();
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      onTimeoutExpired();
    }, timeoutLimit);
    return () => clearTimeout(timer);
  }, [onTimeoutExpired, timeoutLimit]);

  return (
    <div>
      <p>Determining the best display mode for a given grid carbon intensity..</p>
      <button onClick={handleClick}>Skip personalization</button>
    </div>
  );
}

export default SuiPersonalizationLoader;

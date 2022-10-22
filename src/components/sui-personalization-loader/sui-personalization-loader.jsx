function SuiPersonalizationLoader({ timeoutLimit, onPersonalizationCancel, onTimerExpired }) {
  // TODO: setTimeout

  function handleClick(event) {
    event.preventDefault();
    onPersonalizationCancel();
  }

  return (
    <div>
      <p>Personalizing experience..</p>
      <button onClick={handleClick}>Cancel waiting</button>
    </div>
  );
}

export default SuiPersonalizationLoader;

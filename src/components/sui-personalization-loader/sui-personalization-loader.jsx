import { useSuiContext } from '../../base/context/sui';

function SuiPersonalizationLoader() {
  const {
    handlers: { onPersonalizationCancel },
  } = useSuiContext();

  function handleClick(event) {
    event.preventDefault();
    onPersonalizationCancel();
  }

  return (
    <div>
      <p>Determining the best display mode for a given grid carbon intensity..</p>
      <p>This requires location data of your device, skipping if unable to get them</p>
      <button onClick={handleClick}>Skip personalization</button>
    </div>
  );
}

export default SuiPersonalizationLoader;

import { useEffect } from 'react';

function useGridCarbonIntensity(options, handlers) {
  const { localizationTimeout } = options;
  const { onLocalizationStart, onLocalizationSuccess, onLocalizationFailure } = handlers;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        onLocalizationStart();

        const gridCarbonIntensityResponse = await fetch(
          `/api/grid-carbon-intensity?lat=${coords.latitude}&lon=${coords.longitude}`,
        );

        if (gridCarbonIntensityResponse.ok) {
          const data = await gridCarbonIntensityResponse.json();
          onLocalizationSuccess(data);
        } else {
          onLocalizationFailure(gridCarbonIntensityResponse.statusText);
        }
      },
      error => {
        onLocalizationFailure(error.message);
      },
      { timeout: localizationTimeout },
    );
  }, [localizationTimeout, onLocalizationStart, onLocalizationSuccess, onLocalizationFailure]);
}

export default useGridCarbonIntensity;

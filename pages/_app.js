import { useCallback, useEffect, useState } from 'react';
import SUILoader from '../src/components/SUILoader';
import '../styles/globals.css';

const SUIConfig = {
  personalizationTimeoutLimit: 8000,
  gracefulDegradation: {
    button: {
      low: 1,
      moderate: 2,
      high: 3,
    },
  },
};

// TODO: use ts
const SUIVariants = {
  low: 'low',
  moderate: 'moderate',
  high: 'high',
};

// TODO: use redux
// TODO: use context
function useSUI() {
  const [greenModeVariant, setGreenModeVariant] = useState(null);

  const determineUIVariant = useCallback(function (gridIntensity) {
    console.log(gridIntensity);
    setGreenModeVariant(SUIVariants.moderate);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const gridIntensityResponse = await fetch(`/api/grid-intensity?lat=${coords.latitude}&lon=${coords.longitude}`);
      const gridIntensity = await gridIntensityResponse.json();
      determineUIVariant(gridIntensity.value);
    });
  }, [determineUIVariant]);

  return {
    greenModeVariant,
    isLoading: !greenModeVariant,
    onPersonalizationCancel: () => setGreenModeVariant(SUIVariants.moderate),
  };
}

function MyApp({ Component, pageProps }) {
  const { uiVariant, isLoading, onPersonalizationCancel } = useSUI();

  if (isLoading)
    return (
      <SUILoader
        timeoutLimit={SUIConfig.personalizationTimeoutLimit}
        onPersonalizationCancel={onPersonalizationCancel}
        onTimerExpired={onPersonalizationCancel}
      />
    );

  return <Component uiProvider={uiVariant} {...pageProps} />;
}

export default MyApp;

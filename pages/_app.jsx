import { useEffect, useReducer } from 'react';
import { SUIContext } from '../src/base/context/sui';
import SUIPersonalizationLoader from '../src/components/sui-personalization-loader';
import SUISwitch from '../src/components/sui-switch';
import '../styles/globals.css';

const SUIConfig = {
  personalizationTimeoutLimit: 8000,
  userInput: true,
  gracefulDegradationTheme: {
    button: {
      low: 1,
      moderate: 2,
      high: 3,
    },
  },
};

const SUIDisplayModes = {
  Low: 'low-display-mode',
  Moderate: 'moderate-display-mode',
  High: 'high-display-mode',
};

const SUIInitialState = {
  displayMode: null,
};

const ActionTypes = {
  SelectDisplayMode: 'select-display-mode',
  DetermineDisplayModeFromGridCarbonIntensity: 'determine-display-mode-from-grid-carbon-intensity',
};

function selectDisplayMode(state, newDisplayMode) {
  return { ...state, displayMode: newDisplayMode };
}

// TODO: implement missing logic
// eslint-disable-next-line no-unused-vars
function determineDisplayModeFromGridCarbonIntensity(state, gridCarbonIntensity) {
  return { ...state, displayMode: SUIDisplayModes.Moderate };
}

function SUIReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SelectDisplayMode:
      return selectDisplayMode(state, action.payload);
    case ActionTypes.DetermineDisplayModeFromGridCarbonIntensity:
      return determineDisplayModeFromGridCarbonIntensity(state, action.payload);
    default:
      throw new Error('Invalid action type');
  }
}

function useSUI() {
  const [state, dispatch] = useReducer(SUIReducer, SUIInitialState);

  function selectModerateDisplayMode() {
    dispatch({ type: ActionTypes.SelectDisplayMode, payload: SUIDisplayModes.Moderate });
  }

  function determineDisplayModeFromGridCarbonIntensity(gridCarbonIntensity) {
    dispatch({ type: ActionTypes.DetermineDisplayModeFromGridCarbonIntensity, payload: gridCarbonIntensity });
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const gridCarbonIntensityResponse = await fetch(
        `/api/grid-intensity?lat=${coords.latitude}&lon=${coords.longitude}`,
      );
      const gridCarbonIntensity = await gridCarbonIntensityResponse.json();
      determineDisplayModeFromGridCarbonIntensity(gridCarbonIntensity.value);
    });
  }, []);

  return {
    displayMode: state.displayMode,
    isLoading: !state.displayMode,
    onPersonalizationCancel: selectModerateDisplayMode,
    config: SUIConfig,
  };
}

function MyApp({ Component, pageProps }) {
  const SUI = useSUI();
  const { isLoading, onPersonalizationCancel, config } = SUI;

  if (isLoading)
    return (
      <SUIPersonalizationLoader
        timeoutLimit={config.personalizationTimeoutLimit}
        onPersonalizationCancel={onPersonalizationCancel}
        onTimerExpired={onPersonalizationCancel}
      />
    );

  return (
    <SUIContext.Provider value={SUI}>
      <SUISwitch />
      <Component {...pageProps} />
    </SUIContext.Provider>
  );
}

export default MyApp;

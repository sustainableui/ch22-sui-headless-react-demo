import { useCallback, useEffect, useReducer } from 'react';
import { SuiContext } from '../src/base/context/sui';
import SuiPersonalizationLoader from '../src/components/sui-personalization-loader';
import SuiSwitch from '../src/components/sui-switch';
import '../styles/globals.css';

const SuiDisplayModes = {
  Low: 'low',
  Moderate: 'moderate',
  High: 'high',
};

const SuiConfig = {
  thresholds: {
    [SuiDisplayModes.Low]: 350,
    [SuiDisplayModes.Moderate]: 150,
    [SuiDisplayModes.High]: 0,
  },
  displayModes: SuiDisplayModes,
  locationTimeout: 8000,
  userControl: true,
  gracefulDegradationTheme: {
    image: {
      [SuiDisplayModes.Low]: 1,
      [SuiDisplayModes.Moderate]: 2,
      [SuiDisplayModes.High]: 3,
    },
    video: {
      [SuiDisplayModes.Low]: 1,
      [SuiDisplayModes.Moderate]: 1,
      [SuiDisplayModes.High]: 2,
    },
    carousel: {
      [SuiDisplayModes.Low]: 1,
      [SuiDisplayModes.Moderate]: 2,
      [SuiDisplayModes.High]: 3,
    },
  },
};

const SuiReducerInitialState = {
  displayMode: null,
  gridCarbonIntensityData: {
    value: null,
    measurementRegion: null,
  },
};

const SuiReducerActionTypes = {
  SelectDisplayMode: 'select-display-mode',
  DetermineDisplayMode: 'determine-display-mode',
};

function selectDisplayMode(state, newDisplayMode) {
  return { ...state, displayMode: newDisplayMode };
}

function determineDisplayMode(state, gridCarbonIntensityData) {
  if (gridCarbonIntensityData.value > SuiConfig.thresholds[SuiDisplayModes.Low])
    return {
      ...state,
      displayMode: SuiDisplayModes.Low,
      gridCarbonIntensityData,
    };

  if (gridCarbonIntensityData.value > SuiConfig.thresholds[SuiDisplayModes.Moderate])
    return {
      ...state,
      displayMode: SuiDisplayModes.Moderate,
      gridCarbonIntensityData,
    };

  return { ...state, displayMode: SuiDisplayModes.High, gridCarbonIntensityData };
}

function SuiReducer(state, action) {
  switch (action.type) {
    case SuiReducerActionTypes.SelectDisplayMode:
      return selectDisplayMode(state, action.payload);
    case SuiReducerActionTypes.DetermineDisplayMode:
      return determineDisplayMode(state, action.payload);
    default:
      throw new Error('Invalid action type');
  }
}

function useGridCarbonIntensityData(determineDisplayMode) {
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const gridCarbonIntensityResponse = await fetch(
        `/api/grid-carbon-intensity?lat=${coords.latitude}&lon=${coords.longitude}`,
      );
      const data = await gridCarbonIntensityResponse.json();
      determineDisplayMode(data);
    });
  }, [determineDisplayMode]);
}

function useSui(config) {
  const [state, dispatch] = useReducer(SuiReducer, SuiReducerInitialState);

  const selectDisplayMode = useCallback(function (displayMode) {
    dispatch({ type: SuiReducerActionTypes.SelectDisplayMode, payload: displayMode });
  }, []);

  const determineDisplayMode = useCallback(function (gridCarbonIntensityData) {
    dispatch({
      type: SuiReducerActionTypes.DetermineDisplayMode,
      payload: gridCarbonIntensityData,
    });
  }, []);

  useGridCarbonIntensityData(determineDisplayMode);

  return {
    state: {
      ...state,
      isPersonalizationInProgress: !state.displayMode,
    },
    handlers: {
      onPersonalizationCancel: () => selectDisplayMode(config.displayModes.Moderate),
      onDisplayModeSelect: selectDisplayMode,
    },
    config,
  };
}

function MyApp({ Component, pageProps }) {
  const sui = useSui(SuiConfig);
  const {
    state: { isPersonalizationInProgress },
    handlers: { onPersonalizationCancel },
    config,
  } = sui;

  if (isPersonalizationInProgress)
    return (
      <SuiPersonalizationLoader
        timeoutLimit={config.locationTimeout}
        onPersonalizationCancel={onPersonalizationCancel}
        onTimeoutExpired={onPersonalizationCancel}
      />
    );

  return (
    <SuiContext.Provider value={sui}>
      <SuiSwitch />
      <Component {...pageProps} />
    </SuiContext.Provider>
  );
}

export default MyApp;

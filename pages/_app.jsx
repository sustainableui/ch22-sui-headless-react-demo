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

const SuiPersonalizationStatus = {
  InProgress: 'in-progress',
  Success: 'success',
  Failure: 'failure',
  Cancelled: 'cancelled',
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
  personalizationStatus: null,
  personalizationError: null,
  config: SuiConfig,
};

const SuiReducerActionTypes = {
  SelectDisplayMode: 'select-display-mode',
  StartPersonalization: 'start-personalization',
  CancelPersonalization: 'cancel-personalization',
  DetermineDisplayMode: 'determine-display-mode',
};

function selectDisplayMode(state, newDisplayMode) {
  return {
    ...state,
    displayMode: newDisplayMode,
    personalizationStatus: SuiPersonalizationStatus.Success,
    personalizationError: null,
  };
}

function startPersonalization(state) {
  return { ...state, personalizationStatus: SuiPersonalizationStatus.InProgress, personalizationError: null };
}

function cancelPersonalization(state, reason) {
  return {
    ...state,
    displayMode: SuiDisplayModes.Moderate,
    personalizationStatus: reason ? SuiPersonalizationStatus.Failure : SuiPersonalizationStatus.Cancelled,
    personalizationError: reason || null,
  };
}

function determineDisplayMode(state, gridCarbonIntensityData) {
  if (gridCarbonIntensityData.value > SuiConfig.thresholds[SuiDisplayModes.Low])
    return {
      ...state,
      displayMode: SuiDisplayModes.Low,
      gridCarbonIntensityData,
      personalizationStatus: SuiPersonalizationStatus.Success,
      personalizationError: null,
    };

  if (gridCarbonIntensityData.value > SuiConfig.thresholds[SuiDisplayModes.Moderate])
    return {
      ...state,
      displayMode: SuiDisplayModes.Moderate,
      gridCarbonIntensityData,
      personalizationStatus: SuiPersonalizationStatus.Success,
      personalizationError: null,
    };

  return {
    ...state,
    displayMode: SuiDisplayModes.High,
    gridCarbonIntensityData,
    personalizationStatus: SuiPersonalizationStatus.Success,
    personalizationError: null,
  };
}

function SuiReducer(state, action) {
  switch (action.type) {
    case SuiReducerActionTypes.SelectDisplayMode:
      return selectDisplayMode(state, action.payload);
    case SuiReducerActionTypes.StartPersonalization:
      return startPersonalization(state);
    case SuiReducerActionTypes.CancelPersonalization:
      return cancelPersonalization(state, action.payload);
    case SuiReducerActionTypes.DetermineDisplayMode:
      return determineDisplayMode(state, action.payload);
    default:
      throw new Error('Invalid action type');
  }
}

function useGridCarbonIntensityData(
  startPersonalization,
  cancelPersonalization,
  determineDisplayMode,
  locationTimeout,
) {
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        startPersonalization();

        const gridCarbonIntensityResponse = await fetch(
          `/api/grid-carbon-intensity?lat=${coords.latitude}&lon=${coords.longitude}`,
        );

        if (gridCarbonIntensityResponse.ok) {
          const data = await gridCarbonIntensityResponse.json();
          determineDisplayMode(data);
        } else {
          cancelPersonalization(gridCarbonIntensityResponse.statusText);
        }
      },
      error => {
        cancelPersonalization(error.code);
      },
      { timeout: locationTimeout },
    );
  }, [startPersonalization, cancelPersonalization, determineDisplayMode, locationTimeout]);
}

function useSui() {
  const [state, dispatch] = useReducer(SuiReducer, SuiReducerInitialState, null);

  const selectDisplayMode = useCallback(function (displayMode) {
    dispatch({ type: SuiReducerActionTypes.SelectDisplayMode, payload: displayMode });
  }, []);

  const startPersonalization = useCallback(function () {
    dispatch({
      type: SuiReducerActionTypes.StartPersonalization,
    });
  }, []);

  const cancelPersonalization = useCallback(function (reason = null) {
    dispatch({
      type: SuiReducerActionTypes.CancelPersonalization,
      payload: reason,
    });
  }, []);

  const determineDisplayMode = useCallback(function (gridCarbonIntensityData) {
    dispatch({
      type: SuiReducerActionTypes.DetermineDisplayMode,
      payload: gridCarbonIntensityData,
    });
  }, []);

  useGridCarbonIntensityData(
    startPersonalization,
    cancelPersonalization,
    determineDisplayMode,
    state.config.locationTimeout,
  );

  return {
    state: {
      ...state,
      isPersonalizationInProgress: state.personalizationStatus === SuiPersonalizationStatus.InProgress,
    },
    handlers: {
      onPersonalizationCancel: cancelPersonalization,
      onDisplayModeSelect: selectDisplayMode,
    },
    config: state.config,
  };
}

function MyApp({ Component, pageProps }) {
  const sui = useSui();
  const {
    state: { isPersonalizationInProgress },
  } = sui;

  if (isPersonalizationInProgress)
    return (
      <SuiContext.Provider value={sui}>
        <SuiPersonalizationLoader />
      </SuiContext.Provider>
    );

  return (
    <SuiContext.Provider value={sui}>
      <SuiSwitch />
      <Component {...pageProps} />
    </SuiContext.Provider>
  );
}

export default MyApp;

import React, { useContext } from 'react';
import { SuiDisplayModes } from '../../../pages/_app';

const SuiContext = React.createContext(undefined);
SuiContext.displayName = 'SuiContext';

function useSuiContext() {
  return useContext(SuiContext);
}

function withSui(components) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { displayMode } = useSuiContext();

  let Component;

  switch (displayMode) {
    case SuiDisplayModes.Low:
      Component = components[0];
      break;
    case SuiDisplayModes.Moderate:
      Component = components[1];
      break;
    case SuiDisplayModes.High:
      Component = components[2];
      break;
    default:
      Component = components[1];
      break;
  }

  return props => <Component {...props} />;
}

export { SuiContext, useSuiContext, withSui };

import React, { useContext } from 'react';

const SuiContext = React.createContext(undefined);
SuiContext.displayName = 'SuiContext';

function useSuiContext() {
  return useContext(SuiContext);
}

function withSui(components) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { displayMode, config } = useSuiContext();

  let Component;

  switch (displayMode) {
    case config.displayModes.Low:
      Component = components[0];
      break;
    case config.displayModes.Moderate:
      Component = components[1];
      break;
    case config.displayModes.High:
      Component = components[2];
      break;
    default:
      Component = components[1];
      break;
  }

  return props => <Component {...props} />;
}

export { SuiContext, useSuiContext, withSui };

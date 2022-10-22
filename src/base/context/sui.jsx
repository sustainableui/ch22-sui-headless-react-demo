import React, { useContext } from 'react';

const SUIContext = React.createContext(undefined);
SUIContext.displayName = 'SUI Context';

function useSUIContext() {
  return useContext(SUIContext);
}

export { SUIContext, useSUIContext };

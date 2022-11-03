import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { SuiProvider } from '@sustainableui/sui-headless-react';
import CarbonLoader from '../src/components/sui/carbon-loader';
import UiSwitch from '../src/components/sui/ui-switch';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function MyApp({ Component, pageProps }) {
  return (
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      <SuiProvider api={process.env.NEXT_PUBLIC_SUI_API} LoaderComponent={CarbonLoader} SwitchComponent={UiSwitch}>
        <Component {...pageProps} />
      </SuiProvider>
    </StyledEngineProvider>
  );
}

export default MyApp;

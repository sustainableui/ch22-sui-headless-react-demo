import { Alert, AppBar, Box, Button, ButtonGroup, Toolbar, Typography } from '@mui/material';
import { SuiDisplayModes, SuiGridCarbonIntensity } from '@sustainableui/sui-headless-react/src/base/types';
import s from './ui-switch.module.css';

function getColor(displayMode) {
  switch (displayMode) {
    case SuiDisplayModes.Low:
      return 'success';
    case SuiDisplayModes.Moderate:
      return 'warning';
    case SuiDisplayModes.High:
      return 'error';
    default:
      throw new Error('Unsupported display mode');
  }
}

interface UISwitchProps {
  displayMode: SuiDisplayModes;
  recommendedDisplayMode: SuiDisplayModes;
  gridCarbonIntensity: SuiGridCarbonIntensity;
  onDisplayModeSelect: (newDisplayMode: SuiDisplayModes) => void;
}

function UISwitch({ displayMode, recommendedDisplayMode, gridCarbonIntensity, onDisplayModeSelect }: UISwitchProps) {
  const gridCarbonIntensityDataExists = gridCarbonIntensity.value && gridCarbonIntensity.measurementRegion;

  function handleClick(newDisplayMode: SuiDisplayModes) {
    return event => {
      event.preventDefault();
      onDisplayModeSelect(newDisplayMode);
    };
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar color={getColor(displayMode)} position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SUI Headless for React
          </Typography>
          <ButtonGroup variant="contained" color="primary">
            <Button disabled={displayMode === SuiDisplayModes.Low} onClick={handleClick(SuiDisplayModes.Low)}>
              Low
            </Button>
            <Button disabled={displayMode === SuiDisplayModes.Moderate} onClick={handleClick(SuiDisplayModes.Moderate)}>
              Moderate
            </Button>
            <Button disabled={displayMode === SuiDisplayModes.High} onClick={handleClick(SuiDisplayModes.High)}>
              High
            </Button>
          </ButtonGroup>
        </Toolbar>
      </AppBar>
      <Alert className={s.alert} severity={recommendedDisplayMode === displayMode ? 'success' : 'warning'}>
        {gridCarbonIntensityDataExists && (
          <>
            {recommendedDisplayMode === displayMode ? (
              <Typography>
                Thanks for using recommended display mode ({Math.round(gridCarbonIntensity.value)} gCO2e/kWh in{' '}
                {gridCarbonIntensity.measurementRegion})
              </Typography>
            ) : (
              <Typography>
                Recommended display mode is <b>{recommendedDisplayMode}</b> ({Math.round(gridCarbonIntensity.value)}{' '}
                gCO2e/kWh in {gridCarbonIntensity.measurementRegion})
              </Typography>
            )}
          </>
        )}
        {!gridCarbonIntensityDataExists && (
          <Typography>
            We recommend providing location so that UI can be adjusted to actual grid carbon intensity situation.
          </Typography>
        )}
      </Alert>
    </Box>
  );
}

export default UISwitch;

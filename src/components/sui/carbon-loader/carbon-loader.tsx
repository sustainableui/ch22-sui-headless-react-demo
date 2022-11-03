import { Alert, Button, CircularProgress, Container } from '@mui/material';
import s from './carbon-loader.module.css';

interface CarbonLoaderProps {
  onLocalizationCancel: () => void;
}

function CarbonLoader({ onLocalizationCancel }: CarbonLoaderProps) {
  return (
    <Container className={s.container}>
      <CircularProgress className={s.circularProgress} color="success" size={100} />
      <Alert severity="warning" className={s.alert}>
        Location is required for Green Mode personalization
      </Alert>
      <Button variant="text" onClick={onLocalizationCancel} className={s.button} color="warning">
        Cancel
      </Button>
    </Container>
  );
}

export default CarbonLoader;

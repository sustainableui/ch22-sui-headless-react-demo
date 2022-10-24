import { useSuiContext } from '../../base/context/sui';
import s from './background-color.module.css';

function BackgroundColor() {
  const sui = useSuiContext();

  return <main className={s.container} />;
}

export default BackgroundColor;

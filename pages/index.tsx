import Head from 'next/head';
import { Container, Link, Typography } from '@mui/material';
import CarbonVideo from '../src/components/carbon-video';
import s from './index.module.css';

function CarbonComponentWrapper({ children }) {
  return (
    <section className={s.ccWrapper}>
      <p className={s.ccWrapperLabel}>Carbon Component</p>
      {children}
    </section>
  );
}

export default function IndexPage() {
  return (
    <>
      <Head>
        <title>Carbon Aware UI demo</title>
        <meta name="description" content="Sustainable UI in NextJS" />
      </Head>
      <Container component="main" className={s.container}>
        <Typography variant="h1" className={s.heading1}>
          Sustainable UI
        </Typography>
        <Typography variant="h2" className={s.heading2}>
          Carbon Aware UI demo
        </Typography>
        <CarbonComponentWrapper>
          <CarbonVideo id="2U3w5Blv0Lg" audioSrc="/2U3w5Blv0Lg.mp3" />
        </CarbonComponentWrapper>
      </Container>
      <footer className={s.footer}>
        <p>
          <Link target="_blank" href="https://github.com/sustainableui/ch22-sui-headless-next-react-demo">
            Demo GitHub repo
          </Link>
        </p>
        <p>
          <Link target="_blank" href="https://github.com/sustainableui/sui-headless-react">
            SUI Headless for React library repo
          </Link>
        </p>
        <p>
          <Link target="_blank" href="https://www.npmjs.com/package/@sustainableui/sui-headless-react">
            SUI Headless for React library on NPM
          </Link>
        </p>
      </footer>
    </>
  );
}

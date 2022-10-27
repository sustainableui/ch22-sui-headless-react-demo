import Head from 'next/head';
import BackgroundColor from '../src/components/background-color';
import calculateCarbonIntensity from '../src/base/services/calculate-carbon-intensity';

export default function IndexPage(props) {
  return (
    <>
      <Head>
        <title>Sustainable UI</title>
        <meta name="description" content="Sustainable UI in NextJS" />
      </Head>
      <pre style={{ color: 'black' }}>{JSON.stringify(props, null, 2)}</pre>
      <BackgroundColor />
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { country, latitude, longitude } = ctx.query;

  let gridCarbonIntensity = null;
  try {
    gridCarbonIntensity = await calculateCarbonIntensity({ lon: longitude, lat: latitude });
  } catch (err) {
    console.error(err);
  }

  return {
    props: {
      country,
      latitude,
      longitude,
      gridCarbonIntensity,
    },
  };
}

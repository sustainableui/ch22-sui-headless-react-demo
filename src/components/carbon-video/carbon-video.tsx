import { withSui } from '@sustainableui/sui-headless-react';
import dynamic from 'next/dynamic';

const LowCarbonVideo = dynamic(() => import('./sui/low/low-carbon-video'));

const ModerateCarbonVideo = dynamic(() => import('./sui/moderate/moderate-carbon-video'));

const HighCarbonVideo = dynamic(() => import('./sui/high/high-carbon-video'));

export default withSui([LowCarbonVideo, ModerateCarbonVideo, HighCarbonVideo]);

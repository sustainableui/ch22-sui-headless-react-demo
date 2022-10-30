import React from 'react';
import { SuiOptions } from '../../base/types';

type SuiProviderProps = SuiOptions & {
  children: React.ReactNode | React.ReactNode[];
};

export type { SuiProviderProps };

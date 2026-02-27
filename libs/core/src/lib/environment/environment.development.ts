import { Edition, EnvironmentConfig } from './environment';

export const environmentDev: EnvironmentConfig = {
  prod: false,
  edition: Edition.SINGLEPLAYER,
  version: '0.1.0-dev',
};

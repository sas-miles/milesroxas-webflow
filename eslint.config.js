import finsweetConfigs from '@finsweet/eslint-config';

// Create a custom rule override that will be applied last
const consoleOverride = {
  name: 'custom/disable-console-warnings',
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};

// Clone the configs and add our override
const config = [...finsweetConfigs, consoleOverride];

export default config;

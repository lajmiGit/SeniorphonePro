import { getStorybookUI } from '@storybook/react-native';
import './storybook.requires';

const StorybookUIRoot = getStorybookUI({
  enableWebpack: false,
  onDeviceUI: true,
  disableWebsockets: true,
  queryParams: {
    providerSwitcher: false,
  },
});

export default StorybookUIRoot;

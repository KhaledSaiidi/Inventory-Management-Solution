import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.universalmm.unistock-keeper',
  appName: 'unistock-keeper',
  webDir: 'www',
  plugins: {
    BarcodeScanner: {
      pluginRef: 'BarcodeScanner',
    }
  }
};

export default config;

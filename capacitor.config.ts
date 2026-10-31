import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quizflashcard.app',
  appName: 'QuizFlash',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;

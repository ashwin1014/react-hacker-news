import apikey from '../../config';

const firebaseConfig = {
  apiKey: apikey.API_KEY,
  authDomain: apikey.AUTH_DOMAIN,
  databaseURL: apikey.DATABASE_URL,
  projectId: apikey.PROJECT_ID,
  storageBucket: apikey.STORAGE_BUCKET,
  messagingSenderId: apikey.MESSAGING_SENDER_ID,
  appId: apikey.APP_ID,
  measurementId: apikey.MEASUREMENT_ID
};

export default firebaseConfig;

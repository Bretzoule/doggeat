import { initializeApp } from "firebase/app";
import fireconf from "./fireconf.json";

// Initialize Firebase
const firebaseConfig = {
  apiKey: fireconf.apiKey,
  authDomain: fireconf.authDomain,
  projectId: fireconf.projectId,
  storageBucket: fireconf.storageBucket,
  messagingSenderId: fireconf.messagingSenderId,
  appId: fireconf.appId,
};

export default firebaseApp = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

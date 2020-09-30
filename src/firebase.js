import firebase from 'firebase';

const firebaseConfig = {
    apiKey: 'AIzaSyAHU0hAO85EQJzOZtt5Z9jYAaNBglNXH_M',
    authDomain: 'instagram-clone-project-3316a.firebaseapp.com',
    databaseURL: 'https://instagram-clone-project-3316a.firebaseio.com',
    projectId: 'instagram-clone-project-3316a',
    storageBucket: 'instagram-clone-project-3316a.appspot.com',
    messagingSenderId: '1066093560072',
    appId: '1:1066093560072:web:e2da74864a20cdf1e3ecbd',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();

const auth = firebase.auth(); // this auth is going to allow us to do things like logging in, signing in and search etc
const storage = firebase.storage();

export { db, auth, storage };
// export default db;

// Firebase configuration
// IMPORTANT: Replace these values with your Firebase project credentials
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase (will be loaded from CDN in HTML)
let app, auth, db;

function initializeFirebase() {
    if (typeof firebase === 'undefined') {
        console.warn('Firebase not loaded yet');
        return false;
    }

    try {
        app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();

        console.log('Firebase initialized successfully');
        return true;
    } catch (error) {
        console.error('Firebase initialization error:', error);
        return false;
    }
}

// Export for use in other files
window.firebaseConfig = firebaseConfig;
window.initializeFirebase = initializeFirebase;

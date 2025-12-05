// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBOubehiabgyDBwknOCwFZHW6i38hFNNHo",
    authDomain: "quiz-uce.firebaseapp.com",
    projectId: "quiz-uce",
    storageBucket: "quiz-uce.firebasestorage.app",
    messagingSenderId: "416941136472",
    appId: "1:416941136472:web:4c666548ff39bf1e29c82d"
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

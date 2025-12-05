// Authentication management
let currentUser = null;

// Check if user is logged in
function checkAuthState() {
    if (!window.auth) {
        console.log('Auth not initialized, running in guest mode');
        // Still show the login button even if auth isn't initialized
        updateUIForUser(null);
        return null;
    }

    return new Promise((resolve) => {
        window.auth.onAuthStateChanged((user) => {
            currentUser = user;
            updateUIForUser(user);
            resolve(user);
        });
    });
}

// Google Sign In
async function signInWithGoogle() {
    if (!window.auth) {
        alert('Autenticación no disponible. Continuando como invitado.');
        return null;
    }

    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await window.auth.signInWithPopup(provider);
        currentUser = result.user;

        console.log('Signed in as:', currentUser.displayName);
        return currentUser;
    } catch (error) {
        console.error('Sign in error:', error);
        alert('Error al iniciar sesión: ' + error.message);
        return null;
    }
}

// Sign Out
async function signOut() {
    if (!window.auth) return;

    try {
        await window.auth.signOut();
        currentUser = null;
        console.log('Signed out successfully');
    } catch (error) {
        console.error('Sign out error:', error);
    }
}

// Update UI based on user state
function updateUIForUser(user) {
    const userWidget = document.getElementById('userWidget');
    if (!userWidget) return;

    if (user) {
        userWidget.innerHTML = `
      <div class="user-profile">
        <img src="${user.photoURL || '/icon-192.png'}" alt="${user.displayName}" class="user-avatar">
        <div class="user-info">
          <span class="user-name">${user.displayName}</span>
          <button onclick="signOut()" class="btn-logout">Cerrar sesión</button>
        </div>
      </div>
    `;
    } else {
        userWidget.innerHTML = `
      <button onclick="signInWithGoogle()" class="btn-login">
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
          <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
          <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"/>
          <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
        </svg>
        Iniciar con Google
      </button>
    `;
    }
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Check if user is authenticated
function isAuthenticated() {
    return currentUser !== null;
}

// Export functions
window.checkAuthState = checkAuthState;
window.signInWithGoogle = signInWithGoogle;
window.signOut = signOut;
window.getCurrentUser = getCurrentUser;
window.isAuthenticated = isAuthenticated;

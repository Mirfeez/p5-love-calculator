// Firebase initialization (compat mode)
// IMPORTANT: Replace the placeholder values below with your Firebase project config
// Get your config from the Firebase Console: Project Settings -> Your apps -> Firebase SDK snippet

// Include this file after the compat SDK scripts are added to the page.
// Example in HTML (index.html or admin/admin.html):
// <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js"></script>
// <script src="firebase-init.js"></script>

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

if (typeof firebase !== 'undefined') {
  try {
    firebase.initializeApp(firebaseConfig);
    // expose database globally for the app scripts
    window.database = firebase.database();
  } catch (e) {
    console.warn('Firebase init error (maybe already initialized):', e);
  }
} else {
  console.warn('Firebase SDK not loaded. Please include compat SDK scripts before firebase-init.js');
}

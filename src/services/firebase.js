import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyADO25PcwhiWj3AhaYsVmGqxJUNGaOvWI4",
    authDomain: "vitrines-6455a.firebaseapp.com",
    projectId: "vitrines-6455a",
    storageBucket: "vitrines-6455a.firebasestorage.app",
    messagingSenderId: "633019687239",
    appId: "1:633019687239:web:60860bf7b1742e55476c62",
    measurementId: "G-TEYP17LWX3"
}

// inicializa
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

export {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
}

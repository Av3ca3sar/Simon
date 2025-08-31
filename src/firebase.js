import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// ATENCIÓN: Reemplaza todo el contenido de este objeto 'firebaseConfig'
// con el que copiaste de la web de Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyD68eI73Cnb52i9XpuEL4AvDDc82o5GXjE",
  authDomain: "juego-simon-puntuaciones.firebaseapp.com",
  projectId: "juego-simon-puntuaciones",
  storageBucket: "juego-simon-puntuaciones.firebasestorage.app",
  messagingSenderId: "624202084434",
  appId: "1:624202084434:web:241a6aa9d17328cf272f8b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export firestore database
// para que la podamos usar en otros sitios de la app
export const db = getFirestore(app);

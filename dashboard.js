import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAtaFjcCuiMOrQatVICzaAX2KDKNNeKXOQ",
  authDomain: "test123-e451a.firebaseapp.com",
  projectId: "test123-e451a",
  storageBucket: "test123-e451a.appspot.com",
  messagingSenderId: "198813089460",
  appId: "1:198813089460:web:3ca72f2ccaf09e796fa1e1"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Verifica se o usuário está logado
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const ref = doc(db, "usuarios", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      document.getElementById("saudacao").textContent = "Bem-vindo, " + data.nome + "!";
      document.getElementById("nome").value = data.nome || "";
      document.getElementById("email").value = data.email || "";
    } else {
      alert("Dados não encontrados.");
    }
  } else {
    // Se não estiver logado, redireciona para login
    window.location.href = "index.html";
  }
});

// Logout
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};

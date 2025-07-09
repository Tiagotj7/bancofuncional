// Importa os módulos Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

// Alternar telas
window.alternarForm = function () {
  document.getElementById("cadastro").classList.toggle("hidden");
  document.getElementById("login").classList.toggle("hidden");
}

// Cadastro
window.cadastrar = async function () {
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("emailCadastro").value.trim();
  const senha = document.getElementById("senhaCadastro").value;

  if (!nome || !email || !senha) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // Salvar no Firestore
    await setDoc(doc(db, "usuarios", user.uid), {
      nome: nome,
      email: email
    });

    alert("Cadastro realizado com sucesso!");

    // Limpar campos
    document.getElementById("nome").value = '';
    document.getElementById("emailCadastro").value = '';
    document.getElementById("senhaCadastro").value = '';
    alternarForm();

  } catch (error) {
    alert("Erro ao cadastrar: " + error.message);
  }
}

// Login
window.logar = async function () {
  const email = document.getElementById("emailLogin").value.trim();
  const senha = document.getElementById("senhaLogin").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    alert("Login bem-sucedido: " + user.email);
    // Redirecione se quiser aqui (ex: window.location.href = "dashboard.html")

  } catch (error) {
    alert("Erro no login: " + error.message);
  }
}

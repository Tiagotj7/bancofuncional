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

  console.log("Tentando cadastrar:", { nome, email, senha: senha ? "***" : "vazio" });

  if (!nome || !email || !senha) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    console.log("Criando usuário no Firebase Auth...");
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    console.log("Usuário criado com UID:", user.uid);

    // Salvar no Firestore
    console.log("Salvando dados no Firestore...");
    const docRef = doc(db, "usuarios", user.uid);
    await setDoc(docRef, {
      nome: nome,
      email: email,
      criadoEm: new Date()
    });
    console.log("Dados salvos no Firestore com sucesso!");

    alert("Cadastro realizado com sucesso!");

    // Limpar campos
    document.getElementById("nome").value = '';
    document.getElementById("emailCadastro").value = '';
    document.getElementById("senhaCadastro").value = '';
    alternarForm();

  } catch (error) {
    console.error("Erro no cadastro:", error);
    alert("Erro ao cadastrar: " + error.message);
  }
}

// Login
window.logar = async function () {
  const email = document.getElementById("emailLogin").value.trim();
  const senha = document.getElementById("senhaLogin").value;

  console.log("Tentando fazer login:", { email, senha: senha ? "***" : "vazio" });

  if (!email || !senha) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    console.log("Fazendo login no Firebase Auth...");
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    console.log("Login realizado com sucesso para:", user.email);

    alert("Login bem-sucedido: " + user.email);
    window.location.href = "dashboard.html";

  } catch (error) {
    console.error("Erro no login:", error);
    alert("Erro no login: " + error.message);
  }
}
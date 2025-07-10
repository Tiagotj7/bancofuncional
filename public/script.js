// Importa os módulos Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

// Adiciona loading
function showLoading(button) {
  button.disabled = true;
  button.textContent = "Carregando...";
}

function hideLoading(button, text) {
  button.disabled = false;
  button.textContent = text;
}

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
  const button = document.querySelector('#cadastro button');

  console.log("Iniciando cadastro...");

  // Validação
  if (!nome || !email || !senha) {
    alert("Preencha todos os campos.");
    return;
  }

  if (senha.length < 6) {
    alert("A senha deve ter pelo menos 6 caracteres.");
    return;
  }

  showLoading(button);

  try {
    console.log("Criando usuário no Firebase Auth...");
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    console.log("Usuário criado com UID:", user.uid);

    // Salvar dados no Firestore
    console.log("Salvando dados no Firestore...");
    const userDocRef = doc(db, "usuarios", user.uid);
    
    await setDoc(userDocRef, {
      nome: nome,
      email: email,
      criadoEm: serverTimestamp()
    });

    console.log("Dados salvos no Firestore com sucesso!");
    
    // Limpar campos
    document.getElementById("nome").value = '';
    document.getElementById("emailCadastro").value = '';
    document.getElementById("senhaCadastro").value = '';
    
    alert("Cadastro realizado com sucesso!");
    alternarForm();

  } catch (error) {
    console.error("Erro no cadastro:", error);
    
    let errorMessage = "Erro ao cadastrar.";
    
    // Mensagens de erro mais amigáveis
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = "Este email já está em uso.";
    } else if (error.code === 'auth/weak-password') {
      errorMessage = "A senha é muito fraca.";
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "Email inválido.";
    }
    
    alert(errorMessage);
  } finally {
    hideLoading(button, "Cadastrar");
  }
}

// Login
window.logar = async function () {
  const email = document.getElementById("emailLogin").value.trim();
  const senha = document.getElementById("senhaLogin").value;
  const button = document.querySelector('#login button');

  console.log("Iniciando login...");

  // Validação
  if (!email || !senha) {
    alert("Preencha todos os campos.");
    return;
  }

  showLoading(button);

  try {
    console.log("Fazendo login no Firebase Auth...");
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    console.log("Login realizado com sucesso:", user.email);

    // Redirecionar para dashboard
    window.location.href = "dashboard.html";

  } catch (error) {
    console.error("Erro no login:", error);
    
    let errorMessage = "Erro ao fazer login.";
    
    // Mensagens de erro mais amigáveis
    if (error.code === 'auth/user-not-found') {
      errorMessage = "Usuário não encontrado.";
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = "Senha incorreta.";
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "Email inválido.";
    }
    
    alert(errorMessage);
  } finally {
    hideLoading(button, "Entrar");
  }
}
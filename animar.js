let usuarios = [];

function alternarForm() {
  document.getElementById("cadastro").classList.toggle("hidden");
  document.getElementById("login").classList.toggle("hidden");
}

function cadastrar() {
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("emailCadastro").value.trim();
  const senha = document.getElementById("senhaCadastro").value;

  if (!nome || !email || !senha) {
    alert("Preencha todos os campos.");
    return;
  }

  // Armazena no array (em memória)
  usuarios.push({ nome, email, senha });
  alert("Cadastro realizado com sucesso!");

  // Limpa campos
  document.getElementById("nome").value = '';
  document.getElementById("emailCadastro").value = '';
  document.getElementById("senhaCadastro").value = '';
  alternarForm();
}

function logar() {
  const email = document.getElementById("emailLogin").value.trim();
  const senha = document.getElementById("senhaLogin").value;

  const usuario = usuarios.find(user => user.email === email && user.senha === senha);

  if (usuario) {
    alert("Login bem-sucedido! Bem-vindo, " + usuario.nome);
  } else {
    alert("Email ou senha inválidos.");
  }

  // Limpa campos
  document.getElementById("emailLogin").value = '';
  document.getElementById("senhaLogin").value = '';
}

/*
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtaFjcCuiMOrQatVICzaAX2KDKNNeKXOQ",
  authDomain: "test123-e451a.firebaseapp.com",
  projectId: "test123-e451a",
  storageBucket: "test123-e451a.firebasestorage.app",
  messagingSenderId: "198813089460",
  appId: "1:198813089460:web:3ca72f2ccaf09e796fa1e1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firestore/9.23.0/firebase-firestore.js";

// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAtaFjcCuiMOrQatVICzaAX2KDKNNeKXOQ",
  authDomain: "test123-e1451a.firebaseapp.com",
  projectId: "test123-e1451a",
  storageBucket: "test123-e1451a.appspot.com",
  messagingSenderId: "198813089460",
  appId: "1:198813089460:web:3ca72f2ccaf09e796fa1e1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Função para formatar data
function formatarData(timestamp) {
  if (!timestamp) return "Não disponível";
  
  const data = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Função para formatar data e hora
function formatarDataHora(timestamp) {
  if (!timestamp) return "Não disponível";
  
  const data = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Verificar autenticação e carregar dados do usuário
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      // Buscar dados do usuário no Firestore
      const docRef = doc(db, "usuarios", user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const userData = docSnap.data();
        
        // Atualizar informações na tela com os dados do cadastro
        document.getElementById('userName').textContent = userData.nome || 'Usuário';
        document.getElementById('userName2').textContent = userData.nome || 'Não informado';
        document.getElementById('userEmail').textContent = userData.email || user.email;
        document.getElementById('memberSince').textContent = formatarData(userData.criadoEm);
        document.getElementById('lastAccess').textContent = formatarDataHora(userData.ultimoLogin);
        
        // Atualizar último acesso
        await updateDoc(docRef, {
          ultimoLogin: serverTimestamp()
        });
        
      } else {
        console.log("Documento do usuário não encontrado");
        // Fallback se não encontrar dados no Firestore
        document.getElementById('userName').textContent = 'Usuário';
        document.getElementById('userName2').textContent = 'Não informado';
        document.getElementById('userEmail').textContent = user.email;
        document.getElementById('memberSince').textContent = 'Não disponível';
        document.getElementById('lastAccess').textContent = 'Agora';
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      // Fallback em caso de erro
      document.getElementById('userName').textContent = 'Usuário';
      document.getElementById('userName2').textContent = 'Erro ao carregar';
      document.getElementById('userEmail').textContent = user.email;
      document.getElementById('memberSince').textContent = 'Não disponível';
      document.getElementById('lastAccess').textContent = 'Agora';
    }
  } else {
    // Usuário não está logado, redirecionar para login
    window.location.href = 'index.html';
  }
});

// Função de logout
window.logout = async function() {
  try {
    await signOut(auth);
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    alert('Erro ao fazer logout: ' + error.message);
  }
};
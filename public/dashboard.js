import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAtaFjcCuiMOrQatVICzaAX2KDKNNeKXOQ",
  authDomain: "test123-e451a.firebaseapp.com",
  projectId: "test123-e451a",
  storageBucket: "test123-e451a.appspot.com",
  messagingSenderId: "198813089460",
  appId: "1:198813089460:web:3ca72f2ccaf09e796fa1e1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const profileImage = document.getElementById("profileImage");
const uploadInput = document.getElementById("uploadInput");

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;

    try {
      const docRef = doc(db, "usuarios", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById("userName").textContent = data.nome || "Usuário";
        document.getElementById("userName2").textContent = data.nome || "Não informado";
        document.getElementById("userEmail").textContent = data.email || user.email;

        // Se tiver fotoURL, usa; senão, usa imagem padrão
        profileImage.src = data.fotoURL || "default-avatar.png";
      } else {
        // Documento não existe, criar com dados básicos
        const newUser = {
          nome: user.displayName || "Usuário",
          email: user.email || "",
          criadoEm: new Date()
        };

        await setDoc(docRef, newUser);

        document.getElementById("userName").textContent = newUser.nome;
        document.getElementById("userName2").textContent = newUser.nome;
        document.getElementById("userEmail").textContent = newUser.email;
        profileImage.src = "default-avatar.png";
      }

    } catch (err) {
      console.error("Erro ao buscar/criar dados:", err);
    }

  } else {
    // Usuário não logado
    window.location.href = "index.html";
  }
});

// Upload da imagem de perfil
uploadInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file || !currentUser) return;

  const storageRef = ref(storage, `avatars/${currentUser.uid}`);
  try {
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    profileImage.src = downloadURL;

    await updateDoc(doc(db, "usuarios", currentUser.uid), {
      fotoURL: downloadURL
    });

    alert("Foto de perfil atualizada!");
  } catch (err) {
    console.error("Erro ao enviar imagem:", err);
    alert("Erro ao enviar imagem.");
  }
});

// Logout
window.logout = async () => {
  try {
    await signOut(auth);
    window.location.href = "index.html";
  } catch (err) {
    alert("Erro ao sair: " + err.message);
  }
};

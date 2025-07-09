import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Firebase config
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
const storage = getStorage(app);

const profileImage = document.getElementById("profileImage");
const uploadInput = document.getElementById("uploadInput");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const docRef = doc(db, "usuarios", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById("userName").textContent = data.nome || "Usuário";
        document.getElementById("userName2").textContent = data.nome || "Não informado";
        document.getElementById("userEmail").textContent = data.email || user.email;

        // Atualiza imagem se existir
        if (data.fotoURL) {
          profileImage.src = data.fotoURL;
        }
      }
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    }

    // Upload de imagem
    uploadInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const storageRef = ref(storage, `avatars/${user.uid}`);
      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        profileImage.src = downloadURL;

        // Salva no Firestore
        await updateDoc(doc(db, "usuarios", user.uid), {
          fotoURL: downloadURL
        });
        alert("Foto de perfil atualizada!");
      } catch (err) {
        console.error("Erro ao enviar imagem:", err);
        alert("Erro ao enviar imagem.");
      }
    });
  } else {
    window.location.href = "index.html";
  }
});

window.logout = async () => {
  try {
    await signOut(auth);
    window.location.href = "index.html";
  } catch (err) {
    alert("Erro ao sair: " + err.message);
  }
};

import firebase from 'firebase/app';
import 'firebase/storage';
import { upload } from "./upload.js";

const firebaseConfig = {
  apiKey: "AIzaSyCaopQn6r781eWz850rme2UQXYLSzcpnKw",
  authDomain: "fe-upload-e320e.firebaseapp.com",
  projectId: "fe-upload-e320e",
  storageBucket: "fe-upload-e320e.appspot.com",
  messagingSenderId: "757206189644",
  appId: "1:757206189644:web:02c5e14b00f7dd5db816e9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

upload("#file",
  {
    multi: true,
    accept: [".png", ".jpg", ".jpeg", ".gif"],
    onUpload(files, blocks) {
      files.forEach((file, index) => {
        const ref = storage.ref(`images/${file.name}`);
        const task = ref.put(file);

        task.on('state_changed', snapshot => {
          const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%';
          const block = blocks[index].querySelector('.preview-info-progress');
          block.textContent = percentage;
          block.style.width = percentage;
        }, error => {
          console.log(error);
        }, () => {
          task.snapshot.ref.getDownloadURL().then(url => {
            console.log('Download URL', url);
          })
        }
        )
      });
    }
  });
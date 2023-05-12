import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import {
  onAuthStateChanged,
  signOut,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { Notify } from 'notiflix';

const firebaseConfig = {
  apiKey: 'AIzaSyDgcR2X1TS4UZRHOqbA2qwoeiJg4zG1uTI',
  authDomain: 'test2-c87cf.firebaseapp.com',
  databaseURL:
    'https://test2-c87cf-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'test2-c87cf',
  storageBucket: 'test2-c87cf.appspot.com',
  messagingSenderId: '989932796520',
  appId: '1:989932796520:web:5850c52d4351a3821dd9dd',
};
// const form = document.querySelector('.form_sign');
const inputName = document.getElementById('names');
const inputEmail = document.getElementById('emails');
const inputPassword = document.getElementById('pass');
const btnEnter = document.getElementById('btnEnter');
const btnUp = document.querySelector('.btnUp');
const btnLogOut = document.getElementById('btnLogOut');
const btnIn = document.querySelector('.btnIn');
const logOutBtn = document.getElementById('logOutBtn');
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// listner for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    const loggedUserName = localStorage.getItem('name');
    const blueBtn = document.querySelector('.user-name');
    blueBtn.textContent = loggedUserName;
    console.log(loggedUserName);
    const signUpBox = document.getElementById('signUpBox');
    signUpBox.classList.add('is-out');
    const navMain = document.getElementById('navMain');
    navMain.classList.toggle('is-hidden');
    const authBox = document.getElementById('authBox');
    authBox.classList.remove('is-out');

    //покажи шоплист и добавь имя на кнопку в хедере и покажи иконку випадающего окна(при клике выведи кнопку логаут)

    console.log('user loggged in');
  } else {
    //убери шоплист и убери имя на кнопку в хедере и убери иконку випадающего окна

    console.log('user loggged out');
  }
});

async function createLoginEmailPassword(e) {
  if (btnEnter.classList.contains('btnUp')) {
    e.preventDefault();
    const loginEmail = inputEmail.value;
    const loginPassword = inputPassword.value;
    const loginName = inputName.value;

    const create = await createUserWithEmailAndPassword(
      auth,
      loginEmail,
      loginPassword
    ).then(userCredential => {
      const user = userCredential.user;
      const username = loginName;
      localStorage.setItem('name', username);
      const loggedUserName = localStorage.getItem('name');
      const blueBtn = document.querySelector('.user-name');
      blueBtn.textContent = loggedUserName;

      set(ref(database, 'users/' + user.uid), {
        name: loginName,
        books: 1,
      });

      Notify.info('Sign up is successful, please Sign in to continue!');
    });

    //   const userId = auth.currentUser.uid;

    //   const getValue = await returnName();
    //   function returnName() {
    //      return onValue(
    //         ref(database, '/users/' + userId),
    //         snapshot => {
    //            const username = snapshot.val().name;
    //            console.log(username);
    //          },
    //          {
    //             onlyOnce: true,
    //          }
    //          );
    //       }
  }
}

btnEnter.addEventListener('click', createLoginEmailPassword);

const loginEmailPassword = async e => {
  if (btnEnter.classList.contains('btnIn')) {
    e.preventDefault();

    const loginEmail = inputEmail.value;
    const loginPassword = inputPassword.value;
    const userCredential = await signInWithEmailAndPassword(
      auth,
      loginEmail,
      loginPassword
    );

    const userId = auth.currentUser.uid;
    const getValue = await returnName();
    function returnName() {
      return onValue(
        ref(database, 'users/' + userId),
        snapshot => {
          const username = snapshot.val().name;
          const userBooks = snapshot.val().books;

          localStorage.setItem('name', username);
          localStorage.setItem('shoppingList', JSON.stringify(userBooks));
          const loggedUserName = localStorage.getItem('name');
          const blueBtn = document.querySelector('.user-name');
          blueBtn.textContent = loggedUserName;
        },
        {
          onlyOnce: true,
        }
      );
    }
  } else {
    return;
  }

  // auth.onAuthStateChanged(user => {
  //   if (user) {
  //     //покажи шоплист и добавь имя на кнопку в хедере и покажи иконку випадающего окна(при клике выведи кнопку логаут)
  //     const loggedUserName = localStorage.getItem('name');

  //     console.log('user loggged in');
  //   }
  //   // } else {
  //   //   //убери шоплист и убери имя на кнопку в хедере и убери иконку випадающего окна
  //   //   console.log('user loggged out');
  //   // }
  // });
};

btnEnter.addEventListener('click', loginEmailPassword);

logOutBtn.addEventListener('click', onBtnLogout);

//функция выхода

function onBtnLogout(event) {
  event.preventDefault();

  // localStorage.getItem('shoppingList');
  const shoppingListJSON = localStorage.getItem('shoppingList');
  let currentBooks = JSON.parse(shoppingListJSON);
  const currentName = localStorage.getItem('name');

  function writeUserData() {
    const database = getDatabase();
    const userId = auth.currentUser.uid;
    set(ref(database, 'users/' + userId), {
      books: currentBooks,
      name: currentName,
    });
  }
  writeUserData();

  auth.signOut().then(() => {
    // window.location.href = './index.html';
    // localStorage.removeItem('shoppingList');

    console.log('user signed out');
  });
}

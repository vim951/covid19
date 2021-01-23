//====================================================================================================

import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

//====================================================================================================

import firebase from "firebase/app";
import "firebase/auth";
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
  IfFirebaseAuthed,
  IfFirebaseUnAuthed
} from "@react-firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyDJvf-n2x8FV9k4rAOzgR1ftZ_pzrv8mvQ",
  authDomain: "covid19-bd85f.firebaseapp.com",
  projectId: "covid19-bd85f",
  storageBucket: "covid19-bd85f.appspot.com",
  messagingSenderId: "71913870941",
  appId: "1:71913870941:web:ae692dfbf368e8d6f7dfb4"
};

//====================================================================================================

export default function App() {
  return (
      <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
        {
          <Router>
            <div className="navbar navbar-expand-lg bg-dark navbar-dark">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item active">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
              </ul>
            </div>

            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </Router>
        }
      </FirebaseAuthProvider>
  );
}

//====================================================================================================

function Home() {
  return (
      <>
        <h2>Welcome message</h2>
        <SignInMessage />
      </>
  );
}

function SignInMessage(){
  return (
      <>
        <IfFirebaseAuthed>
          <FirebaseAuthConsumer>
            {({user}) => {
              return (<p>Welcome back {user.displayName}!</p>);
            }}
          </FirebaseAuthConsumer>
        </IfFirebaseAuthed>
        <IfFirebaseUnAuthed>
          <p>Go sign in you idiot!</p>
        </IfFirebaseUnAuthed>
      </>
  );
}

//====================================================================================================

function Login() {
  return (
      <div>
        <button
            onClick={() => {
              const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
              firebase.auth().signInWithPopup(googleAuthProvider).then(function(result) {
                // code which runs on success
              }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                console.log(errorCode);
                alert(errorCode);

                var errorMessage = error.message;
                console.log(errorMessage);
                alert(errorMessage);
              });
            }}
        >
          Sign In with Google
        </button>
        <button
            onClick={() => {
              firebase.auth().signInAnonymously();
            }}
        >
          Sign In Anonymously
        </button>
        <button
            onClick={() => {
              firebase.auth().signOut();
            }}
        >
          Sign Out
        </button>
        <SignInMessage />
      </div>
  );
}
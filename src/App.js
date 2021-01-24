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
import "firebase/firestore";

import {
    FirebaseAuthProvider,
    FirebaseAuthConsumer,
    IfFirebaseAuthed,
    IfFirebaseUnAuthed
} from "@react-firebase/auth";

import {
    FirestoreCollection,
    FirestoreMutation,
    FirestoreProvider
} from "@react-firebase/firestore";

//====================================================================================================

import Fetch from 'react-fetch'

//====================================================================================================

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'

//====================================================================================================

const firebaseConfig = {
  apiKey: "AIzaSyDJvf-n2x8FV9k4rAOzgR1ftZ_pzrv8mvQ",
  authDomain: "covid19-bd85f.firebaseapp.com",
  projectId: "covid19-bd85f",
  storageBucket: "covid19-bd85f.appspot.com",
  messagingSenderId: "71913870941",
  appId: "1:71913870941:web:ae692dfbf368e8d6f7dfb4"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
export const db = firebaseApp.firestore();

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
                                <li className="nav-item active">
                                    <Link className="nav-link" to="/news">News</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                            </ul>
                        </div>

                        <div className="container">
                            <Switch>
                                <Route path="/news">
                                    <NewsPage />
                                </Route>
                                <Route path="/login">
                                    <LoginPage />
                                </Route>
                                <Route path="/">
                                    <HomePage />
                                </Route>
                            </Switch>
                        </div>
                    </Router>
                }
        </FirebaseAuthProvider>
    );
}

//====================================================================================================

function HomePage() {
    console.log(checkIfSummaryIsOutdated())
    return (
        <>
            <h2>Welcome home!</h2>
        </>
    );
}

function APIFetchSummary(){
    return <Fetch url="https://api.covid19api.com/summary">
        <UpdateSummaryData/>
    </Fetch>
}

function checkIfSummaryIsOutdated(){
    db.collection("API_data")
        .doc('summary')
        .get()
        .then(doc => {
            return ((new Date().getTime())-(new Date(doc.data().Date)).getTime())>(24*3600*1000)
        });
}

class UpdateSummaryData extends React.Component {
    render() {
        if (this.props.Countries) {
            db.collection("API_data").doc("summary").set(this.props)
        }
        return <div/>;
    }
}

class APIResultSummary extends React.Component{
    render(){
        if (this.props.Countries) {
            return (
                <>
                <pre style={{ height: 300, overflow: "auto" }}>
                    {JSON.stringify(this.props, null, 2)}
                </pre>
                </>
            );
        }else{
            return <Loading/>;
        }
    }
}

//====================================================================================================

function LogInMessage(){
    return (
        <>
            <IfFirebaseAuthed>
                <LogInMessageForLoggedIn/>
            </IfFirebaseAuthed>
            <IfFirebaseUnAuthed>
                <LogInMessageForNotLoggedIn/>
            </IfFirebaseUnAuthed>
        </>
    );
}

function LogInMessageForLoggedIn(){
    return (
        <FirebaseAuthConsumer>
            {({user}) => {
                return (
                    <>
                        <h2 className="mt-5 mb-3" >Welcome back!</h2>
                        <p>We are happy to see you {user.displayName}! Here are you profile parameters:</p>
                        <div className="row">
                            <div className="col-4 mb-3">
                                <img src={user.photoURL} className="rounded float-left" alt="url"/>
                            </div>
                            <div className="col-8 mb-3">
                                <ul>
                                    <li>Name: {user.displayName}</li>
                                    <li>Email: {user.email}</li>
                                </ul>
                            </div>
                        </div>
                        <LogOut/>
                    </>
                );
            }}
        </FirebaseAuthConsumer>
    );
}

function LogInMessageForNotLoggedIn(){
    return (
        <>
            <h2>Sign in</h2>
            <LogIn/>
        </>
    );
}

function LogIn() {
    return (
        <div>
            <p>Currently, we only support Google authentication: </p>
            <button
                className={'btn btn-light'}
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
                <FontAwesomeIcon icon={faGoogle} size="3x" />
            </button>
        </div>
    );
}

function LogOut() {
    return (
        <div>
            <button
                className={'btn btn-secondary'}
                onClick={() => {
                    firebase.auth().signOut();
                }}
            >
                Log me out
            </button>
        </div>
    );
}

function LoginPage() {
    return (
        <>
            <LogInMessage/>
        </>
    );
}

//====================================================================================================

function NewsPage() {
  return (
      <>
          <h2 className="mt-5 mb-3">Latest news</h2>
          <FirestoreCollection path="/news/" limit={20}>
              {docs => {
                  return docs.isLoading ? <Loading/> : <PrintNews docs={docs}/>
              }}
          </FirestoreCollection>
      </>
  );
}

function Loading(){
    return (
        <div className="spinner-grow" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    );
}

//TODO: use reducers
function PrintNews(docs){
    return (
        <div className="row">
            {docs.docs.value && docs.docs.value.map((value, index) => {
                return <PrintPieceOfNews news={value}/>
            })}
        </div>
    );
}

function PrintPieceOfNews(news){
    console.log(news.news)
    return (
        <div className="col-12 mb-3">
            <div className="card shadow-sm h-100">
                <h5 className="card-header">{news.news.title}</h5>
                <div className="card-body">
                    {news.news.content}
                </div>
                <div className="card-footer">
                    Date
                </div>
            </div>
        </div>
    );
}
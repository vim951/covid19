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

import PropTypes from 'prop-types'

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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'

//====================================================================================================

import MaterialTable from "material-table";

import { Pie, Bar, Line } from 'react-chartjs-2'

export const RED = 'rgb(255, 99, 132)';
export const GREEN = 'rgb(75, 192, 192)';
export const BLUE = 'rgb(54, 162, 235)';

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
                                    <Link className="nav-link" to="/">Global summary</Link>
                                </li>
                                <li className="nav-item active">
                                    <Link className="nav-link" to="/summary_per_country">Summary per country</Link>
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
                                <Route path="/summary_per_country">
                                    <SummaryPerCountryPage />
                                </Route>
                                <Route path="/">
                                    <GlobalSummaryPage />
                                </Route>
                            </Switch>
                        </div>
                    </Router>
                }
        </FirebaseAuthProvider>
    );
}

//====================================================================================================

function GlobalSummaryPage() {
    return (
        <>
            <h1 className={'mt-5 mb-3'}>Worldwide data</h1>
            <APIGlobalSummaryPart1/>
            <APIGlobalSummaryPart2/>
            <APIGlobalSummaryPart3/>
        </>
    );
}

function sortDateArray(a,b){
    return new Date(a) - new Date(b);
}

function APIGlobalSummaryPart1(){
    return (
        <APIComponent api_url={'https://api.covid19api.com/summary'} doc_id={'global_summary_part1'} render_function={(data) => {
            const columns = [
                {
                    title: "Total confirmed",
                    field: "TotalConfirmed",
                },
                {
                    title: "New confirmed",
                    field: "NewConfirmed",
                },
                {
                    title: "Active cases",
                    field: "ActiveCases",
                },
                {
                    title: "Total recovered",
                    field: "TotalRecovered",
                },
                {
                    title: "New recovered",
                    field: "NewRecovered",
                },
                {
                    title: "Recovery rate",
                    field: "RecoveryRate",
                },
                {
                    title: "Total deaths",
                    field: "TotalDeaths",
                },
                {
                    title: "New deaths",
                    field: "NewDeaths",
                },
                {
                    title: "Mortality rate",
                    field: "MortalityRate",
                },
            ];
            data.Global.RecoveryRate = (100 * data.Global.TotalRecovered / data.Global.TotalConfirmed).toFixed(2) + "%";
            data.Global.MortalityRate = (100 * data.Global.TotalDeaths / data.Global.TotalConfirmed).toFixed(2) + "%";
            data.Global.ActiveCases = data.Global.TotalConfirmed - data.Global.TotalDeaths - data.Global.TotalRecovered;
            const pie_data = {
                labels: ['Active', 'Recovered', 'Dead'],
                datasets: [
                    {
                        backgroundColor: [
                            BLUE,
                            GREEN,
                            RED
                        ],
                        data: [
                            data.Global.ActiveCases,
                            data.Global.TotalRecovered,
                            data.Global.TotalDeaths
                        ]
                    },
                ],
            }
            return (
                <>
                    <MaterialTable
                        title={'Covid19 summary'}
                        data={[data.Global]}
                        columns={columns}
                        options={{ search: false, paging: false, filtering: false, exportButton: true }}
                    />
                    <h2 className={'mt-5 mb-3'}>Covid19 cases distribution</h2>
                    <Pie data={pie_data}/>
                </>
            );
        }}/>
    );
}

function APIGlobalSummaryPart2(){
    return (
        <APIComponent api_url={'https://corona.lmao.ninja/v2/historical/all?lastdays=7'} doc_id={'global_summary_part2'} render_function={(data) => {
            const bar_data = {
                labels: Object.keys(data.cases).sort(sortDateArray),
                datasets: [
                    {
                        label: 'cases',
                        data: Object.values(Object.keys(data.cases).sort(sortDateArray).reduce(
                            (obj, key) => {
                                obj[key] = data.cases[key];
                                return obj;
                            },
                            {}
                        )),
                        backgroundColor: BLUE,
                    },
                    {
                        label: 'recovered',
                        data: Object.values(Object.keys(data.recovered).sort(sortDateArray).reduce(
                            (obj, key) => {
                                obj[key] = data.recovered[key];
                                return obj;
                            },
                            {}
                        )),
                        backgroundColor: GREEN,
                    },
                    {
                        label: 'deaths',
                        data: Object.values(Object.keys(data.deaths).sort(sortDateArray).reduce(
                            (obj, key) => {
                                obj[key] = data.deaths[key];
                                return obj;
                            },
                            {}
                        )),
                        backgroundColor: RED,
                    },
                ],
            }
            const options = {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                            },
                        },
                    ],
                },
            }
            return (
                <>
                    <h2 className={'mt-5 mb-3'}>Daily covid19 cases (7 days)</h2>
                    <Bar data={bar_data} options={options} />
                </>
            );
        }}/>
    );
}

function APIGlobalSummaryPart3(){
    return (
        <APIComponent api_url={'https://corona.lmao.ninja/v2/historical/all'} doc_id={'global_summary_part3'} render_function={(data) => {
            const line_data = {
                labels: Object.keys(data.cases).sort(sortDateArray),
                datasets: [
                    {
                        label: 'deaths',
                        data: Object.values(Object.keys(data.deaths).sort(sortDateArray).reduce(
                            (obj, key) => {
                                obj[key] = data.deaths[key];
                                return obj;
                            },
                            {}
                        )),
                        backgroundColor: RED,
                    },
                    {
                        label: 'cases',
                        data: Object.values(Object.keys(data.cases).sort(sortDateArray).reduce(
                            (obj, key) => {
                                obj[key] = data.cases[key];
                                return obj;
                            },
                            {}
                        )),
                        backgroundColor: BLUE,
                    },
                    {
                        label: 'recovered',
                        data: Object.values(Object.keys(data.recovered).sort(sortDateArray).reduce(
                            (obj, key) => {
                                obj[key] = data.recovered[key];
                                return obj;
                            },
                            {}
                        )),
                        backgroundColor: GREEN,
                    },
                ],
            }
            const options = {
                scales: {
                    yAxes: [
                        {
                            stacked: true,
                            ticks: {
                                beginAtZero: true,
                            },
                        },
                    ],
                    xAxes: [
                        {
                            stacked: true,
                        },
                    ],
                },
            }
            return (
                <>
                    <h2 className={'mt-5 mb-3'}>Daily covid19 cases (30 days)</h2>
                    <Line data={line_data} options={options} />
                </>
            );
        }}/>
    );
}

//====================================================================================================

function SummaryPerCountryPage() {
    return <APISummaryPerCountryTable/>;
}

function APISummaryPerCountryTable(){
    return (
        <APIComponent api_url={'https://api.covid19api.com/summary'} doc_id={'summary'} render_function={(data) => {
            const columns = [
                {
                    title: "Country code",
                    field: "CountryCode",
                },
                {
                    title: "Country",
                    field: "Country",
                },
                {
                    title: "New confirmed",
                    field: "NewConfirmed",
                },
                {
                    title: "Total confirmed",
                    field: "TotalConfirmed",
                },
                {
                    title: "New recovered",
                    field: "NewRecovered",
                },
                {
                    title: "Total recovered",
                    field: "TotalRecovered",
                },
                {
                    title: "New deaths",
                    field: "NewDeaths",
                },
                {
                    title: "Total deaths",
                    field: "TotalDeaths",
                },
            ];
            return (
                <>
                    <MaterialTable
                        title="Summary per country"
                        data={data.Countries}
                        columns={columns}
                        options={{ search: true, paging: true, pageSize: 20, pageSizeOptions: [10, 20, 50, 100, 200], filtering: true, exportButton: true }}
                    />
                </>
            );
        }}/>
    );
}

class APIComponent extends React.Component {

    static propTypes = {
        api_url: PropTypes.string,
        doc_id: PropTypes.string,
        render_function: PropTypes.func
    }

    constructor(props) {
        super(props);
        this.check_doc = this.check_doc.bind(this)
        this.update_data = this.update_data.bind(this)
        this.update_doc = this.update_doc.bind(this)
    }

    componentDidMount(){
        this.request_doc();
    }

    request_doc(){
        db.collection("API_data")
            .doc(this.props.doc_id)
            .get()
            .then(this.check_doc);
    }

    check_doc(doc){
        console.log(doc.data())
        if (((new Date().getTime())-(new Date(doc.data().Date)).getTime())>(24*3600*1000)){
            console.log('Document outdated')
            this.call_api();
        }else{
            console.log('Document up to date')
            this.update_data(doc.data());
        }
    }

    update_data(data){
        this.setState({data:  data});
    }

    call_api(){
        fetch(this.props.api_url)
            .then((response) =>
                Promise.resolve(response.json()).then(this.update_doc)
            )
    }

    update_doc(data){
        db.collection("API_data")
            .doc(this.props.doc_id)
            .set(data)
        this.update_data(data);
    }

    render() {
        if (this.state){
            return this.props.render_function(this.state.data);
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
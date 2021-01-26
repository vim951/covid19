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

export const MAX_HOURS = 6;

//====================================================================================================

Object.filter = (obj, predicate) =>
    Object.keys(obj)
        .filter( key => predicate(obj[key]) )
        .reduce( (res, key) => (res[key] = obj[key], res), {} );

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

export const groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

//====================================================================================================

export default function App() {
    return (
        <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
            {
                <Router>
                    <div className="navbar navbar-expand-lg bg-dark navbar-dark">
                        <a className="navbar-brand" href="/">
                            <img src="https://firebasestorage.googleapis.com/v0/b/covid19-bd85f.appspot.com/o/covid19.png?alt=media&token=157c859b-ac3f-4d34-9b63-d570c9d300f9" width="48" height="30" alt=""/>
                            Corona-Monitor
                        </a>
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item active">
                                <Link className="nav-link" to="/">Get informed</Link>
                            </li>
                            <li className="nav-item active">
                                <Link className="nav-link" to="/contribute">Contribute</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="container">
                        <Switch>
                            <Route path="/contribute">
                                <ContributionPage />
                            </Route>
                            <Route path="/login">
                                <LoginPage />
                            </Route>
                            <Route path="/country/:id" component={SummaryCountryPage}/>
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
            <h1 className="mt-5 mb-3">Latest news</h1>
            <News area={'world'}/>
            <h1 className={'mt-5 mb-3'}>Worldwide data</h1>
            <ul className="nav nav-tabs mt-3" id="myTab" role="tablist">
                <li className="nav-item">
                    <a className="nav-link active" id="summary-tab" data-toggle="tab" href="#summary" role="tab"
                       aria-controls="bien" aria-selected="true">Summary</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" id="distribution-tab" data-toggle="tab" href="#distribution" role="tab"
                       aria-controls="proprietaire" aria-selected="false">Cases distribution</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" id="seven-tab" data-toggle="tab" href="#seven" role="tab"
                       aria-controls="locataire" aria-selected="false">Daily (7 days)</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" id="thirty-tab" data-toggle="tab" href="#thirty" role="tab"
                       aria-controls="loyer" aria-selected="false">Daily (30 days)</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" id="table-tab" data-toggle="tab" href="#table" role="tab"
                       aria-controls="loyer" aria-selected="false">By country</a>
                </li>
            </ul>
            <div className="tab-content mb-3" id="myTabContent">
                <APIGlobalSummaryPart1/>
                <APIGlobalSummaryPart2/>
                <APIGlobalSummaryPart3/>
                <APIGlobalSummaryPart4/>
            </div>
        </>
    );
}

function sortDateArray(a,b){
    return new Date(a) - new Date(b);
}

function APIGlobalSummaryPart1(){
    return (
        <APIComponent
            api_url={'https://api.covid19api.com/summary'}
            doc_id={'part1'}
            collection_id={'data_worldwide'}
            add_date={false}
            render_function={(data) => {
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
                    <div className="tab-pane fade show active mt-3" id="summary" role="tabpanel" aria-labelledby="summary-tab">
                        <MaterialTable
                            title={'Covid19 summary'}
                            data={[data.Global]}
                            columns={columns}
                            options={{ search: false, paging: false, filtering: false, exportButton: true }}
                        />
                    </div>
                    <div className="tab-pane fade" id="distribution" role="tabpanel" aria-labelledby="distribution-tab">
                        <h2 className={'mt-5 mb-3'}>Covid19 cases distribution</h2>
                        <Pie data={pie_data}/>
                    </div>
                </>
            );
        }}/>
    );
}

function APIGlobalSummaryPart2(){
    return (
        <APIComponent
            api_url={'https://corona.lmao.ninja/v2/historical/all?lastdays=7'}
            doc_id={'part2'}
            collection_id={'data_worldwide'}
            add_date={true}
            render_function={(data) => {
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
                    <div className="tab-pane fade" id="seven" role="tabpanel" aria-labelledby="seven-tab">
                        <h2 className={'mt-5 mb-3'}>Daily covid19 cases (7 days)</h2>
                        <Bar data={bar_data} options={options} />
                    </div>
                </>
            );
        }}/>
    );
}

function APIGlobalSummaryPart3(){
    return (
        <APIComponent
            api_url={'https://corona.lmao.ninja/v2/historical/all'}
            doc_id={'part3'}
            collection_id={'data_worldwide'}
            add_date={true}
            render_function={(data) => {
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
                    <div className="tab-pane fade" id="thirty" role="tabpanel" aria-labelledby="thirty-tab">
                        <h2 className={'mt-5 mb-3'}>Daily covid19 cases (30 days)</h2>
                        <Line data={line_data} options={options} />
                    </div>
                </>
            );
        }}/>
    );
}

//====================================================================================================

function APIGlobalSummaryPart4(){
    return (
        <APIComponent
            api_url={'https://api.covid19api.com/summary'}
            doc_id={'part1'}
            collection_id={'data_worldwide'}
            add_date={false}
            render_function={(data) => {
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
            console.log(data.Countries);
            data.Countries = data.Countries.map((value) => {
                value.Country = <Link className="nav-link" to={"/country/"+value.Slug}>{value.Country}</Link>;
                return value;
            })
            return (
                <>
                    <div className="tab-pane fade" id="table" role="tabpanel" aria-labelledby="table-tab">
                        <h2 className={'mt-5 mb-3'}>Covid19 cases by country</h2>
                        <MaterialTable
                            title="Covid19 cases by country"
                            data={data.Countries}
                            columns={columns}
                            options={{ search: true, paging: true, pageSize: 10, pageSizeOptions: [10, 20, 50, 100, 200], filtering: true, exportButton: true }}
                        />
                    </div>
                </>
            );
        }}/>
    );
}

class APIComponent extends React.Component {

    static propTypes = {
        api_url: PropTypes.string,
        doc_id: PropTypes.string,
        collection_id: PropTypes.string,
        add_date: PropTypes.bool,
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
        db.collection(this.props.collection_id)
            .doc(this.props.doc_id)
            .get()
            .then(this.check_doc);
    }

    check_doc(doc){
        if (doc.data() && doc.data().Date && ((new Date().getTime())-(new Date(doc.data().Date)).getTime())<(MAX_HOURS*3600*1000)){
            console.log('Document up to date')
            this.update_data(doc.data());
        }else{
            console.log('Document outdated')
            this.call_api();
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
        data = Object.assign({}, data)
        console.log(data);
        data.Date = firebase.firestore.Timestamp.now();
        db.collection(this.props.collection_id)
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

function SummaryCountryPage(){
    let { id } = useParams();
    return (
        <>
            <APICountrySummaryPart1 id={id}/>
            <APICountrySummaryPart2 id={id}/>
        </>
    );
}

function APICountrySummaryPart1(id){
    return (
        <APIComponent
            api_url={'https://api.covid19api.com/summary'}
            doc_id={'part1'}
            collection_id={'data_worldwide'}
            add_date={false}
            render_function={(data) => {
            data.Global = Object.filter(data.Countries, country => country.Slug === id.id);
            data.Global = data.Global[Object.keys(data.Global)[0]]
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
                    <h1 className={'mt-5 mb-3'}>{data.Global.Country} data</h1>
                    <MaterialTable
                        title={'Covid19 summary for ' + data.Global.Country}
                        data={[data.Global]}
                        columns={columns}
                        options={{ search: false, paging: false, filtering: false, exportButton: true }}
                    />
                    <h2 className={'mt-5 mb-3'}>Covid19 cases distribution in {data.Global.Country}</h2>
                    <Pie data={pie_data}/>
                </>
            );
        }}/>
    );
}

function APICountrySummaryPart2(id){
    let d1 = new Date();
    d1 = d1.addDays(-1);
    let d2 = d1.addDays(-7);
    return (
        <APIComponent
            api_url={'https://api.covid19api.com/country/' + id.id + '?from=' + d2.toISOString() + '&to=' + d1.toISOString()}
            doc_id={id.id}
            collection_id={'data_per_country'}
            add_date={false}
            render_function={(data) => {
                data = groupBy(Object.values(data), 'Date');
                data = Object.keys(data).map(function(key, index) {
                    return {
                        date: key,
                        active: Object.values(data[key]).reduce(function (a, b) {
                            return {Active: a.Active + b.Active};
                        }).Active,
                        confirmed: Object.values(data[key]).reduce(function (a, b) {
                            return {Confirmed: a.Confirmed + b.Confirmed};
                        }).Confirmed,
                        deaths: Object.values(data[key]).reduce(function (a, b) {
                            return {Deaths: a.Deaths + b.Deaths};
                        }).Deaths,
                        recovered: Object.values(data[key]).reduce(function (a, b) {
                            return {Recovered: a.Recovered + b.Recovered};
                        }).Recovered
                    };
                });
                console.log(data);
                console.log(Object.keys(data).map(function(key, index) {
                    return Object.values(data[key]);
                }));
                console.log(data.map(function(key, index) {
                    return data[index];
                }));
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
                    <pre style={{ height: 500, overflow: "auto" }}>
                        {JSON.stringify(data, null, 2)}
                    </pre>
                    </>
                );
            }}/>
    );
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

class News extends React.Component {

    static propTypes = {
        area: PropTypes.string
    }

    componentDidMount() {
        this.requestCollection();
    }

    requestCollection() {
        db.collection('news')
            .orderBy('date', 'desc')
            .limit(3)
            .get()
            .then((data) => this.setState({d:  data.docs}));
    }

    render() {
        if (this.state){
            return (<div className="row">
                {this.state.d.map(doc => {
                    return (
                        <>
                            <div className="col-12 col-md-6 col-lg-4 mb-3">
                                <div className="card">
                                    <img className="card-img-top" src="https://firebasestorage.googleapis.com/v0/b/covid19-bd85f.appspot.com/o/news.resized.jpg?alt=media&token=af4def4e-6e1c-42c7-a2fb-33a40be75e19" alt="Card image cap"/>
                                    <div className="card-body">
                                        <h5 className="card-title">{doc.data().title}</h5>
                                        <p className="card-text">Published by {doc.data().published_by} on {doc.data().date.toDate().toLocaleDateString()}</p>
                                        <button type="button" className="btn btn-primary" data-toggle="modal" data-target={"#modal_"+doc.id}>
                                            Read
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="modal fade" id={"modal_"+doc.id} tabIndex="-1" role="dialog"
                                 aria-labelledby={"label_modal_"+doc.id} aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id={"label_modal_"+doc.id}>{doc.data().title}</h5>
                                            <button type="button" className="close" data-dismiss="modal"
                                                    aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            {doc.data().content}
                                        </div>
                                        <div className="modal-footer">
                                            Published by {doc.data().published_by} on {doc.data().date.toDate().toLocaleDateString()}. <br/>
                                            Source: {doc.data().source}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    );
                })}
            </div>);
        }else{
            return <Loading/>;
        }
    }

}

function ContributionPage() {

  return (
      <>
          <h2 className="mt-5 mb-3">You can help!</h2>
          <form>
              <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input type="text" className="form-control" id="title" placeholder=""/>
              </div>
              <div className="form-group">
                  <label htmlFor="content">Your piece of news</label>
                  <textarea className="form-control" id="content" placeholder="" rows="10"/>
              </div>
              <div className="form-group">
                  <label htmlFor="source">Source</label>
                  <input type="textarea" className="form-control" id="source" placeholder=""/>
              </div>
              <button type="submit" className="btn btn-primary">Upload</button>
          </form>
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
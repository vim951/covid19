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

export const country_list = [
    {
        "Country": "Turkey",
        "Slug": "turkey",
        "ISO2": "TR"
    },
    {
        "Country": "Uganda",
        "Slug": "uganda",
        "ISO2": "UG"
    },
    {
        "Country": "Belize",
        "Slug": "belize",
        "ISO2": "BZ"
    },
    {
        "Country": "Bermuda",
        "Slug": "bermuda",
        "ISO2": "BM"
    },
    {
        "Country": "Central African Republic",
        "Slug": "central-african-republic",
        "ISO2": "CF"
    },
    {
        "Country": "Equatorial Guinea",
        "Slug": "equatorial-guinea",
        "ISO2": "GQ"
    },
    {
        "Country": "Georgia",
        "Slug": "georgia",
        "ISO2": "GE"
    },
    {
        "Country": "Ghana",
        "Slug": "ghana",
        "ISO2": "GH"
    },
    {
        "Country": "Heard and Mcdonald Islands",
        "Slug": "heard-and-mcdonald-islands",
        "ISO2": "HM"
    },
    {
        "Country": "Kazakhstan",
        "Slug": "kazakhstan",
        "ISO2": "KZ"
    },
    {
        "Country": "Peru",
        "Slug": "peru",
        "ISO2": "PE"
    },
    {
        "Country": "Qatar",
        "Slug": "qatar",
        "ISO2": "QA"
    },
    {
        "Country": "Brunei Darussalam",
        "Slug": "brunei",
        "ISO2": "BN"
    },
    {
        "Country": "Liechtenstein",
        "Slug": "liechtenstein",
        "ISO2": "LI"
    },
    {
        "Country": "Puerto Rico",
        "Slug": "puerto-rico",
        "ISO2": "PR"
    },
    {
        "Country": "British Virgin Islands",
        "Slug": "british-virgin-islands",
        "ISO2": "VG"
    },
    {
        "Country": "India",
        "Slug": "india",
        "ISO2": "IN"
    },
    {
        "Country": "Montserrat",
        "Slug": "montserrat",
        "ISO2": "MS"
    },
    {
        "Country": "Oman",
        "Slug": "oman",
        "ISO2": "OM"
    },
    {
        "Country": "Sudan",
        "Slug": "sudan",
        "ISO2": "SD"
    },
    {
        "Country": "Cook Islands",
        "Slug": "cook-islands",
        "ISO2": "CK"
    },
    {
        "Country": "Monaco",
        "Slug": "monaco",
        "ISO2": "MC"
    },
    {
        "Country": "Mozambique",
        "Slug": "mozambique",
        "ISO2": "MZ"
    },
    {
        "Country": "Niue",
        "Slug": "niue",
        "ISO2": "NU"
    },
    {
        "Country": "Colombia",
        "Slug": "colombia",
        "ISO2": "CO"
    },
    {
        "Country": "Romania",
        "Slug": "romania",
        "ISO2": "RO"
    },
    {
        "Country": "Virgin Islands, US",
        "Slug": "virgin-islands",
        "ISO2": "VI"
    },
    {
        "Country": "Zambia",
        "Slug": "zambia",
        "ISO2": "ZM"
    },
    {
        "Country": "Ethiopia",
        "Slug": "ethiopia",
        "ISO2": "ET"
    },
    {
        "Country": "Macedonia, Republic of",
        "Slug": "macedonia",
        "ISO2": "MK"
    },
    {
        "Country": "Tokelau",
        "Slug": "tokelau",
        "ISO2": "TK"
    },
    {
        "Country": "Greece",
        "Slug": "greece",
        "ISO2": "GR"
    },
    {
        "Country": "Japan",
        "Slug": "japan",
        "ISO2": "JP"
    },
    {
        "Country": "Palau",
        "Slug": "palau",
        "ISO2": "PW"
    },
    {
        "Country": "Tanzania, United Republic of",
        "Slug": "tanzania",
        "ISO2": "TZ"
    },
    {
        "Country": "Guyana",
        "Slug": "guyana",
        "ISO2": "GY"
    },
    {
        "Country": "Hong Kong, SAR China",
        "Slug": "hong-kong-sar-china",
        "ISO2": "HK"
    },
    {
        "Country": "Macao, SAR China",
        "Slug": "macao-sar-china",
        "ISO2": "MO"
    },
    {
        "Country": "Marshall Islands",
        "Slug": "marshall-islands",
        "ISO2": "MH"
    },
    {
        "Country": "Russian Federation",
        "Slug": "russia",
        "ISO2": "RU"
    },
    {
        "Country": "Denmark",
        "Slug": "denmark",
        "ISO2": "DK"
    },
    {
        "Country": "Dominica",
        "Slug": "dominica",
        "ISO2": "DM"
    },
    {
        "Country": "Indonesia",
        "Slug": "indonesia",
        "ISO2": "ID"
    },
    {
        "Country": "Pakistan",
        "Slug": "pakistan",
        "ISO2": "PK"
    },
    {
        "Country": "Senegal",
        "Slug": "senegal",
        "ISO2": "SN"
    },
    {
        "Country": "Slovakia",
        "Slug": "slovakia",
        "ISO2": "SK"
    },
    {
        "Country": "Libya",
        "Slug": "libya",
        "ISO2": "LY"
    },
    {
        "Country": "Malaysia",
        "Slug": "malaysia",
        "ISO2": "MY"
    },
    {
        "Country": "Aruba",
        "Slug": "aruba",
        "ISO2": "AW"
    },
    {
        "Country": "Bhutan",
        "Slug": "bhutan",
        "ISO2": "BT"
    },
    {
        "Country": "Congo (Brazzaville)",
        "Slug": "congo-brazzaville",
        "ISO2": "CG"
    },
    {
        "Country": "Guinea",
        "Slug": "guinea",
        "ISO2": "GN"
    },
    {
        "Country": "Korea (North)",
        "Slug": "korea-north",
        "ISO2": "KP"
    },
    {
        "Country": "Luxembourg",
        "Slug": "luxembourg",
        "ISO2": "LU"
    },
    {
        "Country": "Nauru",
        "Slug": "nauru",
        "ISO2": "NR"
    },
    {
        "Country": "Timor-Leste",
        "Slug": "timor-leste",
        "ISO2": "TL"
    },
    {
        "Country": "Albania",
        "Slug": "albania",
        "ISO2": "AL"
    },
    {
        "Country": "Cayman Islands",
        "Slug": "cayman-islands",
        "ISO2": "KY"
    },
    {
        "Country": "Montenegro",
        "Slug": "montenegro",
        "ISO2": "ME"
    },
    {
        "Country": "Namibia",
        "Slug": "namibia",
        "ISO2": "NA"
    },
    {
        "Country": "Norfolk Island",
        "Slug": "norfolk-island",
        "ISO2": "NF"
    },
    {
        "Country": "Spain",
        "Slug": "spain",
        "ISO2": "ES"
    },
    {
        "Country": "Viet Nam",
        "Slug": "vietnam",
        "ISO2": "VN"
    },
    {
        "Country": "Lesotho",
        "Slug": "lesotho",
        "ISO2": "LS"
    },
    {
        "Country": "New Caledonia",
        "Slug": "new-caledonia",
        "ISO2": "NC"
    },
    {
        "Country": "South Sudan",
        "Slug": "south-sudan",
        "ISO2": "SS"
    },
    {
        "Country": "Turks and Caicos Islands",
        "Slug": "turks-and-caicos-islands",
        "ISO2": "TC"
    },
    {
        "Country": "Martinique",
        "Slug": "martinique",
        "ISO2": "MQ"
    },
    {
        "Country": "Nicaragua",
        "Slug": "nicaragua",
        "ISO2": "NI"
    },
    {
        "Country": "Switzerland",
        "Slug": "switzerland",
        "ISO2": "CH"
    },
    {
        "Country": "Turkmenistan",
        "Slug": "turkmenistan",
        "ISO2": "TM"
    },
    {
        "Country": "Anguilla",
        "Slug": "anguilla",
        "ISO2": "AI"
    },
    {
        "Country": "Belgium",
        "Slug": "belgium",
        "ISO2": "BE"
    },
    {
        "Country": "Botswana",
        "Slug": "botswana",
        "ISO2": "BW"
    },
    {
        "Country": "South Georgia and the South Sandwich Islands",
        "Slug": "south-georgia-and-the-south-sandwich-islands",
        "ISO2": "GS"
    },
    {
        "Country": "Comoros",
        "Slug": "comoros",
        "ISO2": "KM"
    },
    {
        "Country": "Lao PDR",
        "Slug": "lao-pdr",
        "ISO2": "LA"
    },
    {
        "Country": "Belarus",
        "Slug": "belarus",
        "ISO2": "BY"
    },
    {
        "Country": "Guinea-Bissau",
        "Slug": "guinea-bissau",
        "ISO2": "GW"
    },
    {
        "Country": "Maldives",
        "Slug": "maldives",
        "ISO2": "MV"
    },
    {
        "Country": "Saint-Martin (French part)",
        "Slug": "saint-martin-french-part",
        "ISO2": "MF"
    },
    {
        "Country": "Jordan",
        "Slug": "jordan",
        "ISO2": "JO"
    },
    {
        "Country": "Liberia",
        "Slug": "liberia",
        "ISO2": "LR"
    },
    {
        "Country": "Saint Kitts and Nevis",
        "Slug": "saint-kitts-and-nevis",
        "ISO2": "KN"
    },
    {
        "Country": "Sierra Leone",
        "Slug": "sierra-leone",
        "ISO2": "SL"
    },
    {
        "Country": "Swaziland",
        "Slug": "swaziland",
        "ISO2": "SZ"
    },
    {
        "Country": "Benin",
        "Slug": "benin",
        "ISO2": "BJ"
    },
    {
        "Country": "Cocos (Keeling) Islands",
        "Slug": "cocos-keeling-islands",
        "ISO2": "CC"
    },
    {
        "Country": "Lithuania",
        "Slug": "lithuania",
        "ISO2": "LT"
    },
    {
        "Country": "Tunisia",
        "Slug": "tunisia",
        "ISO2": "TN"
    },
    {
        "Country": "Saint Pierre and Miquelon",
        "Slug": "saint-pierre-and-miquelon",
        "ISO2": "PM"
    },
    {
        "Country": "Solomon Islands",
        "Slug": "solomon-islands",
        "ISO2": "SB"
    },
    {
        "Country": "Suriname",
        "Slug": "suriname",
        "ISO2": "SR"
    },
    {
        "Country": "United Arab Emirates",
        "Slug": "united-arab-emirates",
        "ISO2": "AE"
    },
    {
        "Country": "Gabon",
        "Slug": "gabon",
        "ISO2": "GA"
    },
    {
        "Country": "Gambia",
        "Slug": "gambia",
        "ISO2": "GM"
    },
    {
        "Country": "Hungary",
        "Slug": "hungary",
        "ISO2": "HU"
    },
    {
        "Country": "Iceland",
        "Slug": "iceland",
        "ISO2": "IS"
    },
    {
        "Country": "Italy",
        "Slug": "italy",
        "ISO2": "IT"
    },
    {
        "Country": "Korea (South)",
        "Slug": "korea-south",
        "ISO2": "KR"
    },
    {
        "Country": "ALA Aland Islands",
        "Slug": "ala-aland-islands",
        "ISO2": "AX"
    },
    {
        "Country": "Azerbaijan",
        "Slug": "azerbaijan",
        "ISO2": "AZ"
    },
    {
        "Country": "Barbados",
        "Slug": "barbados",
        "ISO2": "BB"
    },
    {
        "Country": "Brazil",
        "Slug": "brazil",
        "ISO2": "BR"
    },
    {
        "Country": "Micronesia, Federated States of",
        "Slug": "micronesia",
        "ISO2": "FM"
    },
    {
        "Country": "Netherlands",
        "Slug": "netherlands",
        "ISO2": "NL"
    },
    {
        "Country": "Niger",
        "Slug": "niger",
        "ISO2": "NE"
    },
    {
        "Country": "Chad",
        "Slug": "chad",
        "ISO2": "TD"
    },
    {
        "Country": "Eritrea",
        "Slug": "eritrea",
        "ISO2": "ER"
    },
    {
        "Country": "Cambodia",
        "Slug": "cambodia",
        "ISO2": "KH"
    },
    {
        "Country": "Croatia",
        "Slug": "croatia",
        "ISO2": "HR"
    },
    {
        "Country": "Mali",
        "Slug": "mali",
        "ISO2": "ML"
    },
    {
        "Country": "Morocco",
        "Slug": "morocco",
        "ISO2": "MA"
    },
    {
        "Country": "Bouvet Island",
        "Slug": "bouvet-island",
        "ISO2": "BV"
    },
    {
        "Country": "French Guiana",
        "Slug": "french-guiana",
        "ISO2": "GF"
    },
    {
        "Country": "Guatemala",
        "Slug": "guatemala",
        "ISO2": "GT"
    },
    {
        "Country": "Tajikistan",
        "Slug": "tajikistan",
        "ISO2": "TJ"
    },
    {
        "Country": "Vanuatu",
        "Slug": "vanuatu",
        "ISO2": "VU"
    },
    {
        "Country": "Wallis and Futuna Islands",
        "Slug": "wallis-and-futuna-islands",
        "ISO2": "WF"
    },
    {
        "Country": "Afghanistan",
        "Slug": "afghanistan",
        "ISO2": "AF"
    },
    {
        "Country": "Argentina",
        "Slug": "argentina",
        "ISO2": "AR"
    },
    {
        "Country": "Northern Mariana Islands",
        "Slug": "northern-mariana-islands",
        "ISO2": "MP"
    },
    {
        "Country": "Pitcairn",
        "Slug": "pitcairn",
        "ISO2": "PN"
    },
    {
        "Country": "Antarctica",
        "Slug": "antarctica",
        "ISO2": "AQ"
    },
    {
        "Country": "Iraq",
        "Slug": "iraq",
        "ISO2": "IQ"
    },
    {
        "Country": "Antigua and Barbuda",
        "Slug": "antigua-and-barbuda",
        "ISO2": "AG"
    },
    {
        "Country": "Côte d'Ivoire",
        "Slug": "cote-divoire",
        "ISO2": "CI"
    },
    {
        "Country": "Myanmar",
        "Slug": "myanmar",
        "ISO2": "MM"
    },
    {
        "Country": "Portugal",
        "Slug": "portugal",
        "ISO2": "PT"
    },
    {
        "Country": "Jamaica",
        "Slug": "jamaica",
        "ISO2": "JM"
    },
    {
        "Country": "New Zealand",
        "Slug": "new-zealand",
        "ISO2": "NZ"
    },
    {
        "Country": "Andorra",
        "Slug": "andorra",
        "ISO2": "AD"
    },
    {
        "Country": "Iran, Islamic Republic of",
        "Slug": "iran",
        "ISO2": "IR"
    },
    {
        "Country": "Mongolia",
        "Slug": "mongolia",
        "ISO2": "MN"
    },
    {
        "Country": "Paraguay",
        "Slug": "paraguay",
        "ISO2": "PY"
    },
    {
        "Country": "Syrian Arab Republic (Syria)",
        "Slug": "syria",
        "ISO2": "SY"
    },
    {
        "Country": "China",
        "Slug": "china",
        "ISO2": "CN"
    },
    {
        "Country": "Costa Rica",
        "Slug": "costa-rica",
        "ISO2": "CR"
    },
    {
        "Country": "Dominican Republic",
        "Slug": "dominican-republic",
        "ISO2": "DO"
    },
    {
        "Country": "Latvia",
        "Slug": "latvia",
        "ISO2": "LV"
    },
    {
        "Country": "Mexico",
        "Slug": "mexico",
        "ISO2": "MX"
    },
    {
        "Country": "Germany",
        "Slug": "germany",
        "ISO2": "DE"
    },
    {
        "Country": "Kiribati",
        "Slug": "kiribati",
        "ISO2": "KI"
    },
    {
        "Country": "Mauritius",
        "Slug": "mauritius",
        "ISO2": "MU"
    },
    {
        "Country": "Nepal",
        "Slug": "nepal",
        "ISO2": "NP"
    },
    {
        "Country": "Greenland",
        "Slug": "greenland",
        "ISO2": "GL"
    },
    {
        "Country": "Saudi Arabia",
        "Slug": "saudi-arabia",
        "ISO2": "SA"
    },
    {
        "Country": "US Minor Outlying Islands",
        "Slug": "us-minor-outlying-islands",
        "ISO2": "UM"
    },
    {
        "Country": "Bosnia and Herzegovina",
        "Slug": "bosnia-and-herzegovina",
        "ISO2": "BA"
    },
    {
        "Country": "Netherlands Antilles",
        "Slug": "netherlands-antilles",
        "ISO2": "AN"
    },
    {
        "Country": "Slovenia",
        "Slug": "slovenia",
        "ISO2": "SI"
    },
    {
        "Country": "Togo",
        "Slug": "togo",
        "ISO2": "TG"
    },
    {
        "Country": "United States of America",
        "Slug": "united-states",
        "ISO2": "US"
    },
    {
        "Country": "Zimbabwe",
        "Slug": "zimbabwe",
        "ISO2": "ZW"
    },
    {
        "Country": "Australia",
        "Slug": "australia",
        "ISO2": "AU"
    },
    {
        "Country": "Estonia",
        "Slug": "estonia",
        "ISO2": "EE"
    },
    {
        "Country": "Egypt",
        "Slug": "egypt",
        "ISO2": "EG"
    },
    {
        "Country": "Serbia",
        "Slug": "serbia",
        "ISO2": "RS"
    },
    {
        "Country": "Palestinian Territory",
        "Slug": "palestine",
        "ISO2": "PS"
    },
    {
        "Country": "Saint Helena",
        "Slug": "saint-helena",
        "ISO2": "SH"
    },
    {
        "Country": "Trinidad and Tobago",
        "Slug": "trinidad-and-tobago",
        "ISO2": "TT"
    },
    {
        "Country": "Bangladesh",
        "Slug": "bangladesh",
        "ISO2": "BD"
    },
    {
        "Country": "Holy See (Vatican City State)",
        "Slug": "holy-see-vatican-city-state",
        "ISO2": "VA"
    },
    {
        "Country": "Papua New Guinea",
        "Slug": "papua-new-guinea",
        "ISO2": "PG"
    },
    {
        "Country": "Samoa",
        "Slug": "samoa",
        "ISO2": "WS"
    },
    {
        "Country": "Algeria",
        "Slug": "algeria",
        "ISO2": "DZ"
    },
    {
        "Country": "Bahamas",
        "Slug": "bahamas",
        "ISO2": "BS"
    },
    {
        "Country": "Ireland",
        "Slug": "ireland",
        "ISO2": "IE"
    },
    {
        "Country": "Svalbard and Jan Mayen Islands",
        "Slug": "svalbard-and-jan-mayen-islands",
        "ISO2": "SJ"
    },
    {
        "Country": "French Southern Territories",
        "Slug": "french-southern-territories",
        "ISO2": "TF"
    },
    {
        "Country": "Haiti",
        "Slug": "haiti",
        "ISO2": "HT"
    },
    {
        "Country": "Rwanda",
        "Slug": "rwanda",
        "ISO2": "RW"
    },
    {
        "Country": "Taiwan, Republic of China",
        "Slug": "taiwan",
        "ISO2": "TW"
    },
    {
        "Country": "Angola",
        "Slug": "angola",
        "ISO2": "AO"
    },
    {
        "Country": "Ecuador",
        "Slug": "ecuador",
        "ISO2": "EC"
    },
    {
        "Country": "Grenada",
        "Slug": "grenada",
        "ISO2": "GD"
    },
    {
        "Country": "San Marino",
        "Slug": "san-marino",
        "ISO2": "SM"
    },
    {
        "Country": "Faroe Islands",
        "Slug": "faroe-islands",
        "ISO2": "FO"
    },
    {
        "Country": "France",
        "Slug": "france",
        "ISO2": "FR"
    },
    {
        "Country": "Honduras",
        "Slug": "honduras",
        "ISO2": "HN"
    },
    {
        "Country": "Sri Lanka",
        "Slug": "sri-lanka",
        "ISO2": "LK"
    },
    {
        "Country": "Lebanon",
        "Slug": "lebanon",
        "ISO2": "LB"
    },
    {
        "Country": "Seychelles",
        "Slug": "seychelles",
        "ISO2": "SC"
    },
    {
        "Country": "Somalia",
        "Slug": "somalia",
        "ISO2": "SO"
    },
    {
        "Country": "Burundi",
        "Slug": "burundi",
        "ISO2": "BI"
    },
    {
        "Country": "Kuwait",
        "Slug": "kuwait",
        "ISO2": "KW"
    },
    {
        "Country": "Malawi",
        "Slug": "malawi",
        "ISO2": "MW"
    },
    {
        "Country": "Thailand",
        "Slug": "thailand",
        "ISO2": "TH"
    },
    {
        "Country": "Kenya",
        "Slug": "kenya",
        "ISO2": "KE"
    },
    {
        "Country": "Yemen",
        "Slug": "yemen",
        "ISO2": "YE"
    },
    {
        "Country": "British Indian Ocean Territory",
        "Slug": "british-indian-ocean-territory",
        "ISO2": "IO"
    },
    {
        "Country": "Chile",
        "Slug": "chile",
        "ISO2": "CL"
    },
    {
        "Country": "Cuba",
        "Slug": "cuba",
        "ISO2": "CU"
    },
    {
        "Country": "Kyrgyzstan",
        "Slug": "kyrgyzstan",
        "ISO2": "KG"
    },
    {
        "Country": "Sao Tome and Principe",
        "Slug": "sao-tome-and-principe",
        "ISO2": "ST"
    },
    {
        "Country": "Poland",
        "Slug": "poland",
        "ISO2": "PL"
    },
    {
        "Country": "Singapore",
        "Slug": "singapore",
        "ISO2": "SG"
    },
    {
        "Country": "Bahrain",
        "Slug": "bahrain",
        "ISO2": "BH"
    },
    {
        "Country": "Cameroon",
        "Slug": "cameroon",
        "ISO2": "CM"
    },
    {
        "Country": "Djibouti",
        "Slug": "djibouti",
        "ISO2": "DJ"
    },
    {
        "Country": "Guam",
        "Slug": "guam",
        "ISO2": "GU"
    },
    {
        "Country": "Panama",
        "Slug": "panama",
        "ISO2": "PA"
    },
    {
        "Country": "Venezuela (Bolivarian Republic)",
        "Slug": "venezuela",
        "ISO2": "VE"
    },
    {
        "Country": "Burkina Faso",
        "Slug": "burkina-faso",
        "ISO2": "BF"
    },
    {
        "Country": "Canada",
        "Slug": "canada",
        "ISO2": "CA"
    },
    {
        "Country": "Guernsey",
        "Slug": "guernsey",
        "ISO2": "GG"
    },
    {
        "Country": "Jersey",
        "Slug": "jersey",
        "ISO2": "JE"
    },
    {
        "Country": "Uzbekistan",
        "Slug": "uzbekistan",
        "ISO2": "UZ"
    },
    {
        "Country": "Philippines",
        "Slug": "philippines",
        "ISO2": "PH"
    },
    {
        "Country": "United Kingdom",
        "Slug": "united-kingdom",
        "ISO2": "GB"
    },
    {
        "Country": "American Samoa",
        "Slug": "american-samoa",
        "ISO2": "AS"
    },
    {
        "Country": "Bulgaria",
        "Slug": "bulgaria",
        "ISO2": "BG"
    },
    {
        "Country": "Czech Republic",
        "Slug": "czech-republic",
        "ISO2": "CZ"
    },
    {
        "Country": "Gibraltar",
        "Slug": "gibraltar",
        "ISO2": "GI"
    },
    {
        "Country": "Nigeria",
        "Slug": "nigeria",
        "ISO2": "NG"
    },
    {
        "Country": "Finland",
        "Slug": "finland",
        "ISO2": "FI"
    },
    {
        "Country": "Guadeloupe",
        "Slug": "guadeloupe",
        "ISO2": "GP"
    },
    {
        "Country": "Austria",
        "Slug": "austria",
        "ISO2": "AT"
    },
    {
        "Country": "Bolivia",
        "Slug": "bolivia",
        "ISO2": "BO"
    },
    {
        "Country": "Congo (Kinshasa)",
        "Slug": "congo-kinshasa",
        "ISO2": "CD"
    },
    {
        "Country": "Norway",
        "Slug": "norway",
        "ISO2": "NO"
    },
    {
        "Country": "Uruguay",
        "Slug": "uruguay",
        "ISO2": "UY"
    },
    {
        "Country": "El Salvador",
        "Slug": "el-salvador",
        "ISO2": "SV"
    },
    {
        "Country": "Tonga",
        "Slug": "tonga",
        "ISO2": "TO"
    },
    {
        "Country": "Christmas Island",
        "Slug": "christmas-island",
        "ISO2": "CX"
    },
    {
        "Country": "Saint-Barthélemy",
        "Slug": "saint-barthélemy",
        "ISO2": "BL"
    },
    {
        "Country": "Saint Vincent and Grenadines",
        "Slug": "saint-vincent-and-the-grenadines",
        "ISO2": "VC"
    },
    {
        "Country": "Armenia",
        "Slug": "armenia",
        "ISO2": "AM"
    },
    {
        "Country": "Cape Verde",
        "Slug": "cape-verde",
        "ISO2": "CV"
    },
    {
        "Country": "Madagascar",
        "Slug": "madagascar",
        "ISO2": "MG"
    },
    {
        "Country": "Malta",
        "Slug": "malta",
        "ISO2": "MT"
    },
    {
        "Country": "Mayotte",
        "Slug": "mayotte",
        "ISO2": "YT"
    },
    {
        "Country": "Moldova",
        "Slug": "moldova",
        "ISO2": "MD"
    },
    {
        "Country": "Cyprus",
        "Slug": "cyprus",
        "ISO2": "CY"
    },
    {
        "Country": "Fiji",
        "Slug": "fiji",
        "ISO2": "FJ"
    },
    {
        "Country": "French Polynesia",
        "Slug": "french-polynesia",
        "ISO2": "PF"
    },
    {
        "Country": "Réunion",
        "Slug": "réunion",
        "ISO2": "RE"
    },
    {
        "Country": "Republic of Kosovo",
        "Slug": "kosovo",
        "ISO2": "XK"
    },
    {
        "Country": "Isle of Man",
        "Slug": "isle-of-man",
        "ISO2": "IM"
    },
    {
        "Country": "Mauritania",
        "Slug": "mauritania",
        "ISO2": "MR"
    },
    {
        "Country": "Tuvalu",
        "Slug": "tuvalu",
        "ISO2": "TV"
    },
    {
        "Country": "Israel",
        "Slug": "israel",
        "ISO2": "IL"
    },
    {
        "Country": "Saint Lucia",
        "Slug": "saint-lucia",
        "ISO2": "LC"
    },
    {
        "Country": "South Africa",
        "Slug": "south-africa",
        "ISO2": "ZA"
    },
    {
        "Country": "Falkland Islands (Malvinas)",
        "Slug": "falkland-islands-malvinas",
        "ISO2": "FK"
    },
    {
        "Country": "Ukraine",
        "Slug": "ukraine",
        "ISO2": "UA"
    },
    {
        "Country": "Western Sahara",
        "Slug": "western-sahara",
        "ISO2": "EH"
    },
    {
        "Country": "Sweden",
        "Slug": "sweden",
        "ISO2": "SE"
    }
]

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
    country_list.sort((c1,c2) => {
        if ( c1.Country < c2.Country ){
            return -1;
        }
        else if ( c1.Country > c2.Country ){
            return 1;
        }
        else{
            return 0;
        }
    });
    return (
        <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
            {
                <Router>
                    <div className="navbar navbar-expand-lg bg-dark navbar-dark">
                        <a className="navbar-brand" href="/">
                            <img src="https://firebasestorage.googleapis.com/v0/b/covid19-bd85f.appspot.com/o/covid19.png?alt=media&token=157c859b-ac3f-4d34-9b63-d570c9d300f9" width="48" height="30" alt=""/>
                            Covid19 Monitor
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
            <NewsComponent area={'world'}/>
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
            this.update_data(doc.data());
        }else{
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

function makeId(length) { //From: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

class ContributeComponent extends React.Component {

    static propTypes = {
        user: PropTypes.object,
    }

    constructor(props) {
        super(props);
        this.check_doc = this.check_doc.bind(this);
    }

    componentDidMount() {
        this.requestCollection();
    }

    requestCollection() {
        db.collection('users')
            .doc(this.props.user.X.X)
            .get()
            .then(this.check_doc);
    }

    check_doc(doc){
        if (doc.data() && doc.data().privileged) {
            this.setState({privileged: doc.data().privileged});
        }else{
            this.setState({privileged:  'no'});
        }
    }

    render() {
        if (this.state && this.state.privileged && this.state.privileged === 'yes'){
            return (
                <>
                    <form>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input type="text" className="form-control" id="title" placeholder=""/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="region">Region</label>
                            <select className="form-control" id="region">
                                <option value="world">World</option>
                                {country_list.map(c => {
                                    return <option value={c.Slug}>{c.Country}</option>;
                                })}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="content">Your piece of news</label>
                            <textarea className="form-control" id="content" placeholder="" rows="10"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="source">Source</label>
                            <input type="textarea" className="form-control" id="source" placeholder=""/>
                        </div>
                    </form>
                    <button
                        className={'btn btn-primary'}
                        onClick={() => {
                            db.collection('news')
                                .doc(makeId(50))
                                .set({
                                    title: document.getElementById("title").value,
                                    region: document.getElementById("region").value,
                                    published_by: this.props.user.displayName,
                                    date: firebase.firestore.Timestamp.now(),
                                    source: document.getElementById("source").value,
                                    content: document.getElementById("content").value,
                                });
                        }}
                    >Upload</button>
                </>
            );
        }else if (this.state){
            return <p>You need to be registered as a contributor to publish an article. To do so, please go to your login page.</p>;
        }
        else{
            return <Loading/>;
        }
    }

}

class LogInUserComponent extends React.Component {

    static propTypes = {
        user: PropTypes.object,
    }

    constructor(props) {
        super(props);
        this.check_doc = this.check_doc.bind(this)
        this.update_doc = this.update_doc.bind(this)
    }

    componentDidMount() {
        this.requestCollection();
    }

    requestCollection() {
        db.collection('users')
            .doc(this.props.user.X.X)
            .get()
            .then(this.check_doc);
    }

    check_doc(doc){
        if (doc.data() && doc.data().privileged) {
            this.setState({privileged: doc.data().privileged});
        }else{
            this.setState({privileged:  'no'});
            this.update_doc('no');
        }
    }

    update_doc(value){
        db.collection('users')
            .doc(this.props.user.X.X)
            .set({privileged: value});
    }

    render_greetings(){
        return(
            <>
                <h2 className="mt-5 mb-3" >Welcome back!</h2>
                <p>We are happy to see you {this.props.user.displayName}! Here are you profile parameters:</p>
            </>
        );
    }

    render_user_description(){
        return (
            <>
                <div className="col-4 mb-3">
                    <img src={this.props.user.photoURL} className="rounded float-left" alt="url"/>
                </div>
                <div className="col-8 mb-3">
                    <ul>
                        <li>Name: {this.props.user.displayName}</li>
                        <li>Email: {this.props.user.email}</li>
                        <li>Contributor status: {this.state.privileged}</li>
                    </ul>
                </div>
            </>
        );
    }

    render_log_out(){
        return (
            <>
                <button className={'btn btn-secondary col-4 mb-3 ml-1 mr-1'}
                        onClick={() => {
                            firebase.auth().signOut();
                        }}
                >Log me out</button>
            </>
        );
    }

    render_upgrade(){
        return (
            <>
                <button className={'btn btn-secondary col-4 mb-3 ml-1 mr-1'}
                        onClick={() => {
                            this.setState({privileged: 'yes'});
                            this.update_doc('yes');
                        }}
                >Upgrade to contributor</button>
            </>
        );
    }

    render() {
        if (this.state){
            return (
                <>
                    {this.render_greetings()}
                    <div className="row">
                        {this.render_user_description()}
                        {this.render_log_out()}
                        {this.state.privileged === 'no' ? (
                            this.render_upgrade()
                        ) : (
                            <></>
                        )}
                    </div>
                </>
            );
        }else{
            return <Loading/>;
        }
    }

}

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
                return <LogInUserComponent user={user}/> ;
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
                    });
                }}
            >
                <FontAwesomeIcon icon={faGoogle} size="3x" />
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

class NewsComponent extends React.Component {

    static propTypes = {
        area: PropTypes.string
    }

    componentDidMount() {
        this.requestCollection();
    }

    requestCollection() {
        console.log(this.props.area);
        db.collection('news')
            .where("region", "==", this.props.area)
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
          <IfFirebaseAuthed>
              <FirebaseAuthConsumer>
                  {({user}) => {
                      return <ContributeComponent user={user}/> ;
                  }}
              </FirebaseAuthConsumer>
          </IfFirebaseAuthed>
          <IfFirebaseUnAuthed>
              <p>You need to be logged in and registered as a contributor to publish an article. To do so, please go to your login page.</p>
          </IfFirebaseUnAuthed>
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
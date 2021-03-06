const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();



const {getKategKomp} = require('./routes/index');
const {sveKompPage,editKompLokPage,
		editKompLok,addKompLok,
		addKompLokPage,editKomp,
		editKompPage,deleteKomp,
		addKompPage,addKomp,
		addPlayerPage, addPlayer,
		addKategPage, addKateg, 
		deletePlayer,deleteKateg, 
		editPlayer,editKateg, 
		komponentePage,komplokPage, 
		editPlayerPage, editKategPage} = require('./routes/player');

const {getLoginPage, getRegPage,
		getReg} = require('./routes/users');
const port = 5000;




// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.

const dbcred = require('./config/keys').db;

const db = mysql.createConnection ({
    host: dbcred.host,
    user:dbcred.username,
    password: dbcred.password,
    database: dbcred.database,
    multipleStatements: true
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Spojen na bazu');
});

global.db = db;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// routes for the app

app.get('/users/login',getLoginPage);
app.get('/users/register',getRegPage);
app.get('/sve_komp', sveKompPage);
app.get('/', getKategKomp);
app.get('/kateg/:id',komponentePage);
app.get('/komp/:id',komplokPage);
app.get('/add', addPlayerPage);
app.get('/dod_komp', addKompPage);
app.get('/dod',addKategPage);
app.get('/edit/:id', editPlayerPage);
app.get('/izmjeni/:id',editKategPage);
app.get('/delete/:id', deletePlayer);
app.get('/izbrisi/:id', deleteKateg);
app.get('/izbrisi_komp/:id',deleteKomp);
app.get('/izmjeni_komp/:id',editKompPage);
app.get('/dod_komp_lok/:id',addKompLokPage);
app.get('/izmjeni_komplok/:id',editKompLokPage);

app.post('/users/register',getReg);
app.post('/izmjeni_komp/:id',editKomp);
app.post('/dod_komp',addKomp);
app.post('/add', addPlayer);
app.post('/dod', addKateg);
app.post('/edit/:id', editPlayer);
app.post('/izmjeni/:id',editKateg);
app.post('/dod_komp_lok/:id',addKompLok);
app.post('/izmjeni_komplok/:id',editKompLok);

// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});


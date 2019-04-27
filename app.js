const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

const {getHomePage} = require('./routes/index');
const {getKategKomp} = require('./routes/index');
const {addPlayerPage, addPlayer, addKategPage, addKateg, deletePlayer,deleteKateg, editPlayer,komponentePage,komplokPage, editPlayerPage} = require('./routes/player');
const port = 5000;




// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
/*const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'dlibreman',
    database: 'socka'
});*/

const db1 = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'dlibreman',
    database: 'baza_komponenti'
});

// connect to database
/*db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database 1');
});*/

db1.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database 2');
});

global.db = db1;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// routes for the app

app.get('/', getKategKomp);
app.get('/kateg/:id',komponentePage);
app.get('/komp/:id',komplokPage);
app.get('/add', addPlayerPage);
app.get('/dod',addKategPage);
app.get('/edit/:id', editPlayerPage);
app.get('/delete/:id', deletePlayer);
app.get('/izbrisi/:id', deleteKateg);
app.post('/add', addPlayer);
app.post('/dod', addKateg);
app.post('/edit/:id', editPlayer);


// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});


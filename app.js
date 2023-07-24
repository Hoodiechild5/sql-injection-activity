const sqlite3 = require('sqlite3').verbose();
const http = require('http'),
	path = require('path'),
	express = require('express'),
	bodyParser = require('body-parser');

const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())



const db = new sqlite3.Database(':memory:');
db.serialize(function () {
	db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
	db.run("INSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')");
});


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


app.use(express.urlencoded({ extended: false }));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
      // Validate username/password
    const query = `SELECT * FROM user WHERE username = '${username}' AND password = '${password}'`;
  res.send('Logged in successfully!');




db.get(query, function (err, row) {

    if (err) {
        console.log('ERROR', err);
        res.redirect("/index.html#error");
    } else if (!row) {
        res.redirect("/index.html#unauthorized");
    } else {
        res.send('Hello <b>' + row.title + '!</b><br /> This file contains all your secret data: <br /><br /> SECRETS <br /><br /> MORE SECRETS <br /><br /> <a href="/index.html">Go back to login</a>');
    }       
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000'); 
  });
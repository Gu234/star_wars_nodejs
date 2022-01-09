const app = require('express')();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const validator = require('validator');
const crypto = require('crypto');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/register', (req, res) => {
    MongoClient.connect('mongodb://root:example@mongo:27017/', async (err, client) => {
        if (err) throw err;

        const email = req.body.email;
        const password = req.body.password;

        if (!validator.isEmail(email)) {
            res.json({
                message: 'invalid email',
                status_code: 1
            })
            return
        }
        if (validator.isEmpty(password)) {
            res.json({
                message: 'password cannot be empty',
                status_code: 2
            })
            return
        }
        const new_user = { 'email': email, 'password': password }
        const db = client.db('star_wars_db')

        const email_query = await db.collection('users').findOne({ 'email': email })
        if (email_query) {
            res.json({
                message: 'email already exists',
                status_code: 3
            })
            return
        }

        db.collection('users').insert(new_user, (err, result) => {
            if (err) throw err;
            client.close();
            res.json({
                message: 'user registered',
                status_code: 0
            })
        })

    })
});

app.post('/login', (req, res) => {
    MongoClient.connect('mongodb://root:example@mongo:27017/', async (err, client) => {
        const hour_in_miliseconds = 3600000
        const email = req.body.email;
        const password = req.body.password;
        const db = client.db('star_wars_db')
        const query = await db.collection('users').findOne({ 'email': email, 'password': password })
        if (query) {
            const session_token = crypto.randomBytes(256).toString('hex')
            db.collection('sessions').insert({
                'user': email,
                'token': session_token,
                'timestamp': new Date.now(),
                'expiry_date': new Date.now() + hour_in_miliseconds
            })
            res.json({ 'token': session_token })
        } else {
            res.status(401)
            res.json({ message: 'wrong email/password' })
        }
    })
});

app.get('/', (req, res) =>
    res.json({ message: 'Hello!' })
);

app.get('/films', (req, res) =>
    res.json({ message: 'this should return films' })
);
app.get('/species', (req, res) =>
    res.json({ message: 'this should return species' })
);
app.get('/vehicles', (req, res) =>
    res.json({ message: 'this should return vehicles' })
);
app.get('/starships', (req, res) =>
    res.json({ message: 'this should return starships' })
);
app.get('/planets', (req, res) =>
    res.json({ message: 'this should return planets' })
);


const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`app listening on http://localhost:${port}`));

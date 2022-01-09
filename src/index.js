const app = require('express')();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const validator = require('validator');

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

app.get('/', (req, res) =>
    res.json({ message: 'Docker is easy 🐳' })
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

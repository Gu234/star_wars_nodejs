const app = require('express')();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/register', (req, res) => {
    MongoClient.connect('mongodb://root:example@mongo:27017/', (err, client) => {
        if (err) throw err;

        const email = req.body.email;
        const password = req.body.password;
        const new_user = {'email': email, 'password': password}
        const db = client.db('star_wars_db')
        db.collection('users').insert(new_user, (err, result) => {
            if (err) throw err;
            client.close();
            res.json({message: 'user registered'})
        })

        })
    console.log(req.body);
    res.json({ message: `email: ${req.body.email} password: ${req.body.password}`})
    }
);

//validate inputs
//check database 
//if user exists => error 
//else => create user

app.get('/', (req, res ) =>
    res.json({ message: 'Docker is easy 🐳' }) 
);

app.get('/films', (req, res ) => 
    res.json({ message: 'this should return films' }) 
);
app.get('/species', (req, res ) => 
    res.json({ message: 'this should return species' }) 
);
app.get('/vehicles', (req, res ) => 
    res.json({ message: 'this should return vehicles' }) 
);
app.get('/starships', (req, res ) => 
    res.json({ message: 'this should return starships' }) 
);
app.get('/planets', (req, res ) => 
    res.json({ message: 'this should return planets' }) 
);


const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`app listening on http://localhost:${port}`) );

const app = require('express')();

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

const express = require ('express');
const bodyParser = require ('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(express.json())
// app.use(express.urlencoded({extended: false}))

require('./controllers/authController')(app);

app.listen(3000);
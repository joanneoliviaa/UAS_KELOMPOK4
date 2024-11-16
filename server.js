const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const pool = require('./model/db'); 
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const mediaRoutes = require('./routes/mediaRoutes');
const mediaController = require('./controllers/mediaController'); 
const PORT = process.env.PORT || 3500;

//Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

// routes
app.use('/', require('./routes/routes'));

app.get('/', (req, res) => {
    res.render('index', { activePage: '/' }); 
});

app.get('/trends', (req, res) => {
    res.render('trends/trends', { activePage: '/trends' });  
});

app.get('/signup', (req, res) => {
    res.render('signup');  // Renders the signup.ejs page
});


app.get('/trends/:season', mediaController.renderTrendsPage);

app.use('/auth', authRoutes);
app.use('/trends', mediaRoutes);
app.use(mediaRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

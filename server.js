const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const pool = require('./model/db');  // Import the pool from db.js
const bodyParser = require('body-parser');
const mediaRoutes = require('./routes/mediaRoutes');
const mediaController = require('./controllers/mediaController'); 
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// routes
app.use('/', require('./routes/routes'));

app.get('/', (req, res) => {
    res.render('index', { activePage: '/' }); 
});

app.get('/trends', (req, res) => {
    res.render('trends/trends', { activePage: '/trends' });  
});

app.get('/trends/:season', mediaController.renderTrendsPage);

app.use('/trends', mediaRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

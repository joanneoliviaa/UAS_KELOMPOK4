const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const pool = require('./model/db'); 
const authController = require('./controllers/authController');
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const mediaRoutes = require('./routes/mediaRoutes');
const mediaController = require('./controllers/mediaController'); 
const newsRoutes = require('./routes/newsRoutes');
const productRoutes = require('./routes/routes');
const cartRoutes = require('./routes/routes');
const PORT = process.env.PORT || 3500;

//Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session({
    secret: 'aa4ec9c617bc4a909b5efe43138abc0200727fdcc086cfefda50534b3b659d9f', 
    resave: false,
    saveUninitialized: true,
  }));

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

// Middleware untuk menyediakan session ke dalam view
app.use((req, res, next) => {
    res.locals.session = req.session || {}; 
    next();
  });

// routes                      
app.use('/auth', authRoutes);
app.post('/signup', authController.signup);

app.use('/', require('./routes/routes'));

app.get('/', (req, res) => {
    res.render('index', { activePage: '/' }); 
});

app.get('/trends', (req, res) => {
  res.render('trends');  
});

app.get('/indexshop', (req, res) => {
  res.render('shop/indexshop', { activePage: '/indexshop' });  
});

app.get('/trends/:season', mediaController.renderTrendsPage);

app.use('/trends', mediaRoutes); 

app.use('/news', newsRoutes);

app.get('/profile', (req, res) => {
  // Check if the user is logged in by checking the session
  if (req.session && req.session.userId) {
      // If logged in, render the profile page (e.g., profile.ejs or a static HTML page)
      res.render('profile');  // Assuming you're using EJS or a similar template engine
  } else {
      // If not logged in, redirect to the sign-in page
      res.redirect('/auth/signin');
  }
});

app.use('/', productRoutes);

app.use('/', cartRoutes);

app.use('/auth', newsRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

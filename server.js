const path = require('path');
const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({
    helpers
});
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// const sess = {
//     // secret: process.env.DB_PASSWORD,
//     secret: "Super secret secret",

//     cookie: {},
//     resave: false,
//     saveUninitialized: true
// };

const sess = {
	secret: "Super secret secret",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

const app = express();
const PORT = process.env.PORT || 3001;

//configuring the handlebar as the defualt engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
//using sesion here
app.use(session(sess));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//calling routes (controllers)
app.use(routes)

sequelize.sync();

app.listen(PORT, () => {
    console.log(`App listening!`);
});
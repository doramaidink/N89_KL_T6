const homeRoute = require('./homeRouter');
const loginRoute = require('./loginRouter');
const homeuserRoute = require('./homeuserRouter');
const doiTacRoute = require('./doiTacRouter');



function route(app){

 app.use('/login',loginRoute);
 app.use('/homeuser', homeuserRoute);
  app.use('/doitac', doiTacRoute);

 app.use('/',homeRoute);
}
module.exports = route;
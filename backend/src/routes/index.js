const homeRoute = require('./homeRouter');
const loginRoute = require('./loginRouter');
const homeuserRoute = require('./homeuserRouter');



function route(app){

 app.use('/login',loginRoute);
 app.use('/homeuser', homeuserRoute);

 app.use('/',homeRoute);
}
module.exports = route;
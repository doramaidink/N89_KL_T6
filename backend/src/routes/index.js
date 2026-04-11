const homeRoute = require('./homeRouter');
const loginRoute = require('./loginRouter');

function route(app){

 app.use('/login',loginRoute);
 app.use('/',homeRoute);
}
module.exports = route;
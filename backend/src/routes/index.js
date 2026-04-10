const homeRoute = require('./homeRouter');
const loginRoute = require('./loginRouter');
function route(app){
 app.use('/',homeRoute);
 app.use('/login',loginRoute);
}
module.exports = route;
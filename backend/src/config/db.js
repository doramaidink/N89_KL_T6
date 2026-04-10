const mongoose = require('mongoose');

async function connectDB()    
{
    try{
        await mongoose.connect( process.env.MONGODB_CONNECTIONSTRING);
        console.log("Lien ket CSDL thanh cong");
    }catch(error){
        console.log("loi:");
        console.log(error);
        process.exit(1);
    }
}
module.exports = {connectDB};
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const port = 5000;
const app = express();
const db = require('./config/db');
const route = require('./routes');
const { env } = require('process');


dotenv.config();

///HTTP logger
app.use(express.json({ limit: "50mb" }));

app.use(express.urlencoded({
  extended:true
}));

app.use(cors({origin: "http://localhost:5173"}));
app.use('/img', express.static(path.join(__dirname, '../public/img')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));


//route init => khởi tạo đường tuyến
route(app);
db.connectDB().then(()=>{
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
});


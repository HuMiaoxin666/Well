//连接数据库
const mongoose= require('mongoose');
mongoose.connect('mongodb://localhost:27017/E-commerce',{useNewUrlParser: true}).then(
    (res) =>{
        console.log("Connected to Daabase Successfully !")
    }
    ).catch(
        ()=>{
            console.log("Conntection to database failed !")
        }
    );

var db = mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     console.log("connect success!")
// });

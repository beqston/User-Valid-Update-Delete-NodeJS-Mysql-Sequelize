const express = require('express');
const userRouter = require('./routes/user');
const sequelize = require('./utils/database');
const app =  express();

app.use(express.json());
app.use(express.static('public'));

app.use(express.urlencoded({extended:false}));
app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(userRouter);
app.use((req, res)=>{
    res.send('page not found bro')
});

sequelize.sync({alter:true}).then((result)=>{
    app.listen(4000, ()=>{
    console.log('server is runing on port 4000...')
});
}).catch(err=>console.log(err))

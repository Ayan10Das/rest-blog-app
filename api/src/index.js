const express=require('express')
const app=express();
const cors=require('cors')
const dotenv=require('dotenv').config()
const dbConnection=require('./config/dbConnection')
const PORT=process.env.PORT || 5000
const cookie_parser=require('cookie-parser')
const path=require('path')

const authRoute=require('./routes/auth')
const userRoute=require('./routes/user')
const postRoute=require('./routes/post');
const { multerErrorHandler } = require('./middleware/multerMiddleware');

dbConnection();

app.use('/uploads',express.static(path.join(__dirname, 'uploads')))
// console.log(__dirname+"/uploads")
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}))
app.use(cookie_parser())
app.use(express.json())

app.use('/',authRoute)
app.use('/',userRoute)
app.use('/',postRoute)

app.use(multerErrorHandler)


app.listen(PORT,()=>{
    console.log("Server is running at port ",PORT)
})
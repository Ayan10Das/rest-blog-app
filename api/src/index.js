const express=require('express')
const app=express();
const cors=require('cors')
const dotenv=require('dotenv').config()
const dbConnection=require('./config/dbConnection')
const PORT=process.env.PORT || 5000
const cookie_parser=require('cookie-parser')

const authRoute=require('./routes/auth')
const userRoute=require('./routes/user')

dbConnection();
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}))
app.use(cookie_parser())
app.use(express.json())

app.use('/auth',authRoute)
app.use('/user',userRoute)


app.listen(PORT,()=>{
    console.log("Server is running at port ",PORT)
})
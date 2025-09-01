const express=require('express')
const app=express();
const cors=require('cors')
const dotenv=require('dotenv').config()
const dbConnection=require('./config/dbConnection')
const PORT=process.env.PORT || 5000


dbConnection();
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}))
app.use(express.json())

app.get('/',(req,res)=>{
    res.send("Yeah server is running...")
})

app.listen(PORT,()=>{
    console.log("Server is running at port ",PORT)
})
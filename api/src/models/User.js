const mongoose=require('mongoose')

const userSchema= mongoose.Schema({
    username:{
        type:String,
        trim: true,
        required: true,
        minlength:[3,"Username is too short"],
        unique:true
    },
    email:{
        type:String,
        unique:true,
        lowercase:true,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength:[8,"Password is too short"]
    }
},
   { timestamps:true }
)

module.exports=mongoose.model('User',userSchema)
const mongoose=require('mongoose');
const passwordHash=require('password-hash');

let UserSchema=new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{
        type:String,
        required:false
    },
    surname:{
        type:String
    },
    telephone:{
        type:Number,
       
    },
    email:{
        type:String,
        required:false
    },
    password:{
        type:String,
        required:false
    },
 
    confirmed_password:{
        type:String,
        required:false
    },
    country:{
        type:String
    },
    // image:{
    //     type:String
    // },
    token:{
        type:String,
        unique:true
    },
    status:{
        type:Boolean,
        default:false
    },
    created_at:{
        type:Date
      
    },
    modified_at:{
        type:Date,
        default:Date.now()
    }

})
UserSchema.methods.comparePassword=function(userpassword){
    return passwordHash.verify(userpassword,this.password);
}
module.exports=mongoose.model("users",UserSchema)
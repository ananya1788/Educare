const mongoose=require('mongoose');
const passwordHash=require('password-hash');

const AdminSchema=new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    fullname:{
        type:String
    },
    email:{
        type:String,
        required:false,
        unique:true
    },
    mobile:{
        type:Number,
        required:false
    },
    address:{
        type:String,
        required:false
    },
    image:{
        type:String,
        required:false
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:false,
        unique:true
    },
    status: {
        type: Boolean,
        default: true
    }

})

AdminSchema.methods.comparePassword=function (adminpassword){
    return passwordHash.verify(adminpassword,this.password)
}
module.exports=mongoose.model('admins',AdminSchema)

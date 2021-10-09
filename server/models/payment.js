import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    user_id:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    paymentID:{
        type:String,
        required:true
    },
    address:{
        type:Object,
        required:true
    },
    
    cart:{
        type: Array,
        required:true
    },
    status:{
        type: Boolean,
        default:false
    },

},{
    timestamps:true
})

const Payment = mongoose.model('Payment', paymentSchema)

export default Payment
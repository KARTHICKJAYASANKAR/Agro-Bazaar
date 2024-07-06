const mongoose = require('mongoose');

const sellerSchema = mongoose.Schema({
    name:{type:String , required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    phoneNumber:{type:String,required:true},
    address:{type:String,required:true},
    farmerid:{type:String , required:true},
    city:{type:String,required:true},
    upid:{type:String,required:true},
    // farmercertificate : {type:String , rtequired:true},
    profit:{type:Number , default:0},
    profilePicture:{type:String,required:true},
    products: [{type: Object }],
    followers:[{ type: mongoose.Schema.Types.ObjectId , ref: 'Buyers' }],
    ratings: {type:Number},
    no_of_ratings :[{ type: mongoose.Schema.Types.ObjectId , ref: 'Buyers' }],
    review_for_seller: [{type:Object}],
    suggestions:[{type:Object}]
})


const Seller = mongoose.model('Seller' , sellerSchema );
module.exports = Seller;



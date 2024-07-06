const mongoose = require('mongoose');

const billSchema = mongoose.Schema({
      buyerobj:{type: Object},
      sellerobj:{type:Object},
      cartObject: {type:Object},
      date:{type:Date,default:Date.now()},  //date of the day when the bill is generated
      mode:{type:String},   //cash/card/net banking
      totalamount:{type:Number },    //total amount in INR including tax and shipping charges
})

const Bill = mongoose.model('Bill' , billSchema);
module.exports= Bill;



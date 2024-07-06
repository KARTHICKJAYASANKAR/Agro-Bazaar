const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    picture:{type: String  , required:true},
    sellerid : {type:String , required:true},
    sellerobj : {type:Object},
    profit:{type:Number , required:false},
    iquantity:{type:Number , required:true},
    fquantity:{type:Number , required:false},
    reviews:[{type:Object}],
    ratings:[{type:Number,required:false}]
})

const Product = mongoose.model("Product" , productSchema);
module.exports = Product;



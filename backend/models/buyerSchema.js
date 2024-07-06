const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const buyerSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    mysellers: [{ type: Object }],
    cart: [{type:Object}]
});

const Buyer = mongoose.model("Buyer", buyerSchema);
module.exports = Buyer;

//-------------------------------------------------- middleware to verify the token--------------------------
const Buyer = require('./models/buyerSchema');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
 async function middleware(req,res,next){

        const secretKey ='akdaknafjeofhefijeofjnweofj9r840823348n2r2';
        const { authorization } = req.headers;
        // Authentication = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWM3NGU1NzlkNTJmYmU4ZTUxZWVhOWYiLCJpYXQiOjE3MDgwMDgxNDQsImV4cCI6MTcwODAxMTc0NH0.knTUlWxlQIhJZgiqHn8Nr2H-HzwKkWZghgB8wQ-2v_g"
        if(!authorization){
            return res.status(401).json( { message: 'No Token Provided' }); 
        }
        
        const token = authorization.replace("Bearer " , "");
        jwt.verify(token , secretKey , async (err,payload)=>{
            if(err){
                return res.status(401).json({message : err.message});
            }
            const {_id} = payload;
            const buyerData = await Buyer.findById(_id);
            if (!buyerData) {
                return res.sendStatus(404);
            }
            req.user=buyerData ;
            next();
        })
}


module.exports = middleware;
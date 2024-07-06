const express = require('express');
const router = express.Router();
const Buyer = require('./models/buyerSchema');
const Seller = require('./models/sellerSchema');
const Product = require('./models/productSchema');
const Bill = require('./models/billSchema');
//const upload = require('./upload')
const path = require('path');
const bcrypt = require('bcrypt');
const middleware = require('./middleware');
var nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const secretKey ='akdaknafjeofhefijeofjnweofj9r840823348n2r2';
const {v4:uuidv4}= require("uuid");
const stripe = require("stripe")("sk_test_51ODJlUSBncmV7btfIw3NFzz53F9FJe5nlHFNFznizkKNwruyBzArC8YGZP0XsbrqBTYkrHbYFQqvfb1VyvY4WBGT00adpHDzOb")

// const multer = require('multer');


// var storage = multer.diskStorage({
//     destination: function(req,file,cb){
//         cb(null, './uploads')                   //uploads nu oru foldercreate aagi athula images ah store pannikkum
//     },
//     filename: function(req,file,cb){
//         cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)  //intha format la DB la store aagum // xxxxxxxxxxxx_bus.png //
//     },
// })


// var upload = multer({
//     storage:storage     // here upload is middleware where the uploaded images are processed with above functionalities
// }).single('profilePicture')




router.get("/" , (req,res)=>{
    res.send("Welcome to the API");
})


// Register buyer..

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ "message": "Enter all details" });
        }
        const encryptedPassword = await bcrypt.hash(password, 12); // Hash the password
        const newbuyer = new Buyer({
            name: name,
            email: email,
            password: encryptedPassword
        });
        const buyer = await newbuyer.save();
        if (buyer) {
            console.log(buyer);
            res.send(buyer._id);
        } else {
            res.send("something went wrong");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

// Register seller...
router.post('/registerSeller', async(req,res)=>{
    try{
        console.log("fetch function fetched..");
        const {username , email , password , phoneNumber, farmerid , city , address , upid , profilePicture} = req.body;

        const seller = new Seller({
            name:username,
            email:email,
            password:password,
            profilePicture : profilePicture,
            farmerid:farmerid,
            phoneNumber:phoneNumber,
            upid:upid,
            city:city,
            address:address
        })
        const stored = await seller.save();
        if(stored)
        res.status(200).json({"message" : "Seller details successfully stored in DB"});
    else
    res.status(400).json({"message" : "Seller details not stored"})

    }
   
    catch(err){
        console.log(err);
    }

})





//login byer...
router.post("/loginbuyer" , async(req,res)=>{
    console.log("login API fetched..");
    const { email,password } = req.body;
    // console.log(email  + " " + password );
    if(!email || !password)
    res.status(400).send("Enter all required fields");
    const buyer = await Buyer.findOne({email:email});
    // console.log(buyer);
    if(!buyer){
        return res.status(402).send(false);
    }
    const doMatch = await bcrypt.compare(password , buyer.password);
    // console.log(doMatch);
    if(doMatch){
        const token =  jwt.sign({_id : buyer._id} , secretKey , {expiresIn:'1d'});
        console.log(token);
        res.send([buyer._id , token] );
    }
    else{
        res.status(402).send(false);
    }
})



//Login seller...
router.post("/loginseller" , async(req,res)=>{
    console.log("login API fetched..");
    const { email,password } = req.body;
    if(!email || !password)
    res.status(400).send("Enter all required fields");
    const seller = await Seller.findOne({email:email});
    //console.log(seller);
    if(!seller){
        return res.status(400).send("Invalid Email or Password");
    }
    if(seller.password != password){
        return res.status(400).send(false);
    }
    // console.log(seller._id);
     res.status(200).json(seller);
})


//------------------------------------------------------------------ Create product by sellers.........................
router.post('/createproduct/:id', async(req,res)=>{
   
    try{
        console.log("create product API fetched");
        const { name , description , price , category , imgurl , id , quantity , sellerobj} = req.body;

        const product = new Product({
            name,
            description,
            price,
            category,
            picture:imgurl,
            sellerid:id,
            sellerobj:sellerobj,
            iquantity:quantity,
            fquantity:quantity,
            profit:0
        })
        const storedProduct = await product.save();
           console.log(storedProduct);

        const sellertoupdate = await Seller.findOneAndUpdate(
            { email: id },
            { $push: { products: storedProduct } }, 
            { new: true } 
          );
          console.log(sellertoupdate);
          if (sellertoupdate) {
            console.log('Seller updated success');
          }


        if(storedProduct)
        res.status(200).json(storedProduct);
        else
        res.status(400).json({"message" : "Something went wrong!"})
    }
   
    catch(err){
        console.log(err);
    }

})   






//-------------------------------------------------------------find seller by emai and send -------------------//

router.get('/sellerhome/:id', async(req,res)=>{
    try
    {
            const  id  = req.params.id;
            const sellerhome = await Seller.find({email:id});
            console.log(sellerhome);
            console.log(sellerhome[0].products);
            if(sellerhome)
            {
                console.log('seller found');
                res.send(sellerhome);
            }
    }
    catch(err)
    {
            console.log("Error occured in updating products in seller db");
    }

    
})





//--------------------------------------------------- Fetch all products of a farmer -------------------------------------------//

router.get('/fetchallproducts/:id', async (req, res) => {
    const sellerId = req.params.id;

    try {
        // Fetch all products with the specified sellerid
        const products = await Product.find({ sellerid: sellerId });

        // Check if any products were found
        if (products.length > 0) {
            console.log(products);
            console.log("products sent")
            res.send(products);
        } else {
            res.status(404).json({ message: 'No products found for the specified sellerid' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//--------------------------------------------------------------- fetch all sellers for buyer home poge ----------------------------------------------------------

router.get('/fetchallsellers' , middleware ,async(req,res)=>{
    try
    {
        const sellers = await Seller.find();
        res.send(sellers);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send("Internal server error");
    }
})


//---------------------------------------------------------------- fetch product details -------------------------------------------------------------------

router.get(`/fetchproductdetails/:id` , middleware , async(req,res)=>{
    console.log("fetching product details..")
    const id = req.params.id;
    try
    {
        const product = await Product.find({_id:id});
        console.log(product);
        res.send(product);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send("Server error");
    }
})

//---------------------------------------------------------- get seller profile by buyer ------------------------------//

router.get('/fetchsellerprofile/:id',middleware,async(req,res)=>{
    try
    {
        const id = req.params.id;
        const seller = await Seller.find({_id:id});
        res.send(seller);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send("Internal server error");
    }
})


router.get('/fetchsellerforcart/:id', async(req,res)=>{
    try{
        const email = req.params.id;
        const seller = await Seller.find({email : email});
        res.send(seller)
    }
    catch(e)
    {
        console.log(e);
    }
      
})


//---------------------------------------------------------------------- follow ------------------

router.post(`/follow/:id` , async(req,res)=>{
    console.log("followed");
    try
    {
        const id = req.params.id;
        const { BUYERID , seller } = req.body;
        const updatedSeller = await Seller.findOneAndUpdate(
            {_id:id},
            { $push: { followers: BUYERID } },
            { new: true } 
          );

         const updatedBuyer = await Buyer.findOneAndUpdate({_id:BUYERID}, {$push:{mysellers : seller[0]}} , {new:true}); 

           if(updatedSeller && updatedBuyer)
           {
            res.send(true);
           } 
    }
    catch(e)
    {
        console.log(e)
    }
})

//---------------------------------------------------------------------- Unfollow ----------------------------------

router.delete(`/unfollow/:id` , async(req,res)=>{
    console.log("unfollowed");
    try
    {
        const id = req.params.id;
        const { BUYERID , seller } = req.body;
        const updatedSeller = await Seller.findOneAndUpdate(
            { _id:id },
            { $pull: { followers: BUYERID } },
            { new: true }
          );
          const updatedBuyer = await Buyer.findOneAndUpdate({_id:BUYERID},  { $pull: { mysellers: { _id: id } } },  {new:true}); 

           if(updatedSeller && updatedBuyer)
           {
            res.send(true);
           } 
    }
    catch(e)
    {
          console.log(e);
    }
})


//-------------------------------------------------------------------get Mysellers ----------------------

router.get('/getmysellers/:id',middleware, async (req, res) => {
    try {
        console.log("mysellers API fetched..");
        const id = req.params.id;
        const buyer = await Buyer.findById(id);
        if (buyer) {
            res.send(buyer.mysellers);
        } else {
            res.status(404).json({ "error": "Buyer not found" });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ "error": "Internal Server Error" });
    }
});


//------------------------------------------------------------------ Cart ------------------------------------------

router.post("/addtocart", async (req, res) => {
    try {
        const { BUYERID , cartObject } = req.body;
        console.log(BUYERID)
        console.log(cartObject)
        const BUYER = await Buyer.findById(BUYERID);
        if (BUYER) {
            let productExists = false;

            // Check if the product from the same seller already exists in the cart
            for (let i = 0; i < BUYER.cart.length; i++) {
                if (BUYER.cart[i].sellerId.email === cartObject.sellerId.email) {
                    // If the product already exists, update the existing entry
                    productExists = true;
                    res.status(405);
                    
                }
            }

            // If the product doesn't exist, add it as a new entry to the cart
            if (!productExists) {
                BUYER.cart.push( cartObject );
                console.log("added newly")
            }
             
            // Save the updated buyer document
            await BUYER.save();

            res.send("Product added to cart");
        } else {
            res.status(404).send("Buyer not found");
        }
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
});
router.put("/addtocart", async (req, res) => {
    try {
        const { BUYERID , cartObject } = req.body;
        console.log(BUYERID)
        console.log(cartObject)
        const BUYER = await Buyer.findById(BUYERID);
        if (BUYER) {
            let productExists = false;

            // Check if the product from the same seller already exists in the cart
            for (let i = 0; i < BUYER.cart.length; i++) {
                if (BUYER.cart[i].sellerId.email === cartObject.sellerId.email) {
                    // Construct the update operation
                    const updateOperation = {};
                    updateOperation[`cart.${i}.productsToCart`] = cartObject.productsToCart[0];
            
                    //Perform the update operation and retrieve the updated document
                    const updatedBuyer = await Buyer.findByIdAndUpdate(
                        BUYERID,
                        { $push: updateOperation },
                        { new: true }
                    );
                    break;
                }
            }            

            // If the product doesn't exist, add it as a new entry to the cart
            

            res.send("Product added to cart");
        } else {
            res.status(404).send("Buyer not found");
        }
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
});

//-------------------------------------------------------------- get buyers cart ----------------------------
router.get("/getmycart/:id" , middleware , async(req,res)=>{
    console.log("get cart called")
    try{
        const BUYERID = req.params.id;
        console.log(BUYERID);
        const BUYER = await Buyer.findById({_id:BUYERID});
        console.log(BUYER)
        if(BUYER){
            console.log(BUYER.cart);
            res.send(BUYER.cart);
        }
        else{
            res.status(404).send("No such user is registered.")
        }
    }
    catch(e){
        console.log(e);
    }
})


//----------------------------------------------------------------------------------- delete item from cart--------------

router.put(`/removefromcart/:id`, async (req, res) => {
    console.log("remove cart API");
    try {
        const BUYERiD = req.params.id;
        console.log(BUYERiD);
        const { product } = req.body; // Assuming productId is the identifier of the product to be removed
        const BUYER = await Buyer.findById(BUYERiD);

        console.log(BUYER.name);

        if (BUYER) 
        {
            // console.log(BUYER.cart);
            for(let i=0 ; i<BUYER.cart.length ; i++)
            {
                if(BUYER.cart[i].sellerId.email === product.sellerobj.email)
                {
                    const updatedArr = await BUYER.cart[i].productsToCart.filter(prod => prod._id !== product._id);
                    console.log(updatedArr);
                   
                    const updatedBUYER = await Buyer.findByIdAndUpdate(
                        BUYERiD,
                        { $set: { [`cart.${i}.productsToCart`]: updatedArr } },
                        { new: true }
                    );                   
                     if(updatedBUYER)
                    res.send(updatedBUYER.cart);
                   
                    else
                    return res.status(500).json({ err: "Error in removing product" })
                }
            }    
        } 
        else 
        {
            res.status(404).json({ message: 'Buyer not found' });
        }
    } catch (e) { 
        console.log(e);
        res.status(500).json({ message: 'Internal server error' });
    }
});



///-------------------------------------------------------------------  mail function ---------------------------------------------

  router.post("/confirmorder/:id" , async(req,res)=>{
    const { name , email , phn , addr ,mode} = req.body;
    console.log("mode : "+ mode);
    const {id} = req.params;
    let products = "";
    let formattedDate="";
    const bill = await Bill.findByIdAndUpdate(id , {$set:{mode:mode}} , {new:true});
    // bill.mode = mode;
    // await bill.save();
    const seller = await Seller.findById(bill.sellerobj._id);
    if(bill ){
        
        for(let i=0 ; i<bill.cartObject.productsToCart.length ; i++)
        {
            products = products + bill.cartObject.productsToCart[i].name + " ,";  //---------------------------- "products : eggs, ghee....."
            const product = await Product.findById(bill.cartObject.productsToCart[i]._id); 
            product.fquantity = product.fquantity - bill.cartObject.productsToCart[i].quantity;
            product.profit = (product.iquantity - product.fquantity) * product.price;
            await product.save(); //----------------------------------------------------------------fquantity updated in product model
            for(let j=0 ; j<seller.products.length ; j++)
            {
                if(seller.products[j]._id == bill.cartObject.productsToCart[i]._id)
                {
                    // console.log(seller.products[j]._id)
                    
                    seller.products[j] = product;
                    console.log(seller.products[j].fquantity);
                     await seller.save();
                     break;   
                }
            }
            // console.log(product);
        }

        const dateString = bill.date;
        const date = new Date(dateString);
        // Get the day, month, and year components
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-based, so add 1
        const year = date.getFullYear();
         // Format the date in dd-mm-yyyy format
         formattedDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;

        // console.log(seller)
        // console.log(bill)
    }
    

   
    var sender = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'agrobazaarbill@gmail.com',
            pass:'fiiewxgrbovavmrm'
        }
    });

    // var composemail={
    //     from:'agrobazaarbill@gmail.com',
    //     to: sellermail ,
    //     subject:"Order Confirmation",
    //     text:`Dear Seller, Your order has been confirmed by the Buyer.\n\nPlease proceed with shipping the products.`
    // }
const emails = [
  {
    from:'agrobazaarbill@gmail.com',
    to: seller.email ,
    subject:"Order Confirmation",
    html: `
    <div style="color: #2a2829; background-color: #ddeedf; padding: 10px;">
    <h2 style="color: #2a2829;">Order Placed!!</h2>
    <p>Dear Seller,</p>
    <p>A order has been Placed by a buyer .</p>
    <p>Please proceed with shipping the products.</p>
    <img src="https://res.cloudinary.com/dgtonwmdv/image/upload/v1708713122/images/stable-diffusion-turbo_4_ib2n0a.jpg" style="width: 100px; height:100px;"/>
    <h3>Order Details:</h3>
    <ul>
        <li><strong>Buyer:</strong> ${name}</li>
        <li><strong>Buyer Phone:</strong> ${phn}</li>
        <li><strong>Seller:</strong> ${bill.sellerobj.name}</li>
        <li><strong>Seller Phone:</strong> ${bill.sellerobj.phoneNumber}</li>
        <li><strong>Products :</strong> ${products}</li>
        <li><strong>Total Price:</strong> ₹${bill.totalamount}</li>
        <li><strong>Mode of Payment:</strong> ${bill.mode}</li>
        <li><strong>Date:</strong> ${formattedDate}</li>
        <li><strong>Address:</strong> ${addr}</li>
    </ul>
</div>
    `
  },
  {
    from: 'agrobazaarbill@gmail.com',
    to: email,
    subject: 'Order Placed',
    html: `
    <div style="color: #2a2829; background-color: #ddeedf; padding: 10px;">
    <h2 style="color: #2a2829;">Order Confirmation</h2>
    <p>Dear Buyer,</p>
    <p>Your order has been confirmed .</p>
    <p>Thanks for the order !.</p>
    <img src="https://res.cloudinary.com/dgtonwmdv/image/upload/v1708713122/images/stable-diffusion-turbo_4_ib2n0a.jpg" style="width: 100px; height:100px;"/>
    <h3>Order Details:</h3>
    <ul>
        <li><strong>Buyer:</strong> ${name}</li>
        <li><strong>Buyer Phone:</strong> ${phn}</li>
        <li><strong>Seller:</strong> ${bill.sellerobj.name}</li>
        <li><strong>Seller Phone:</strong> ${bill.sellerobj.phoneNumber}</li>
        <li><strong>Products :</strong> ${products}</li>
        <li><strong>Total Price:</strong> ${bill.totalamount}</li>
        <li><strong>Mode of Payment:</strong> ${bill.mode}</li>
        <li><strong>Date:</strong> ${formattedDate}</li>
        <li><strong>Address:</strong> ${addr}</li>
    </ul>
</div>
    `
  },
  
];
//     sender.sendMail(composemail,function(err,info){
//         if(err){
//             console.log(err);
//             res.status(402).send("failed")
//         }
//         else{
//             console.log(info.response)
//             res.status(200).send("success")
//         }
//     })
//   })

  emails.forEach(email => {
  sender.sendMail(email, (error, info) => {
    if (error) {
        res.status(401).send("failed");
      console.log('Error occurred:', error.message);
      return;
    }
    console.log('Email sent:', info.response);
    res.status(200).send("success");
  });
});

});
//------------------------------------------------------------------------------------------------------------------

  
// // Create a transporter
// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: 'your_email@gmail.com',
//     pass: 'your_password'
//   }
// });

// // Array of email objects
// const emails = [
//   {
//     to: 'recipient1@example.com',
//     subject: 'Subject 1',
//     text: 'This is the email body for recipient 1'
//   },
//   {
//     to: 'recipient2@example.com',
//     subject: 'Subject 2',
//     text: 'This is the email body for recipient 2'
//   },
//   // Add more email objects as needed
// ];

// // Loop through the array and send each email
// emails.forEach(email => {
//   transporter.sendMail(email, (error, info) => {
//     if (error) {
//       console.log('Error occurred:', error.message);
//       return;
//     }
//     console.log('Email sent:', info.response);
//   });
// });
 
// ----------------------------------------------------------------- BUY --> Bill creation-----------------------


router.get('/getbuyer/:id' , async(req,res)=>{
    try{                                                 // get buyer by id
        const {id} = req.params;
        const buyer = await Buyer.findById(id);
        if(buyer)
        {
            //console.log(buyer);
            res.send(buyer);
        }
        else{
            res.status(402).send("No byer found");
        }
    }
    catch(e)
    {
        console.log(e)
    }
})


router.post("/billcreation" , async(req,res)=>{
    try{                                                               //-------------- created bill
        const { buyerobj , sellerobj , cartObject} = req.body;
        //totalamount , date
        // create bill and send id
        let totalamount=0;
        for(let i=0 ; i<cartObject.productsToCart.length ;i++)
        {
            totalamount = totalamount + (cartObject.productsToCart[i].quantity * cartObject.productsToCart[i].price)        
        }
        const newbill = new Bill({
            buyerobj:buyerobj,
            sellerobj:sellerobj,
            cartObject:cartObject,
            totalamount:totalamount,
        });
        const bill = await newbill.save();
        if(bill)
        {
            // console.log(bill);
            res.send(bill._id);
        }
        else {
            res.send("something went wrong");
        }

    }
    catch(e)
    {
        console.log(e);
    }
})



//---------------------------------------------------------------------------------------------------------


router.get("/getbill/:id" , middleware , async(req,res)=>{           // ------------- get the bill by id
    try{
        const {id} = req.params;
        const bill = await Bill.findById(id);
        if(bill)
        {
            res.send(bill);
        }
        else{
            res.status(404).send("not found");
        }
    }
    catch(e)
    {
        console.log(e);
    }
})


router.delete("/deletebill/:id", async (req, res) => {                //------ find and delete bill
    try {
        const { id } = req.params;
        const billDeletion = await Bill.findByIdAndDelete(id);
        if (billDeletion) {
            res.status(200).send("Deleted");
        } else {
            res.status(404).send("Not found");
        }
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
});


// -------------------------------------------------------  get bill by seller ------------------------------------
router.get("/getbillforseller/:id" , async(req,res)=>{
    const {id} = req.params;
    console.log('bill aPI');
    try{
        const bill = await Bill.find({"sellerobj.email": id});
        if(bill)
        {
            console.log(bill);
            res.json(bill);
        }
    }
    catch(e){
        console.log(e);
    }
})




// ------------------------------------------------------------------ save review for products -----------------
router.post("/saveproductsreview/:id", async (req, res) => {
    try {
        let productId = req.params.id;
        const { buyerobj, rating, comment } = req.body;
        const product = await Product.findById(productId);
        const reviewObj = {
            buyerobj: buyerobj,
            rating: rating,
            comment: comment,
            Date: Date.now() 
        };
     
        product.reviews.push(reviewObj);
        await product.save();
        res.status(200).send("Review saved successfully");
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});


//-------------------------------------------------------------------------  Add Review Comment //---------------------
router.post("/addreview/:id" , async(req,res)=>{
    try{
        const productid = req.params.id;
        const {reviewObj , data} = req.body;
        console.log(productid);
        const product = await Product.findById(productid);       // const buyer = await Buyer.findById({ _id: BUYERID });

    
        if(product){
            console.log(product);
            const date = new Date();
            let formattedDate="";
            //const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
            const day = date.getDate();
            const month = date.getMonth() + 1; // Months are zero-based, so add 1
            const year = date.getFullYear();
            // Format the date in dd-mm-yyyy format
            formattedDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;
            const  newReview = {
                ...reviewObj,
                data,
                formattedDate
            }
            console.log(newReview);
            product.reviews.push(newReview);
            product.ratings.push(newReview.rating);
            await product.save();
            res.send("Added");
        }
        else {
            res.status(404).send("Product or buyer not found");
        }
    }
    catch(e){
        console.log(e);
        res.status(500).send(e)
    }
})

//---------------------------------------------------------------- Add Suggestion -------------------------------------------------------

router.post("/addsuggestion/:id", async(req,res)=>{
    try{
        const sellerid = req.params.id;
        const { obj } = req.body;
        const seller = await Seller.findById(sellerid);

        if(seller){
            const date = new Date();
            let formattedDate="";
            //const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
            const day = date.getDate();
            const month = date.getMonth() + 1; // Months are zero-based, so add 1
            const year = date.getFullYear();
            // Format the date in dd-mm-yyyy format
            formattedDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;
            const suggestion ={
                ...obj,
                formattedDate
            }
            seller.suggestions.push(suggestion);
            await seller.save();
            res.send("Saved")
        }
        else {
            res.status(404).send("seller not found");
        }
    }
    catch(e){
        console.log(e);
        res.status(500).send(e)
    }
})



//------------------------------------------------------------------ make card payment --------------------------------------------------
router.post("/payment", (req, res) => {
    const { bill, token } = req.body;
    var productNames = "";
    for (let i = 0; i < bill.cartObject.productsToCart.length; i++) {
        productNames = productNames + bill.cartObject.productsToCart[i].name + " , ";
    }
    const transactionKey = uuidv4();
    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then((customer) => { // Changed 'customers' to 'customer' for consistency
        stripe.paymentIntents.create({
            amount: bill.totalamount * 100, // Convert to cents
            currency: "inr",
            customer: customer.id, // Use 'customer.id' instead of 'customers.id'
            payment_method_types: ["card"],
            setup_future_usage: "off_session",
            receipt_email: token.email, // Changed 'receipt-email' to 'receipt_email'
            description: productNames
        }).then((result) => {
            res.status(200).json(result);
        }).catch((e) => { // Fixed syntax for catch block
            console.log(e);
            res.status(500).send("payment-failed"); // Changed 'payment-failed' to "payment-failed"
        });
    }).catch((e) => { // Added catch block for outer promise
        console.log(e);
        res.status(500).send("payment-failed"); // Changed 'payment-failed' to "payment-failed"
    });
});




//----------------------------------------------------- bill for buyers ----------------------
router.get("/getbillforbuyers/:id" , async(req,res)=>{
    const {id} = req.params;
    console.log('bill aPI');
    try{
        const bill = await Bill.find({"buyerobj._id": id});
        if(bill)
        {
            console.log(bill);
            res.json(bill);
        }
    }
    catch(e){
        console.log(e);
    }
})






































// -------------------------------------------------------  BUG resolving -------------------------------------


//---------------------------- to edit the existing product to add seller obj......... to resolve bug

router.put('/editProduct/:id', async (req, res) => {
    console.log("Edition function..");
    const { sellerobj } = req.body;
    const id = req.params.id;
    
    try {
        if (!sellerobj) {
            return res.status(400).send("Seller object is missing in the request body.");
        }

        // Optionally, you can add more validation for the sellerobj here

        const product = await Product.findByIdAndUpdate(id, { $set: { sellerobj: sellerobj } }, { new: true });
        
        if (product) {
            console.log("Product updated:", product);
            return res.send("Product updated successfully.");
        } else {
            return res.status(404).send("Product not found.");
        }
    } catch (e) {
        console.error("Error updating product:", e);
        return res.status(500).send("Internal Server Error.");
    }
});
//------------------------------------------------------------------------- edit seller email-----------------------------------------------

router.put('/editemailofseller/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        const {email} = req.body;
         const buyer = await Buyer.findByIdAndUpdate(id , {$set:{email:email}} , {new:true});
         if(buyer)
         {
            res.send("update success")
         }
         else{
            res.send("not updated")
         }
         
    }
    catch(e){
        console.log(e);
    }
})


// -------------------------------------------------------- correcting seller mail in products -----------
router.put(`/editproductsellermail/:id`, async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;
        const product = await Product.findOneAndUpdate(
            { sellerid: id },
            { $set: { "sellerobj.email": email } },
            { new: true }
        );
        res.json(product); // Send back the updated product
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
























// bill model
// - containd the seller id , buyer id , prod id
// - displlay for both sellers and buyers
// - sellers = orders
// - buyers = myorders

module.exports = router;
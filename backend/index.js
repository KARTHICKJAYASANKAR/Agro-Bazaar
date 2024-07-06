const express = require('express');
const { PORT , mongoDBURL } = require('./config');
const bodyParser = require('body-parser');
 const router = require('./routes')
const cors = require('cors');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({limit: '50mb'}));
app.use(express.json({limit: '50mb'}));

app.use(cors());
const mongoose = require('mongoose');


app.use(router);




async function connectToDatabase() {
    try {
        await mongoose.connect(mongoDBURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

connectToDatabase();



app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);
})



// middleware

const multer = require('multer');
var path = require("path");

const storage = multer.diskStorage({
    destination:function(req,file,cb)
    {
        cb(null,"uploads/");
    },
    filename:function(req,file,cb)
    {
        cb(null,Date.now+'-'+file.originalname);
    }
})


const upload = multer({storage:storage,
    limits:{fieldSize:1024*1024*3}
}).single('profilePicture');



module.exports = upload;


//middleware


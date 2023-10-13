const { isValidObjectId } = require('mongoose');
const productservice = require('../service/product-service');
const userauth = require('./middlewares/auth')
const multer = require("multer")
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './Uploaded-image/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);  
    }
  });

  const filefilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
        const err = new Error('Only .png, .jpg and .jpeg format allowed!')
        err.name = 'ExtensionError'
        return cb(err);
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter:filefilter
  }).array('productimage', 4);
module.exports = (app) => {
    
    const proservice = new productservice();

    //create product
    app.post('/product/create', upload,async(req,res,next) => {
        try {
            const listimage = req.files;
            const productimage =  new Array();
            listimage.map(item=>{
                productimage.push(item.path)
            })
            console.log(productimage)
            const { name,price,quantity ,type,status,specification,reasonforsale} = req.body;
            const { data } =  await proservice.createproduct({ name,price,quantity,type,status,specification,reasonforsale,productimage});
             return res.json(data);
        } catch (err) {
            next(err)    
        }  
    });
    //delete product by id
    app.delete('/product/delete/:id', async(req,res,next) => {
        try {
            const id = req.params.id;
            if(isValidObjectId(id)){
                await proservice.deleteproductbyid(id);
                return res.status(200).json({message: "items deleted"});
            }
           else{
                return res.status(400).json({message: "invalid id"});
           }
           
        } catch (err) {
            next(err)    
        }
    });
    // get stuff by type (books,ticket,...)
    app.get('/product/category/:type', async(req,res,next) => {
        const type = req.params.type;
        try {
            const { data } = await proservice.getproductsbycategory(type)
            return res.status(200).json(data)
        } catch (err) {
            next(err)
        }
    });
    //get product by product's id
    app.get('/product/:id', async(req,res,next) => {
        const productid = req.params.id;
        try {
            if(isValidObjectId(productid)){
                const {data}  = await proservice.getproductbyid(productid);
                return res.status(200).json(data);
            }
           else{
                return res.status(400).json({message: "invalid id"});
           }
        } catch (err) {
            next(err)
        }
    });
    // get the order by id list in cart
    app.get('/product/ids',userauth, async(req,res,next) => {
        try {
            const { ids } = req.body;
            const products = await proservice.getselectedproducts(ids);
            return res.status(200).json(products);
        } catch (err) {
            next(err)
        }
    });
   //get the list of all products
    app.get('/product', async (req,res,next) => {
        try {
            const {data} = await proservice.getproducts();        
            return res.status(200).json(data);
        } catch (err) {
            next(err)
        }
    });
    //get products with price frow low to high
    app.get('/product/ascending/category/:type', async (req,res,next) => {
        try {
            const {data} = await proservice.getproductinpriceorder(1,req.params.type);        
            return res.status(200).json(data);
        } catch (err) {
            next(err)
        }
    });
    //get products with price frow high to low
    app.get('/product/descending/category/:type', async (req,res,next) => {
        try {
            const {data} = await proservice.getproductinpriceorder(-1,req.params.type);        
            return res.status(200).json(data);
        } catch (err) {
            next(err)
        }
    });
    
}
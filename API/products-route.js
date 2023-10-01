const { isValidObjectId } = require('mongoose');
const productservice = require('../service/product-service');
const usersservice = require('../service/users-service');
const userauth = require('./middlewares/auth')

module.exports = (app) => {
    
    const proservice = new productservice();
    const useservice = new usersservice();

    //create product
    app.post('/product/create', async(req,res,next) => {
        try {
            const { name,price,quantity ,type,status,specification,reasonforsale } = req.body; 
            // validation
            const { data } =  await proservice.createproduct({ name,price,quantity,type,status,specification,reasonforsale });
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
    app.get('/product/ids', async(req,res,next) => {
        try {
            const { ids } = req.body;
            const products = await proservice.getselectedproducts(ids);
            return res.status(200).json(products);
        } catch (err) {
            next(err)
        }
    });
     // add to  user's cart
    app.put('/product/cart/add',userauth, async (req,res,next) => {
        const { _id, quantity } = req.body;
        try {   
            if(isValidObjectId(_id)){
                const {data} =  await useservice.addtocart(req.user._id,_id, quantity, false)//false === add
                return res.status(200).json(data);
            }
            else{
                return res.status(400).json({message:"invalid id"})
            }
           
        } catch (err) {
            next(err)
        }
    });
    //delete stuff in cart
    app.delete('/product/cart/delete',userauth, async (req,res,next) => {
        const { _id } = req.body; 
        try {
            if(isValidObjectId(_id)){
                const {data} = await useservice.addtocart(req.user._id,_id, quantity, true);     // true === remove    
                return res.status(200).json(data);
            }
           else{
                return res.status(400).json({message:"invalid id"});
           }
            
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
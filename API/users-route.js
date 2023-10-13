const usersservice = require("../service/users-service");
const userauth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new usersservice();
  app.post("/users/signup", async (req, res, next) => {
    try {
      const { email, password,name, phone } = req.body;
      const   mydata   = await service.signup({ email, password, name, phone });
      if(mydata === null)
        return res.json({message:"invalid email"});
      else
      {
        return res.status(200).json({
          message:"success"
        })
      };
    } catch (err) {
      next(err);
    }
  });
  app.put("/users/changepassword",userauth, async (req, res, next) => {
    try {
      const { email,oldpassword,newpassword} = req.body;
      const   mydata   = await service.changepassword({ email,oldpassword,newpassword });
      if(mydata === null)
        return res.json({message:"invalid data"});
      else
      {
        return res.status(200).json({
          message:"password changed"
        })
      };
    } catch (err) {
      next(err);
    }
  });

  app.post("/users/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const  data  = await service.login({ email, password });
      if(data === null)
        return res.json({message:"invalid input"});
      else
      {
        const { id, token } = data.data;
        const result = { id, token };
        return res.status(200).json(result)
      };
    } catch (err) {
      next(err);
    }
  });

  //receive notification from Admin
  app.post("/users/notification", async (req, res, next) => {
    try {
      const { email,infor } = req.body;
      const data  = await service.postnotify({ email,infor });
      if(data===null)
        return res.json({message:"invalid data"});
      else
        return res.status(200).json({message:"post success"})   
      } 
      catch (err) {
      next(err);
    }
  });
  // add address (>=0)
  app.post("/users/address", userauth, async (req, res, next) => {
    try {
      const { _id } = req.user;

      const { country, province, city,street } = req.body;

      const { data } = await service.addnewaddress(_id, {
        country,
        province,
        city,
        street,
      });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });
  // get profile info
  app.get("/users/profile", userauth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.getprofile({ _id });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });
   // add product to cart
  app.put('/users/cart/add',userauth, async (req,res,next) => {
    const { _id, quantity } = req.body; // product's info
    try {   
        if(isValidObjectId(_id)){
            const {data} =  await service.addtocart(req.user._id,_id, quantity, false)//false === add
            return res.status(200).json(data);
        }
        else{
            return res.status(400).json({message:"invalid id"})
        }
       
    } catch (err) {
        next(err)
    }
  });
  //delete product in cart
  app.delete('/users/cart/delete',userauth, async (req,res,next) => {
    const { _id } = req.body; //_id product
    try {
        if(isValidObjectId(_id)){
            const {data} = await service.addtocart(req.user._id,_id, quantity, true);     // true === remove    
            return res.status(200).json(data);
        }
       else{
            return res.status(400).json({message:"invalid id"});
       }
        
    } catch (err) {
        next(err)
    }
 });
  //get cart info
  app.get('/users/cart', userauth, async (req,res,next) => {
    const { _id } = req.user; // users _id
    try {
        const { data } = await service.getprofile(_id);
        return res.status(200).json(data.cart);
    } catch (err) {
        next(err);
    }
});
};
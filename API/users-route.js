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

  app.post("/users/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { data } = await service.login({ email, password });
      return res.json(data);
    } catch (err) {
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
};
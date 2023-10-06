const  usersmodel  = require("../models/users");
const  addressmodel  = require("../models/address");

class usersrepository {
  async createusers({ email,password,name,salt,phone }) {
    try {
      const users = new usersmodel({
        email,
        password,
        name,
        salt,
        phone,
        address: [],
      });
      const usersresult = await users.save();
      return usersresult;
    } catch (err) {
      throw err;
    }
  }
  async createaddress({ _id,country, province, city, street }) {
    try {
      const profile = await usersmodel.findById(_id);

      if (profile) {
        const newAddress = new addressmodel({
          country,
          province,
          city,
          street,
        });
        await newAddress.save();
        profile.address.push(newAddress);
      }
      // save the address if push in
      return await profile.save();
    } catch (err) {
      throw err;
    }
  }

  async changepassword({email,userpassword}){
    try {
      const profile = await usersmodel.findOne({ email: email });
      if(profile)
      {
        const query = { email: email };
        const update = { $set: { password: userpassword }};
        const options = {};
        const result = await usersmodel.updateOne(query, update, options)
        return result;
      }
      throw new Error("unable to change password");
    }
    catch (err) {
      throw err;
    }
  }
  async postnotify({email,infor}){
    try {
      const existingusers = await usersmodel.findOne({ email: email });
      let notidate = new Date().toLocaleString();
      const newNotification = {
        infor: infor,
        date: notidate
      };
      existingusers.notification.push(newNotification);
      return existingusers;
    }
    catch (err) {
      throw err;
    }
  }
  async findusers({ email }) {
    try {
      const existingusers = await usersmodel.findOne({ email: email });
      return existingusers;
    } catch (err) {
      throw err;
    }
  }

  async findusersbyid({ id }) {
    try {
      const existingusers = await usersmodel.findById(id)
        .populate("address")
        .populate("orders")
        .populate("cart.product");
      console.log(existingusers);
      return existingusers;
    } catch (err) {
      throw err;
    }
  }
  
  async addcartitem(usersid, productid, quantity, isRemove) {
    try {
      const profile = await usersmodel.findById(usersid);

      if (profile) {
        const cartItem = {
          product: productid,
          unit: quantity,
        };

        let cartItems = profile.cart;

        if (cartItems.length > 0) {
          let isExist = false;
          cartItems.map((item) => {
            if (item.product.toString() === productid.toString()) {
              if (isRemove) {
                cartItems.splice(cartItems.indexOf(item), 1);
              } else {
                item.unit = quantity;
              }
              isExist = true;
            }
          });

          if (!isExist) {
            cartItems.push(cartItem);
          }
        } else {
          cartItems.push(cartItem);
        }

        profile.cart = cartItems;
        const cartSaveResult = await profile.save();
        return cartSaveResult.cart;
      }

      throw new Error("unable to add to cart");
    } catch (err) {
      throw err;
    }
  }

  async addordertoprofile(customerid, order) {
    try {
      const profile = await usersmodel.findById(customerid);

      if (profile) {
        if (profile.orders == undefined) {
          profile.orders = [];
        }
        profile.orders.push(order);

        profile.cart = [];

        const profileResult = await profile.save();

        return profileResult;
      }

      throw new Error("Unable to add to order!");
    } catch (err) {
      throw err;
    }
  }
}

module.exports = usersrepository;
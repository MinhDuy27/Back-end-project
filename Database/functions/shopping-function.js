const usersmodel  = require("../models/users");
const ordermodel  = require("../models/order");
const { v4: uuidv4 } = require('uuid'); //generate uniq id
const order = require("../models/order");

//Dealing with data base operations
class shoppingrepository {
    
    async getorder(userid){
        try{
            const user = await order.find({"userid": userid})
            .populate('items.product')  
            return user;
        }catch(err){
            throw err;
        }
    }
    async deleteorder(userid,orderid){
        try{
            const profile = await usersmodel.findById(userid);
            if(profile)
            {
                let orderitem = profile.orders;
                if(orderitem.length>0)
                {
                    orderitem.map((id)=>{
                        if(id.toString() === orderid.toString())
                        {
                            orderitem.splice(orderitem.indexOf(id),1);
                        }
                        else{
                            throw new Error("order not exist"); 
                        }
                    })
                }
                else
                {
                    throw new Error("order is empty");
                }
            }
            else
            {
                throw new Error("invalid profile");
            }
            const order = await profile.save()
            return order.orders
        }
        catch(err){
            throw err
        }
    }//
    async createneworder(usersid){
        //check transaction for payment Status
        try{
            const profile = await usersmodel.findById(usersid).populate("cart.product");
            if(profile){
                let amount = 0;   
                let cartItems = profile.cart;
                if(cartItems.length > 0){
                    cartItems.map(item => {
                        amount += parseInt(item.product.price) *  parseInt(item.unit);   
                    });
                    const orderid = uuidv4();
                    let orderdate = new Date().toLocaleString();
                    const order = new ordermodel({
                        orderid,
                        orderdate,
                        status:'processing',
                        amount,
                        items: cartItems
                    })
                    profile.cart = [];
                    order.usersid=usersid;
                    order.populate('items.product');
                    const orderResult = await order.save();
                   
                    profile.orders.push(orderResult);
                    //profile.userid.push(usersid);
                    await profile.save();
                    return orderResult;
                }
            }
    
          return {};

        }catch(err){
            throw err;
        }
        

    }
}

module.exports = shoppingrepository;
const { shoppingrepository } = require('../Database');
const { formatedata } = require('../Database/side-function/side1');

// All Business logic will be here
class shoppingservice {
  constructor() {
    this.repository = new shoppingrepository();
  }

  async placeorder(userinput) {
    const { _id} = userinput;
    try {
      const orderresult = await this.repository.createneworder(_id);
      return formatedata(orderresult);
    } catch (err) {
      throw err;
    }
  }

  async deleteorders(userid,orderid) {
    try {
      const orders = await this.repository.deleteorder(userid,orderid);
      return formatedata(orders);
    } catch (err) {
      throw err;
    }
  }
  async getorders(userid) {
    try {
      const orders = await this.repository.getorder(userid);
      return formatedata(orders);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = shoppingservice;
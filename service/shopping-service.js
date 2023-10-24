const { shoppingrepository, userrepository } = require('../Database');
const { notfoundError } = require("../Database/side-function/app-error");

// All Business logic will be here
class shoppingservice {
  constructor() {
    this.repository = new shoppingrepository();
  }

  async placeorder(userid,deliveryaddress) {
    return await this.repository.createneworder(userid,deliveryaddress);
  }

  async deleteorders(userid,orderid) {
    return await this.repository.deleteorder(userid,orderid);
    
  }
  async getorders(userid) {
    return await this.repository.getorder(userid);
    
  }
}

module.exports = shoppingservice;
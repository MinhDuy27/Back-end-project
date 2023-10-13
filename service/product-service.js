const { productrepository } = require('../Database');
const { formatedata } = require('../Database/side-function/side1');

// All Business logic will be here
class productservice {
    constructor(){
        this.repository = new productrepository();
    }

    async createproduct(productinputs){
        try{
            const productresult = await this.repository.createproduct(productinputs)
            return formatedata(productresult);
        }catch(err){
            throw err;
        }
    }

    async deleteproductbyid(productid){
        try{
            const result = this.repository.deleteproductbyid(productid)
            return formatedata(result)
        }
        catch(err){
            throw err
        } 
    }

    async getproducts(){
        try{
            const products = await this.repository.getproducts();
            let categories = {};
            products.map(({ type }) => {
                categories[type] = type;
            });
            return formatedata(products)
        }catch(err){
            throw err;
        }
    }

    async getproductsbycategory(category){
        try {
            const products = await this.repository.findbycategory(category);
            return formatedata(products)
        } catch (err) {
            throw err;
        }
    }

    async getselectedproducts(selectedIds){
        try {
            const products = await this.repository.findselectedproducts(selectedIds);
            return formatedata(products);
        } catch (err) {
            throw err;
        }
    }
    
    async getproductbyid(productId){
        try {
            const product = await this.repository.findbyid(productId);
            return formatedata(product);
        } catch (err) {
            throw err;
        }
    }
    
    async getproductinpriceorder(sortorder,category){ // 1  ascending , -1 descending
        try {
            const product = await this.repository.findproductsbyprice(sortorder,category);  
            return formatedata(product);    
        } 
        catch (err) {
            throw err;
        }
    }
}

module.exports = productservice;
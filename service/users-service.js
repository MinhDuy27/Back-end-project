const { userrepository } = require("../Database");
const {  generatepassword, formatedata, generatesignature, validatepassword,generatesalt } = require('../Database/side-function/side1');
//const { APIError, BadRequestError } = require('../utils/app-errors')


//logic
class usersservice {
    constructor(){
        this.repository = new userrepository();
    }
    async login(userinputs){

        const { email, password } = userinputs;
        
        try { 
            const existingusers = await this.repository.findusers({email});
            if(existingusers){
            
                const validPassword = await validatepassword(password, existingusers.password, existingusers.salt);
                
                if(validPassword){
                    const token = await generatesignature({ email: existingusers.email, _id: existingusers._id});
                    return formatedata({id: existingusers._id, token });
                } 
            }
            return null;
        } catch (err) {
            throw err;
        }
    }
    async changepassword(userinputs){

        const {email,oldpassword,newpassword } = userinputs;
        
        try { 
            const existingusers = await this.repository.findusers({email});
            if(existingusers)
            {
                const validPassword = await validatepassword(oldpassword, existingusers.password, existingusers.salt);
                if(validPassword)
                {
                    let userpassword = await generatepassword(newpassword, existingusers.salt);
                    const result = await this.repository.changepassword({ email,userpassword});
                    return formatedata(result);
                }
            }
            return null;    
        }
         catch (err) {
            throw err;
        }
    }
    async signup(userinputs){

        const { email, password, name,phone } = userinputs;
        const existingusers = await this.repository.findusers({email});
        if(existingusers)
             return null;
        else{
            try{
                // create salt
                let salt = await generatesalt();
                
                let userPassword = await generatepassword(password, salt);
                
                const existinguser = await this.repository.createusers({ email, password: userPassword,name,salt,phone});
                
               // const token = await generatesignature({ email: email, _id: existinguser._id});
    
                return formatedata({id: existinguser._id });
    
            }catch(err){
                throw err;
            }
        }    
    }

    async postnotify(userinput){  
        try {
            const {email,infor} = userinput;
            const existingusers = await this.repository.findusers({email});
            if(existingusers)
            {
                const result = await this.repository.postnotify({email,infor});
                return formatedata(result);
            } 
            return null;     
        } 
        catch (err) {
            throw err;
        }
    }

    async addnewaddress(_id,userinputs){
        const { country, province, city,street} = userinputs;   
        try {
            const addressResult = await this.repository.createaddress({ _id,country, province, city, street})
            return formatedata(addressResult);
            
        } catch (err) {
            throw err;
        }
    }
    async getprofile(id){
        try {
            const existinguser = await this.repository.findusersbyid({id});
            return formatedata(existinguser);
        } catch (err) {
            throw err
        }
    }
    async addtocart(userid, productid, qty, isRemove){
        try {
            const cartResult = await this.repository.addcartitem(userid, productid, qty, isRemove);        
            return formatedata(cartResult);
        } catch (err) {
            throw err;
        }
    }
    async addorder(userid, order){
        try {
            const orderResult = await this.repository.addordertoprofile(userid, order);
            return formatedata(orderResult);
        } catch (err) {
            throw err;
        }
    }
}

module.exports = usersservice;
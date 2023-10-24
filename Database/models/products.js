const mongoose = require('mongoose');

const productschema= mongoose.Schema({
    name: String,
    price : Number,
    quantity: Number,
    type: String,
    status: String,
    specification: String,
    reasonforsale: String,
    productimage: [String]
}
,{
    toJSON: {
        transform(doc, ret){
            delete ret.__v;      
        }
    },
    timestamps: false
})
module.exports = mongoose.model('products',productschema);
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderschema = new Schema({
    usersid: mongoose.Schema.Types.ObjectId,//unique
    orderid: String,//unique
    orderdate:String,
    status: String,
    amount: Number,
    deliveryaddress: String,
    items: [
        {   
            product: {type: Schema.Types.ObjectId, ref: 'products', required: true} ,
            unit: { type: Number, require: true} 
        }
    ]
},{
    toJSON: {
        transform(doc, ret){
            delete ret.__v;      
        }
    },
    timestamps: false
}
);

module.exports =  mongoose.model('order', orderschema);
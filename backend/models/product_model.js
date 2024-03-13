const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    }, productName: {
        type: String,
        required: true
    }, sellerName: {
        type: String,
        required: true
    }, price: {
        type: Number,
        required: true
    }, description: {
        type: String,
        required: true
    }, image: {
        type: String,
        required: true
    }, stock: {
        type: Number,
        required: true,
        maxLength: 4,
        default: 1
    }, author: {
        type: ObjectId,
        ref: "UserModel"
    },
    reviews: [
        {
            comment: String,
            commentedBy: {
                type: ObjectId,
                ref: "UserModel"
            }

        }
    ]
}, { timestamps: true });

mongoose.model('ProductModel', productSchema);
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const cartSchema = new mongoose.Schema({
    orderItems: [
        {
            productId: {
                type: ObjectId,
                ref: "ProductModel"
            }, quantity: {
                type: Number,
                required: true
            }
        }
    ],
    total: {
        type: Number,
        required: true
    },
    shipping:
    {
        fullName: {
            type: String,
            required: true
        }, address: {
            type: String,
            required: true
        }, city: {
            type: String,
            required: true
        }, postalCode: {
            type: String,
            required: true
        }, country: {
            type: String,
            required: true
        },
    }, payment: {
        id: {
            type: String,
            req: true
        }, status: {
            type: String,
            default: 'Pending'
        }
    },
    productId: {
        type: ObjectId,
        ref: "ProductModel"
    },
    userId: {
        type: ObjectId,
        ref: "UserModel",
        required: true
    }
})

mongoose.model('CartModel', cartSchema);
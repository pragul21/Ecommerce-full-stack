const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const orderSchema = new mongoose.Schema({
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

        }, address: {
            type: String,

        }, city: {
            type: String,

        }, postalCode: {
            type: String,

        }, country: {
            type: String,

        },
    },
    productId: {
        type: ObjectId,
        ref: "ProductModel"
    },
    userId: {
        type: ObjectId,
        ref: "UserModel",
        required: true
    },
    delivered: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

mongoose.model("OrderModel", orderSchema)
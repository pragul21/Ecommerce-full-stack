const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }, isAuth: {
        type: Boolean,
        default: false
    },
    cart: {
        items: [
            {
                productId: {
                    type: ObjectId,
                    ref: "ProductModel",
                    required: true
                }, quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    }

}, { timestamps: true });

mongoose.model("UserModel", userSchema);
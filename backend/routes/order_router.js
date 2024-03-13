const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const CartModel = mongoose.model('CartModel')
const OrderModel = mongoose.model('OrderModel')
const ProductModel = mongoose.model('ProductModel');
const UserModel = mongoose.model('UserModel');
const protectedRoute = require('../middleware/protectedResource');
const isAuth = require('../middleware/isAuth');


//add to cart using productId
router.post('/addtocart/:productId', protectedRoute, (req, res) => {
    const productId = req.params.productId;
    const quantity = 1;
    const userId = req.user._id;

    UserModel.findById(userId)
        .then((userCart) => {
            // console.log(productId)
            if (userCart) {
                //finding index of items and checking if already there 
                const idx = userCart.cart.items.findIndex(item => item.productId.toString() === productId.toString());
                //if item is not there add quantity 
                if (idx !== -1) {
                    userCart.cart.items[idx].quantity += quantity;
                } else {
                    //else push to cart
                    userCart.cart.items.push({ productId, quantity });
                }
                return userCart.save();
            } else {
                return res.status(404).json({ result: 'User not found' });
            }
        })
        .then((updatedCart) => {
            return res.status(200).json({ result: 'Added to cart successfully', cart: updatedCart.cart });
        })
        .catch((error) => {
            console.log(error);
        });
});

//reduce quantity of product in cart
router.put('/minusitem/:productId', protectedRoute, (req, res) => {
    const userId = req.user._id;
    const productId = req.params.productId;
    UserModel.findById(userId)
        .then((userCart) => {
            if (userCart) {
                //finding index of item
                const idx = userCart.cart.items.findIndex(item => item.productId.toString() === productId)

                if (idx !== -1) {
                    //if quantity is only one then item will be removed form cart
                    if (userCart.cart.items[idx].quantity === 1) {
                        userCart.cart.items.splice(idx, 1)

                    } else {
                        userCart.cart.items[idx].quantity--;
                    }

                }
                return userCart.save();


            } else {
                return res.status(400).json({ error: 'error while reducing quantity' })
            }
        }).catch((error) => {
            console.log(error)
        })
})

// router.get('/getcart', protectedRoute, (req, res) => {
//     const userId = req.user._id;
//     UserModel.findById(userId)
//         .then((userCart) => {
//             const cartItems = userCart.cart.items.map((products) => {
//                 ProductModel.findById(products.productId)
//                     .then((products) => {
//                         return res.status(200).json({ items: products })
//                     })
//             })
//             return res.status(200).json({ result: userCart, product: products })
//         }).catch((error) => {
//             console.log(error)
//         })
// })

router.get('/getcart', protectedRoute, (req, res) => {
    const userId = req.user._id
    UserModel.findById(userId)

        .then((userCart) => {
            const productDetailPromise = userCart.cart.items.map((item) => {
                // console.log(item.productId)
                return ProductModel.findById(item.productId)
                    .then((products) => {
                        if (products._id !== null) {
                            return {
                                productId: products._id,
                                productName: products.productName,
                                sellerName: products.sellerName,
                                price: products.price,
                                image: products.image,
                                description: products.description,
                                quantity: item.quantity
                            }
                        }

                    })
                    .catch((error) => {
                        console.log(error)
                    })
            })
            Promise.all(productDetailPromise)

                .then((productDetails) => {
                    return res.status(200).json({ productDetails })
                }).catch((error) => {
                    console.log(error)
                })
        })
        .catch((error) => {
            console.log(error)
        })
})


//delete product from cart
router.delete('/deletecart/:productId', protectedRoute, (req, res) => {
    const userId = req.user._id;
    const productId = req.params.productId;
    UserModel.findByIdAndUpdate(userId)
        .then((userCart) => {
            if (userCart) {
                //finding index of item
                const idx = userCart.cart.items.findIndex(item => item.productId.toString() === productId)

                if (idx !== -1) {
                    //if quantity is only one then item will be removed form cart
                    userCart.cart.items.splice(idx, 1)
                }
                return userCart.save();

            } else {
                return res.status(400).json({ error: 'error while reducing quantity' })
            }
        }).catch((error) => {
            console.log(error)
        })
});

//cart model for shipping address
router.post('/cart', protectedRoute, (req, res) => {
    const userId = req.user._id;
    const { fullName, address, city, postalCode, country } = req.body;
    UserModel.findById(userId)
        .then((userCart) => {
            if (!userCart) {
                return res.status(400).json({ error: 'UserCart not found' });
            }
            const productId = userCart.cart.items.map(item => item.productId)
            //productModel.find no use just there tried some other way to make it easy but not able to do so
            ProductModel.find({ _id: { $in: productId } })
                .then((products) => {
                    // console.log(products)
                    if (!products) {
                        return res.status(400).json({ error: 'some error' })
                    }
                    const productsDetails = products.map(product => ({
                        productId: product._id,
                        productName: product.productName,
                        description: product.description,
                        price: product.price,
                        image: product.image,
                        category: product.category
                    }))
                    // console.log(productsDetails)
                    const orderItems = userCart.cart.items.map(item => ({ productId: item.productId, quantity: item.quantity }));
                    // console.log(orderItems)
                    orderTotal(userCart.cart.items)

                        .then((total) => {
                            //if(cart model for this user already exist then update the existing cart model cart model 
                            //do not create a new cart model )
                            CartModel.findOneAndUpdate({ userId }, { $set: { orderItems, productsDetails, total, shipping: { fullName, address, city, postalCode, country } } }, {
                                new: true, upsert: true
                            })
                                .then((cartmodel) => {
                                    return res.status(200).json({ cart: cartmodel, productsDetails });
                                })

                        }).catch((error) => {
                            console.log(error)
                        })
                }).catch((error) => {
                    console.log(error)
                })
        }).catch((error) => {
            console.log(error)
        })

})

//subfunction to find total of order 
function orderTotal(items) {
    let total = 0;
    //finding product details using productId
    const productPromises = items.map((item) => {
        return ProductModel.findById(item.productId)
            .then((product) => {
                if (product) {
                    total += item.quantity * product.price;
                }
            })
            .catch((error) => {
                console.log(error);
            });
    });

    return Promise.all(productPromises)
        .then(() => total)
        .catch((error) => {
            console.log(error);
            throw error;
        });
}

//getting  user cart model checkout details for preview order page
router.get('/getcartdetails', protectedRoute, (req, res) => {
    const userId = req.user._id
    CartModel.findOne({ userId })
        .then((cartDetail) => {
            // const productId = cartDetail
            // console.log(productId)

            if (!cartDetail) {
                return res.status(400).json({ error: 'No details found' })
            }
            const productId = cartDetail.orderItems.map((product) => {
                return product.productId
            })
            ProductModel.find({ _id: { $in: productId } })
                .then((cartItems) => {
                    // console.log(cartItems)
                    return res.status(200).json({ cart: cartDetail, product: cartItems });

                }).catch((error) => {
                    console.log(error)
                })
        }).catch((error) => {
            console.log(error)
        })
});

//route for making the payment status to Completed from pending 
router.put('/payment', protectedRoute, (req, res) => {
    const userId = req.user._id
    CartModel.findOneAndUpdate({ userId, 'payment.status': 'Pending' }, { $set: { 'payment.status': 'Completed' } }, {
        new: true
    })
        .then((updatedCart) => {
            if (!updatedCart) {
                return res.status(400).json({ error: 'Could not complete the payment' })
            }
            return res.status(200).json({ result: 'payment completed', cart: updatedCart })
        }).catch((error) => {
            console.log(error)
        })
})

//creating new order only if payment is Completed  and emptying cartmodel
router.post('/order', protectedRoute, (req, res) => {
    const userId = req.user._id;

    CartModel.findOne({ userId })
        .then((cartDetail) => {
            if (!cartDetail) {
                return res.status(400).json({ error: 'Could not find your cart' });
            }

            const orderItems = cartDetail.orderItems.map((product) => ({
                productId: product.productId,
                quantity: product.quantity
            }));

            const total = cartDetail.total;
            const payment = cartDetail.payment.status
            const address = {
                fullName: cartDetail.shipping.fullName,
                address: cartDetail.shipping.address,
                postalCode: cartDetail.shipping.postalCode,
                city: cartDetail.shipping.city
            };

            if (cartDetail.payment.status === 'Completed') {
                const order = new OrderModel({ userId, shipping: address, orderItems, total, payment: payment });

                order.save()
                    .then((newOrder) => {
                        CartModel.findOneAndDelete({ userId })
                            .then((emptyCart) => {

                                return res.status(200).json({ order: newOrder, emptyCart });

                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    })
                    .catch((error) => {
                        console.log(error);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    });
            } else {
                return res.status(400).json({ error: 'Invalid payment status or payment information missing' });
            }
        })
        .catch((error) => {
            console.log(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        });
});

//my orders user specific
router.get('/getmyorders', protectedRoute, (req, res) => {
    OrderModel.find({ userId: req.user._id })
        .then((order) => {
            // console.log(order)
            if (!order) {
                return res.status(400).json({ error: "Order not found" })
            }
            return res.status(200).json({ order: order })
        }).catch((error) => {
            console.log(error)
        })
})

//all orders admin specific
router.get('/getallorders', protectedRoute, isAuth, (req, res) => {
    OrderModel.find()
        .then((allorders) => {
            return res.status(200).json({ order: allorders })
        }).catch((error) => {
            console.log(error)
        })
})

//delivered functionality for Admin with orderId
router.put('/delivered/:orderId', protectedRoute, isAuth, (req, res) => {
    const orderId = req.params.orderId
    OrderModel.findByIdAndUpdate(orderId, { $set: { delivered: true } }, {
        new: true
    })
        .then((allorders) => {
            return res.status(200).json({ order: allorders })
        }).catch((error) => {
            console.log(error)
        })
})

module.exports = router;

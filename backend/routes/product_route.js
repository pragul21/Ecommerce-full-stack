const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ProductModel = mongoose.model('ProductModel');
const UserModel = mongoose.model('UserModel');
const protectedRoute = require('../middleware/protectedResource')
const isAuth = require('../middleware/isAuth')

router.post('/createproduct', protectedRoute, isAuth, (req, res) => {
    const { category, productName, sellerName, price, stock, description, image } = req.body;
    if (!category || !productName || !sellerName || !price || !stock || !description) {
        return res.status(400).json({ error: 'One or more mandatory fields are empty' });
    }
    const productObj = new ProductModel({ category, productName, sellerName, price, stock, description, image, author: req.user });
    productObj.save()

        .then((newProduct) => {
            res.status(201).json({ product: newProduct });

        }).catch((error) => {
            console.log(error);
        })


});

//delete and update functionality only gona work for products you create not these seet products
//seed 10 products
router.post('/seedproducts', protectedRoute, (req, res) => {
    ProductModel.insertMany([
        { category: "men", productName: "lower", sellerName: "jocky", price: 90, description: "style", image: "https://images.unsplash.com/photo-1682686580849-3e7f67df4015?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { category: "men", productName: "lower", sellerName: "jocky", price: 90, description: "style", image: "https://images.unsplash.com/photo-1682686580849-3e7f67df4015?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { category: "men", productName: "lower", sellerName: "jocky", price: 90, description: "style", image: "https://images.unsplash.com/photo-1682686580849-3e7f67df4015?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { category: "women", productName: "lower", sellerName: "jocky", price: 90, description: "style", image: "https://images.unsplash.com/photo-1682686580849-3e7f67df4015?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { category: "women", productName: "lower", sellerName: "jocky", price: 90, description: "style", image: "https://images.unsplash.com/photo-1682686580849-3e7f67df4015?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { category: "kids", productName: "lower", sellerName: "jocky", price: 90, description: "style", image: "https://images.unsplash.com/photo-1682686580849-3e7f67df4015?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { category: "kids", productName: "lower", sellerName: "jocky", price: 90, description: "style", image: "https://images.unsplash.com/photo-1682686580849-3e7f67df4015?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { category: "men", productName: "lower", sellerName: "jocky", price: 90, description: "style", image: "https://images.unsplash.com/photo-1682686580849-3e7f67df4015?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { category: "men", productName: "lower", sellerName: "jocky", price: 90, description: "style", image: "https://images.unsplash.com/photo-1682686580849-3e7f67df4015?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { category: "men", productName: "lower", sellerName: "jocky", price: 90, description: "style", image: "https://images.unsplash.com/photo-1682686580849-3e7f67df4015?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
    ])
        .then((products) => {
            return res.status(200).json({ products })
        }).catch((error) => {
            console.log(error);
        })
})
router.delete('/deleteproduct/:productId', protectedRoute, (req, res) => {
    ProductModel.findOne({ _id: req.params.productId })
        .populate("author", "_id")
        .exec()
        .then((productFound) => {
            if (!productFound) {
                return res.status(400).json({ error: "Product Not Found" });
            }

            // Checking if author is the same
            if (productFound.author && productFound.author._id.toString() === req.user._id.toString()) {
                ProductModel.deleteOne({ _id: req.params.productId })
                    .then(() => {
                        UserModel.findById(req.user._id)
                            .then((user) => {
                                const idx = user.cart.items.findIndex(product => product.productId.toString() === req.params.productId);
                                if (idx !== -1) {
                                    user.cart.items.splice(idx, 1);
                                }
                                return user.save();
                            })
                            .then(() => {
                                res.status(200).json({ message: "Product deleted successfully" });
                            })
                            .catch((error) => {
                                console.log(error);
                                res.status(500).json({ error: "Internal Server Error" });
                            });
                    })
                    .catch((error) => {
                        console.log(error);
                        res.status(500).json({ error: "Internal Server Error" });
                    });
            } else {
                return res.status(403).json({ error: 'Unauthorized to delete product' });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
        });
});


//all products
router.get('/allproducts', (req, res) => {
    ProductModel.find()
        .populate("author", "_id fullName")

        .then((dbProducts) => {
            res.status(200).json({ product: dbProducts })
        }).catch((error) => {
            console.log(error)
        })
})

//for  specific category product
router.get('/products/:category', (req, res) => {
    const category = req.params.category;

    ProductModel.find({ category })
        .then((products) => {
            return res.status(200).json({ product: products });
        }).catch((error) => {
            console.log(error);
        })
})

//product details page get product by Id
router.get('/getproductdetails/:productId', (req, res) => {
    const productId = req.params.productId;

    ProductModel.findById(productId)
        .populate("author", "_id")
        .populate('reviews.commentedBy', "_id fullName")
        .then((product) => {
            if (!product) {
                return res.status(400).json({ error: "product not found" })
            }
            return res.status(200).json({ productDetails: product })
        }).catch((error) => {
            console.log(error)
        })
})


//my listed products
router.get('/myproducts', protectedRoute, isAuth, (req, res) => {
    ProductModel.find({ author: req.user._id })

        .then((dbProducts) => {
            res.status(200).json({ result: dbProducts })
        }).catch((error) => {
            console.log(error);
        })
})



router.put('/updateproduct/:productId', protectedRoute, (req, res) => {
    const productId = req.params.productId;
    const { category, productName, price, description } = req.body;
    ProductModel.findOne({ _id: req.params.productId })
        .populate("author", "_id ")
        .then((productFound) => {
            if (!productFound) {
                return res.status(400).json({ error: "Product Not Found" })
            }
            //checking if author is same or not
            // console.log(productFound.author._id.toString())
            if (productFound.author && productFound.author._id.toString() === req.user._id.toString()) {

                ProductModel.findByIdAndUpdate(productId, { category, productName, price, description }, {
                    new: true // it return updated record
                })
                    .then((updatedProduct) => {
                        if (!updatedProduct) {
                            return res.status(401).json({ error: 'Product Not found' })
                        }
                        //sending updated product in response
                        return res.status(200).json({ product: updatedProduct })
                    }).catch((error) => {
                        console.log(error);
                    })
            } else {
                return res.status(400).json({ error: 'Not authorised' })
            }
        })
})


router.get('/search', (req, res) => {
    const { product } = req.query;

    ProductModel.find({
        $or: [
            { productName: { $regex: product, $options: 'i' } },
        ],
    })
        .then((products) => {
            return res.status(200).json({ products })
        }).catch((error) => {
            console.log(error)
        })
})

router.put('/reviews', protectedRoute, (req, res) => {
    const reviews = { comment: req.body.comment, commentedBy: req.user._id }

    ProductModel.findByIdAndUpdate(req.body.productId, {
        $push: { reviews: reviews }
    }, {
        new: true
    })
        .then((updatedProduct) => {
            if (!updatedProduct) {
                res.status(404).json({ error: "product not found" })
            } else {
                res.status(200).json(updatedProduct)
            }
        }).catch((error) => {
            console.log(error);
        })
})


module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('../model/user.model');      
const Product = require('../model/product.model');
const isAuthenticated = require("../middlewares/auth");

// Add to Wishlist
router.post('/wishlist/add/:productId', isAuthenticated, async (req, res) => {
    const productId = req.params.productId;

    try {
        const user = await User.findById(req.session.user.id); 
        if (!user) return res.redirect('/login');

        const product = await Product.findById(productId);
        if (!product) {
            req.session.message = 'Product not found.';
            return res.redirect('/wishlist');
        }

        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
            req.session.message = 'Product added to your wishlist.';
        } else {
            req.session.message = 'Product is already in your wishlist.';
        }

    } catch (err) {
        console.error('Error adding to wishlist:', err);
        req.session.message = 'An error occurred while adding to your wishlist.';
    }

    res.redirect('/wishlist');
});

// View Wishlist
router.get('/wishlist', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id).populate('wishlist');
        if (!user) return res.redirect('/login');

        res.render('wishlist', {
            wishlist: user.wishlist,
            message: req.session.message || null,
            cssFile : null
        });
        req.session.message = null;
    } catch (err) {
        console.error('Error fetching wishlist:', err);
        res.status(500).send('An error occurred.');
    }
});

// Remove from Wishlist
router.get('/wishlist/remove/:productId', isAuthenticated, async (req, res) => {
    const productId = req.params.productId;

    try {
        const user = await User.findById(req.session.user.id); 
        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();
        req.session.message = 'Product removed from your wishlist.';
        
    } catch (err) {
        console.error('Error removing from wishlist:', err);
        req.session.message = 'An error occurred while removing the product.';
    }

    res.redirect('/wishlist');
});

module.exports = router;

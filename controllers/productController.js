const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Category = mongoose.model('Category');
const Product = mongoose.model('Product');
var helpers = require('handlebars-helpers')();

router.get('/', async (req, res) => {
    const catagory = await Category.find({}).lean()
    res.render("product/addOrEdit", {
        viewTitle: "Insert Product",
        catagory: catagory,
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    console.log(req, 'req')
    var product = new Product();
    product.productId = req.body.productId;
    product.productName = req.body.productName;
    product.categoryId = req.body.categoryId;
    product.save((err, doc) => {
        if (!err)
            res.redirect('product/list/1');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("product/addOrEdit", {
                    viewTitle: "Insert Product",
                    product: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Product.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('product/list/1'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("product/addOrEdit", {
                    viewTitle: 'Update product',
                    product: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'productName':
                body['fullNameError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', async (req, res) => {
    const catagory = await Category.find({}).lean()
    console.log(catagory, 'catagory')
    Product.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("product/addOrEdit", {
                viewTitle: "Update Product",
                product: doc,
                catagory: catagory,
            });
        }
    }).lean();
});

router.get('/delete/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/product/list/1');
        }
        else { console.log('Error in Product delete :' + err); }
    });
});

router.get('/list', (req, res) => {
    console.log('product')
    Product.find((err, docs) => {
        if (!err) {
            res.render("product/list/1", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving product list :' + err);
        }
    }).lean();
});


router.get('/list/:page', function(req, res, next) {
    var perPage = 3
    var page = req.params.page || 1
    console.log(page, 'page count')
    Product
        .find({}).lean()
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, products) {
            Product.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('product/list', {
                    products: products,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
})

module.exports = router;
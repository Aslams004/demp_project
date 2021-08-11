const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
// const Employee = mongoose.model('Employee');
const Category = mongoose.model('Category');
var helpers = require('handlebars-helpers')();

router.get('/', (req, res) => {
    res.render("category/addOrEdit", {
        viewTitle: "Insert Category"
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
    var category = new Category();
    category.categoryId = req.body.categoryId;
    category.categoryName = req.body.categoryName;
    category.save((err, doc) => {
        if (!err)
            res.redirect('category/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("category/addOrEdit", {
                    viewTitle: "Insert Category",
                    category: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Category.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('category/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("category/addOrEdit", {
                    viewTitle: 'Update Category',
                    category: req.body
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
            case 'categoryName':
                body['fullNameError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Category.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("category/addOrEdit", {
                viewTitle: "Update Category",
                category: doc
            });
        }
    }).lean();
});

router.get('/delete/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/category/ca/list');
        }
        else { console.log('Error in category delete :' + err); }
    });
});

router.get('/ca/list', (req, res) => {
    console.log('Employee')
    Category.find((err, docs) => {
        if (!err) {
            res.render("category/list", {
                products: docs
            });
        }
        else {
            console.log('Error in retrieving category list :' + err);
        }
    }).lean();
});


// router.get('/ca/list', function(req, res, next) {
//     var perPage = 10
//     var page = req.params.page || 1
//     console.log(page, 'page count')
//     Category
//         .find({}).lean()
//         .skip((perPage * page) - perPage)
//         .limit(perPage)
//         .exec(function(err, products) {
//             Category.count().exec(function(err, count) {
//                 if (err) return next(err)
//                 res.render('category/list', {
//                     products: products,
//                     current: page,
//                     pages: Math.ceil(count / perPage)
//                 })
//             })
//         })
// })

module.exports = router;
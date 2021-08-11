const mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
    categoryId: {
        type: String,
        required: 'This field is required.'
    },
    categoryName: {
        type: String
    }
});

// // Custom validation for email
// categorySchema.path('email').validate((val) => {
//     emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return emailRegex.test(val);
// }, 'Invalid e-mail.');

mongoose.model('Category', categorySchema);
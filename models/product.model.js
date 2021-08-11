const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: 'This field is required.'
    },
    productName: {
        type: String
    },
    categoryId: {
        type: String
    }
});


mongoose.model('Product', productSchema);
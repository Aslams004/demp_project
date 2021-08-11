const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/DemoProject', { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});

require('./category.model');
require('./product.model');

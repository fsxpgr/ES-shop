var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Purchase = new Schema({

    buyerID: { type: String, require: true },
    date: { type: Date, default: Date.now },
    status: { type: String, default: 'shoppingCart', index: { unique: false } },
    items: [{
        itemID: { type: String, index: { unique: true } },
        name: { type: String, index: { unique: false } },
        price: { type: Number, index: { unique: false } },
        amount: { type: Number, index: { unique: false } }
    }]
}
);

Purchase.methods.countTotalSum = function () {
    var sum = 0;
    var items = this.items;
    for (var i = 0; i < items.lenght; i++) {
        sum += items[i].amount * items[i].price;
    }
    return sum;
}

module.exports = mongoose.model('shoppingCart', Purchase);
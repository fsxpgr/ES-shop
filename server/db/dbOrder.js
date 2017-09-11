const Purchases = require('../dbSchemas/order');
var PER_PAGE = 10;
var ObjectId = require('mongodb').ObjectID;

getPaginatedItems = (items, offset) => {
    return items.slice(offset, offset + 10);
}

exports.listOrder = (req, res) => {
    var offset = req.query.page ? parseInt(req.query.page, 10) : 0;
    var nextOffset = offset + PER_PAGE;
    var previousOffset = (offset - PER_PAGE < 1) ? 0 : offset - PER_PAGE;
    var filter = req.query.search ? req.query.search : '';

    /*serch filter*/
    var flag = 'gi'
    var regexOrder = Number(req.query.search)
    filter = "^(.*?)(" + filter + ")(.*)$";
    var regex = new RegExp(filter, flag);
    /*Find in BD*/
    Purchases.find({
        $and: [
            {
                $or: [
                    { 'items.title': { $regex: regex } },
                    { orderId: regexOrder }
                ]
            },

        ]
    }).then(doc => {
        var data = { doc: getPaginatedItems(doc, offset), total_count: Math.ceil(doc.length / 10) };
        res.send(data);
    })

}
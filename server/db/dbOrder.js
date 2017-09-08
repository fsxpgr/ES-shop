const Purchases = require('../dbSchemas/order');


getPaginatedItems = (items, offset) => {
    return items.slice(offset, offset + 10);
}


var PER_PAGE = 10;
exports.listOrder = (req, res) => {
    var offset = req.query.page ? parseInt(req.query.page, 10) : 0;
    var nextOffset = offset + PER_PAGE;
    var previousOffset = (offset - PER_PAGE < 1) ? 0 : offset - PER_PAGE;
    var filter = req.query.search ? req.query.search : '';


    /*serch filter*/
    var flag = 'gi'
    filter = "^(.*?)(" + filter + ")(.*)$";
    var regex = new RegExp(filter, flag);
    /*Find in BD*/
    Purchases.find({

        $and: [{ $or: [{ status: "delivering" }, { status: "complete" }] }, { $or: [{ 'items.title': { $regex: regex } }, { 'items.price': { $regex: regex } }] }]

    }).then(function (doc) {
        var data = { doc: getPaginatedItems(doc, offset), total_count: Math.ceil(doc.length / 10) };
        res.send(data);
    })

}
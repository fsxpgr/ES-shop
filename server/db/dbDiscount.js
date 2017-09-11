const Discount = require('../dbSchemas/discount');

exports.createDiscount = (data) => {
    return Discount.findOne({ disCode: data.disCode }).exec().then((doc) => {
        if (doc === null) {
            const discount = new Discount({
                disCode: data.disCode,
                dateExpired: data.dateExpired,
                product: data.product
            });
            return discount.save();
        }
        else {
            var temp = data.product.pop()
            doc.product = doc.product.concat(temp)
            return doc.save();
        }
    })
}

exports.listDiscount = (req, res) => {
    Discount.find({})
        .then(() =>
            res.json(data))
}

exports.deleteProdDiscount = (data) => {
    return Discount.findOne({ disCode: data.disCode }).exec().then((doc) => {
        doc.product = data.product
        return doc.save()
    })
}


exports.findDiscount = (req) => {
    return Discount.findOne({ disCode: req.disCode }).exec().then((data) => {
        if (data) {
            return data
        }
        else {
            var newDis = { disCode: req.disCode, product: [] }
            return newDis
        }
    })
}

exports.deleteDiscount = (disCode) => {
    return Discount.find({ disCode: disCode }).remove()
}

exports.listDiscount = (req, res) => {
    var filter = req.query.search ? req.query.search : '';
    var flag = 'gi'
    filter = "^(.*?)(" + filter + ")(.*)$";
    var regex = new RegExp(filter, flag);

    Discount.find({
        $and: [{ $or: [{ disCode: { $regex: regex } }, { product: { $elemMatch: { prodTitle: { $regex: regex } } } }] }]
    }).then((data) => {
        return res.send(data)
    })

}

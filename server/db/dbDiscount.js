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
    Discount.find({},
        (err, data) => {
            if (data)
                res.json(data)
            else
                console.log(err)
        }
    )
}

exports.deleteProdDiscount = (data) => {
    return Discount.findOne({ disCode: data.disCode }).exec().then((doc) => {
        doc.product = data.product
        return doc.save()
    })
}


exports.findDiscount = (req) => {
    return Discount.findOne({ disCode: req.disCode }).exec().then((doc) => {
        if (doc) {
            return doc
        }
        else {
            var ss = { disCode: req.disCode, product: [] }
            return ss
        }
    }
    )
}

exports.deleteDiscount = (disCode) => {
    return Discount.find({ disCode: disCode }).remove().exec()
}




exports.listDiscount = (req, res) => {
    var filter = req.query.search ? req.query.search : '';
    /*serch filter*/
    var flag = 'gi'
    filter = "^(.*?)(" + filter + ")(.*)$";
    var regex = new RegExp(filter, flag);

    Discount.find({
        $and: [{ $or: [{ disCode: { $regex: regex } }, { product: { $elemMatch: { prodTitle: { $regex: regex } } } }] }]
    }).then((data) => {
        return res.send(data)
    })

}

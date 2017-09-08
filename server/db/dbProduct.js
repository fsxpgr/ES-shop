const Product = require('../dbSchemas/product');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./server/s3_config.json');
var s3Bucket = new AWS.S3({ params: { Bucket: 'es-shop' } });
const fetch = require("fetch-base64");

exports.createProduct = (data) => {
    var imgS3arr = [];
    return Promise.all(data.img.map((img, i) => {
        return fetch.remote(img).then((base) => {
            var buf = Buffer.from(base[0], 'base64');
            var imgS3 = {
                Key: data.title.replace(/( )|(")/g, "_") + "_" + Math.random().toString(36).substring(2),
                Body: buf,
                ContentEncoding: 'base64',
                ContentType: 'image/jpeg'
            };
            return s3Bucket.putObject(imgS3).promise().then((data) => {
                imgS3arr.push('https://s3.eu-central-1.amazonaws.com/es-shop/' + imgS3.Key)
            }).catch((err) => {
                throw err;
            });
        });

    })).then(() => {
        const product = new Product({
            title: data.title.trim(),
            desc: data.desc,
            price: data.price,
            tags: data.tags,
            img: imgS3arr,
            properties: data.properties,
            accessible: data.accessible
        });
        return product.save();
    });
}


exports.editProduct = (id, data) => {
    return Product.findById(id)
        .then(() => {
            var imgS3arr = data.img;
            var tempArr = [];
            var i = imgS3arr.length
            while (i--) {
                if (!imgS3arr[i].match(/https:\/\/s3.eu-central-1.amazonaws.com\/es-shop\//g)) {
                    tempArr.push(imgS3arr[i])
                    imgS3arr.splice(i, 1)
                }
            }
            var tempArrS3 = []
            return Promise.all(tempArr.map((img, i) => {
                return fetch.remote(img).then((base) => {
                    var buf = Buffer.from(base[0], 'base64');
                    var imgS3 = {
                        Key: data.title.replace(/( )|(")/g, "_") + "_" + Math.random().toString(36).substring(2),
                        Body: buf,
                        ContentEncoding: 'base64',
                        ContentType: 'image/jpeg'
                    };
                    return s3Bucket.putObject(imgS3).promise().then((data) => {
                        tempArrS3.push('https://s3.eu-central-1.amazonaws.com/es-shop/' + imgS3.Key)
                    }).catch((err) => {
                        throw err;
                    });
                });
            }))
                .then((edited) => {
                    return Product.findById(id, (err, edited) => {
                        if (err) {
                            console.log(err)
                        }
                        edited.title = data.title.trim();
                        edited.desc = data.desc;
                        edited.price = data.price;
                        edited.tags = data.tags;
                        edited.img = imgS3arr.concat(tempArrS3);
                        edited.accessible = data.accessible;
                        edited.properties = data.properties;

                        edited.save()
                    });
                })
        })
}

exports.uploadFile = (data) => {
    var buf = Buffer.from(data.file.substring(23), 'base64');
    if (!data.title) {
        var imgS3 = {
            Key: Math.random().toString(36).substring(2),
            Body: buf,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg'
        }
    }
    else {
        var imgS3 = {
            Key: data.title.replace(/( )|(")/g, "_") + "_" + Math.random().toString(36).substring(2),
            Body: buf,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg'
        };
    }
    return s3Bucket.putObject(imgS3).promise().then((data) => {
        return 'https://s3.eu-central-1.amazonaws.com/es-shop/' + imgS3.Key
    }).catch((err) => {
        throw err;
    }).then();
}


exports.deleteProduct = (id) => {
    return Product.findById(id).remove((function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('deleted! id:' + id);
        }
    }));
}


exports.findItem = (id) => {
    return Product.findById(id, function (err, data) {
        if (err) {
            console.log(err);
        }
    });
}



getPaginatedItems = (items, offset) => {
    return items.slice(offset, offset + 10);
}

const PER_PAGE = 10;
exports.listItem = (req, res) => {
    var offset = req.query.page ? parseInt(req.query.page, 10) : 0;
    var nextOffset = offset + PER_PAGE;
    var previousOffset = (offset - PER_PAGE < 1) ? 0 : offset - PER_PAGE;
    var filter = req.query.search ? req.query.search : '';

    /*serch filter*/
    var flag = 'gi'
    filter = "^(.*?)(" + filter + ")(.*)$";
    var regex = new RegExp(filter, flag);

    /*Find in BD*/
    Product.find({
        $and: [{ $or: [{ title: { $regex: regex } }, { desc: { $regex: regex } }] }]
    }).then(function (doc) {
        var data = { doc: getPaginatedItems(doc, offset), total_count: Math.ceil(doc.length / 10) };
        res.send(data);
    })
}



//temporary
exports.allList = (req, res) => {
    Product.find({},
        (err, data) => {
            if (data)
                res.json(data)
        }
    )
}
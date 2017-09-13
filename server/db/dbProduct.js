const Product = require('../dbSchemas/product');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./server/s3_config.json');
const config = require('./../config');
var s3Bucket = new AWS.S3({ params: { Bucket: 'es-shop' } });
const fetch = require("fetch-base64");
const escapeStringRegexp = require('escape-string-regexp');
const PER_PAGE = 10;

const titleS3generator = data => {
    if (!data.title)
        var Key = Math.random().toString(36).substring(2)
    else
        var Key = data.title.replace(/( )|(")/g, "_") + "_" + Math.random().toString(36).substring(2)
    return Key
}

//parse url to s3object
const baseToS3 = (img, data, imgS3arr) => {
    return fetch.remote(img)
        .then(base => {
            var buf = Buffer.from(base[0], 'base64');
            var imgS3 = {
                Key: titleS3generator(data),
                Body: buf,
                ContentEncoding: 'base64',
                ContentType: 'image/jpeg'
            };
            return s3Bucket.putObject(imgS3).promise()
                .then(data =>
                    imgS3arr.push(config.s3url + imgS3.Key))
                .catch(err =>
                    console.log(err));
        });
}


exports.createProduct = (data) => {
    var imgS3arr = [];
    return Promise.all(data.img.map((img, i) => {
        return baseToS3(img, data, imgS3arr)
    }))
        .then(() => {
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
            //separate uploaded to s3 images
            var imgS3arr = data.img;
            var tempArr = [];
            var i = imgS3arr.length
            while (i--) {
                if (!imgS3arr[i].match(/https:\/\/s3.eu-central-1.amazonaws.com\/es-shop\//g)) {
                    tempArr.push(imgS3arr[i])
                    imgS3arr.splice(i, 1)
                }
            }

            //upload array of images to s3
            var tempArrS3 = []
            return Promise.all(tempArr.map((img, i) => {
                return baseToS3(img, data, tempArrS3);
            }))
                .then((edited) => {
                    return Product.findById(id, (err, edited) => {
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

exports.uploadFile = data => {
    var buf = Buffer.from(data.file.substring(23), 'base64');
    var imgS3 = {
        Key: titleS3generator(data),
        Body: buf,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
    }
    return s3Bucket.putObject(imgS3).promise()
        .then(data => {
            return config.s3url + imgS3.Key
        })
        .catch(err =>
            console.log(err)
        );
}


exports.deleteProduct = id => {
    return Product.findByIdAndRemove(id)
}

exports.findItem = id => {
    return Product.findOne({ _id: id })
}


getPaginatedItems = (items, offset) => {
    return items.slice(offset, offset + PER_PAGE);
}

exports.listItem = (req, res) => {
    var offset = req.query.page ? parseInt(req.query.page, 10) : 0;
    var nextOffset = offset + PER_PAGE;
    var previousOffset = (offset - PER_PAGE < 1) ? 0 : offset - PER_PAGE;
    var filter = req.query.search ? escapeStringRegexp(req.query.search) : '';

    /*serch filter*/
    var flag = 'gi'
    filter = "^(.*?)(" + filter + ")(.*)$";
    var regex = new RegExp(filter, flag);

    /*Find in BD*/
    Product.find({
        $or:
        [
            { title: { $regex: regex } },
            { desc: { $regex: regex } }
        ]
    })
        .then(doc => {
            var data = {
                doc: getPaginatedItems(doc, offset),
                total_count: Math.ceil(doc.length / PER_PAGE)
            };
            res.send(data);
        })
}



exports.getPaginatedItemsDis = (req, res) => {
    var offset = req.query.page ? parseInt(req.query.page, PER_PAGE) : 0;
    var nextOffset = offset + PER_PAGE;
    var previousOffset = (offset - PER_PAGE < 1) ? 0 : offset - PER_PAGE;
    var filter = req.query.search ? escapeStringRegexp(req.query.search) : '';

    /*serch filter*/
    var flag = 'gi'
    filter = "^(.*?)(" + filter + ")(.*)$";
    var regex = new RegExp(filter, flag);

    /*Find in BD*/
    Product.find({
        $or:
        [
            { title: { $regex: regex } },
            { desc: { $regex: regex } }
        ]
    })
        .then(doc => {
            var data = {
                doc: getPaginatedItems(doc, offset),
                total_count: Math.ceil(doc.length / PER_PAGE)
            };
            res.send(data);
        })
}

//filter products which uses in Create_discount page
exports.getDisProd = (req, res) => {
    return Product.find({
        title: req.body.titleArr
    })
    .then(data => res.json (data))
}
const passport = require('passport');
const dbUser = require('../db/dbUser');
const dbProduct = require('../db/dbProduct');
const dbDiscount = require('../db/dbDiscount');
const dbOrder = require('../db/dbOrder');

var isLogged = function (req, res, next) {
  if (req.user) {
    if (req.user.name == "Admin") {
      next();
    }
    return
  }
  else {
    res.redirect('/login');
  }
}


module.exports = (app) => {

  // product routes
  app.get('/admin/product', isLogged,
    (req, res) => {
      dbProduct.listItem(req, res);
    }
  )

  app.post('/admin/product', isLogged,
    (req, res) => {
      dbProduct.createProduct(req.body)
        .then(data => res.send(data));
    }
  );

  app.get('/admin/product/:id', isLogged,
    (req, res) => {
      dbProduct.findItem(req.params.id)
        .then(data => res.send(data));
    }
  )

  app.put('/admin/product/:id', isLogged,
    (req, res) => {
      dbProduct.editProduct(req.params.id, req.body)
        .then(data => res.send(data));
    }
  )

  app.post('/admin/product/file', isLogged,
    (req, res) => {
      dbProduct.uploadFile(req.body)
        .then(data => res.send(data));
    }
  )

  app.delete('/admin/product/:id', isLogged,
    (req, res) => {
      dbProduct.deleteProduct(req.params.id)
        .then(data => res.send(data));
    }
  )

  // auth routes
  app.post('/', (req, res) => {
    if (req.user) res.send(req.user.name)
    else res.json({ "Logged": false })
  }
  );

  app.post('/login',
    passport.authenticate('local'),
    (req, res) => res.send(req.user.name)
  );

  app.post('/logout', isLogged,
    (req, res) => {
      req.logOut();
      res.redirect('/');
    }
  );

  // discount routes
  app.get('/admin/prod', isLogged,
    (req, res) => {
      dbProduct.allList(req, res);
    }
  );

  app.get('/admin/discount', isLogged,
    (req, res) => {
      dbDiscount.listDiscount(req, res);
    }
  );

  app.get('/admin/discount/:disCode', isLogged,
    (req, res) => {
      dbDiscount.findDiscount(req.params)
        .then(data => res.send(data));
    }
  );

  app.post('/admin/discount', isLogged,
    (req, res) => {
      dbDiscount.createDiscount(req.body)
        .then(data => res.send(data));
    }
  );

  app.put('/admin/discount/:disCode', isLogged,
    (req, res) => {
      dbDiscount.deleteProdDiscount(req.body)
        .then(data => res.send(data));
    }
  )

  app.delete('/admin/discount/:disCode', isLogged,
    (req, res) => {
      dbDiscount.deleteDiscount(req.params.disCode)
        .then(data => res.send(data));
    }
  )

  // order routes
  app.get('/admin/order', isLogged,
    (req, res) => {
      dbOrder.listOrder(req, res);
    }
  );

}




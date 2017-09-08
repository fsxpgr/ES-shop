const User = require('../dbSchemas/user');


exports.updateCart = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { shoppingCart: req.body } },
    { new: true },
    (err, upduser) => {
      if (err) console.log(err);
    }
  );
};

exports.addItemToShoppingCart = (req, res) => {
  const item = { itemID: req.body };
  user.findByIdAndUpdate(req.user._id,
    { $push: { shoppingCart: item } },
    (err) => {
      if (err) console.log(err);
    }
  );
};

exports.saveProfile = (req, res) => {
  User.findByIdAndUpdate(req.user._id,
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password
      }
    },
    { new: true },
    (err, newuser) => {
      if (err) return res.send(err);
      console.log('newuser are saved in db');
      req.login(newuser, (err) => {
        if (!err) res.send(newuser);
      });
    }
  );
}

exports.register = (req, res) => {
  const newuser = new User({
    name: 'new User',
    phone: '',
    email: req.body.email,
    password: req.body.password,
    shoppingCart: []
  });
  newuser.save(function (error) {
    if (!error) {
      newuser.password = undefined;
      req.login(newuser, function (err) {
        if (err) {
          return res.redirect('/signup');
        }
        return res.send(req.user.name);
      });
    } else {
      console.log(error);
      return res.redirect("/signup");
    }
  });
}


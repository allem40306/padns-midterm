const { User } = require("../models");

const controller = {
  getAll(req, res, next) {
    console.log("Call User: getall");
    User.findAll()
      .then((instance) => res.status(200).send(instance))
      .catch(next);
  },
  get(req, res, next) {
    console.log("Call User: get");
    User.findOne({
      where: {
        username: req.params.username,
      },
    })
      .then((instance) => res.status(200).send(instance))
      .catch(next);
  },
  async create(req, res, next) {
    console.log("Call User: createuser");
    obj = req.body;
    const user = await User.findOne({
      where: {
        username: obj.username
      }
    })
    if (user === null) {
      const user = await User.create({
        username: obj.username,
        password: obj.password,
        picture: req.file.filename
      });
      res.status(200).send("User added");
      console.log(user);
    } else {
      res.status(200).send("User already exist");
    }
  },
  getPicture(req, res, next) {
    console.log("Call User: getpicture");
    console.log("req.params.filename", req.params.filename);
    res.sendFile(path.join(__dirname, '../uploads', req.params.filename));
  },
  async login(req, res, next) {
    console.log("Call User: login");
    const user = await User.findOne({
      where: {
        username: req.body.username
      }
    })
    console.log(user);
    if (user === null) {
      res.status(200).send("Invalid User");
    } else if (user.password === req.body.password) {
      console.log(user.username)
      console.log(req.session)
      req.session.username = user.username;
      res.status(200).send("Success login");
    } else {
      res.status(200).send("Wrong passoword");
    }
  },
  async loginCheck(req, res, next) {
    console.log("Call User: logincheck");
    console.log(req.session)
    if (req.session.username) {
      res.send({ loggedIn: true, user: req.session.user, picture: req.session.picture });
    } else {
      res.send({ loggedIn: false });
    }
  },
  async logout(req, res, next) {
    console.log("Call User: logout");
    req.session.username = null;
    res.send({ loggedIn: false, user: req.session.user });
  },
}

module.exports = { User: controller };
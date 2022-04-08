const { User } = require("../models");
const path = require("path")

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
  getPictures(req, res, next) {
    console.log("Call User: getpictures");
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
      req.session.username = user.username;
      req.session.picture = user.picture;
      res.status(200).send("Success login");
    } else {
      res.status(200).send("Wrong passoword");
    }
  },
  async loginCheck(req, res, next) {
    console.log("Call User: logincheck");
    if (req.session.username) {
      res.send({ loggedIn: true, username: req.session.username, picture: req.session.picture });
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
const express = require("express");
const { User, Comment } = require("../controllers");
const multer = require("multer");
const api = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png)$/)) {
      cb(new Error('Please upload an image'))
    }
    cb(null, true)
  },
})

const upload = multer({ storage: storage });

api.get("/users", User.getAll);
api.get("/users/:username", User.get);
api.post("/users", upload.single('file'), User.create);
api.get("/pictures/:filename", User.getPictures);

api.post("/login", User.login);
api.get("/logincheck", User.loginCheck);
api.get("/logout", User.logout);

api.get("/comments", Comment.getAll);
api.get("/comments/:commentid", Comment.get);
api.post("/comments", Comment.create);
api.delete("/comments", Comment.del);

module.exports = { api };

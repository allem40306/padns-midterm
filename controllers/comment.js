const { Comment } = require("../models");

const controller = {
  getAll(req, res, next) {
    console.log("Call Comment: getall");
    Comment.findAll()
      .then((instance) => res.status(200).send(instance))
      .catch(next);
  },
  get(req, res, next) {
    console.log("Call Comment: get");
    Comment.findOne({
      where: {
        id: req.params.commentid,
      },
    })
      .then((instance) => res.status(200).send(instance))
      .catch(next);
  },
  async create(req, res, next) {
    console.log("Call Comment: createComment");
    obj = req.body;
    console.log(obj);
    const comment = await Comment.create({
      username: obj.username,
      content: obj.content,
      picture: obj.picture
    });
    res.status(200).send("Comment added");
    console.log(comment);
  },
  async del(req, res, next) {
    console.log("Call Comment: deleteComment");
    obj = req.body;
    console.log(obj);
    const comment = await Comment.findOne({
      where: {
        id: req.params.commentid,
      },
    })
    if (obj.username === comment.username && obj.content === comment.content && obj.status === true) {
      console.log(obj.username + " wants to delete id:" + obj.id);
      const response = await comment.destroy();
      res.status(200).send("Comment deleted");
    }
    else{
      res.status(200).send("Invaild delete request");
    }
  },
}

module.exports = { Comment: controller };
const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // YOU NEED THIS
    },
  },
});

class User extends Model {}
User.init(
  {
    username: {type: DataTypes.STRING, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    picture:{type: DataTypes.STRING}//,
    // userid: {type: DataTypes.INTEGER, allowNull: false, autoIncrement: true}
  },
  { sequelize, modelName: "user" }
);

class Comment extends Model {}
Comment.init(
  {
    username: {type: DataTypes.STRING},
    content: {type: DataTypes.STRING},
    picture: {type: DataTypes.STRING}
  },
  { sequelize, modelName: "comment" }
);


async function show() {
  await sequelize.sync();
  const comments = await Comment.findAll();
  console.log(comments);
};

show();

// Comment.drop();
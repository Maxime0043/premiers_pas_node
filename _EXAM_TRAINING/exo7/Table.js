require("dotenv").config();
const mongoose = require("mongoose");
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@h3-intro-node.2zetg.mongodb.net/test`
  )
  .then(() => console.log("Connected to mongo"))
  .catch((err) => console.error("Failed to connect to mongo, ", err));

const userSchema = new mongoose.Schema({
  name: String,
});
const User = mongoose.model("User", userSchema);

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const Account = mongoose.model("Account", accountSchema);

module.exports.getAll = async () => {
  return User.find({});
};

module.exports.getOne = async (id) => {
  return User.findById(id);
};

module.exports.createUser = async (obj) => {
  const user = new User(obj);
  return user.save();
};

module.exports.updateUser = async (id, obj) => {
  return User.findByIdAndUpdate(id, obj);
};

module.exports.deleteUser = async (id) => {
  return User.findByIdAndDelete(id);
};

module.exports.Account = Account;

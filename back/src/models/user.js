const mongoose = require("mongoose");
const Role = require("./role");

let default_image = "default_image.jpg";

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String },
  adresse: { type: String },
  email: {
    type: String,
    required: true,
    unique: [true, "Email is already in use"],
  },
  gender: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(Role) },
  image: { type: String, default: default_image },
  salt: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  company: { type: String },
  isConnected: { type: Boolean, default: false }, // <-- ajout ici
},
{
  timestamps: true
});

UserSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  delete obj.salt;
  delete obj.__v;
  // delete obj.createdAt;
  // delete obj.updatedAt;
  return obj;
}

module.exports = mongoose.model("User", UserSchema);

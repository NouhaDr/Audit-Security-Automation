require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  CONNECTION_STRING: process.env.CONNECTION_STRING,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,
  brevo_user: process.env.brevo_user,
  brevo_pass: process.env.brevo_pass,
  brevo_mail: process.env.brevo_mail,
  ip_VM: process.env.ip_VM,
  user_VM: process.env.user_VM,
  user_openvas: process.env.user_openvas,
  pass_openvas: process.env.pass_openvas,
};

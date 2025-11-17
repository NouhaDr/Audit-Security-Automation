const { User, Role } = require("../models");
const { ApiError } = require("../utils/index");
const { genSalt, hashPassword } = require("../utils/password-utility");
const nodemailer = require("nodemailer");
const config = require('../config/config');
//find all users
module.exports.findAll = async function (req, res, next) {
  try {
    const users = await User.find({ isDeleted : false})
    return res.status(200).send({message : "Users retrieved successfully", data :  users});
  } catch (error) {
    next(Error("Error while getting enabled users"))
  }
}
//find all auditors
module.exports.findAllAuditors = async function (req, res, next) {
  try {
    const auditors = await User.find({ isDeleted : false, role : Role.Auditor})
    return res.status(200).send({message :  "Auditors retrieved successfully", data : auditors});
  } catch (error) {
    next(Error("Error while getting auditors"))
  }
}
// find all audit leaders
module.exports.findAllAuditleaders = async function (req, res, next) {
  try {
    const auditleaders = await User.find({ isDeleted : false, role : Role.AuditLeader})
    return res.status(200).send({message :  "Auditors retrieved successfully", data : auditleaders});
  } catch (error) {
    next(Error("Error while getting auditors"))
  }
}
/*// Find users by isEnabled and role fields
module.exports.findEnabled = async function (req, res, next) {
  try {
    const query = { isDeleted: false };
    
    if (req.query.enabled) {
      query.isEnabled = req.query.enabled === 'true';
    }
    
    if (req.query.role) {
      query.role = req.query.role;
    }
    const data = await User.find(query);

    return res.status(200).send({ message: "Users retrieved successfully", data: data });
  } catch (error) {
    next(new Error("Error while getting users"));
  }
};*/

module.exports.findDeleted = async function (req, res, next) {
  try {
    const query = { isDeleted: true };
  
    const data = await User.find(query);

    return res.status(200).send({ message: "Users retrieved successfully", data: data });
  } catch (error) {
    next(new Error("Error while getting users"));
  }
};
//find all clients
module.exports.findAllClients = async function (req, res, next) {
  try {
    const client = await User.find({ isDeleted : false, role : Role.Client, isEnabled : true })
    return res.status(200).send({message : "Clients retrieved successfully", data : client});
  } catch (error) {
    next(Error("Error while getting clients"))
  }
}
//find user by id
module.exports.findById = async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    return res.status(200).send({ message : "User retrieved successfully", data : user });
  } catch (error) {
    next(Error("Error while getting user"))
  }
}
//find user by email
module.exports.findByEmail = async function(req,res){
  try {
    const user = await User.findOne({email: req.body.email})
    if (!user) {
      throw new ApiError("User with this email not found");
    }
    return res.status(200).json(user);
  }
  catch (error) {
    next(error);
  }
}
/*//enable or disable user
module.exports.enableUser = async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    user.isEnabled = !user.isEnabled;
    await user.save();
    return res.status(200).json({ message: "User enabled successfully" });
  } catch (error) {
    next(new Error("Error while enabling user"))
  }
};*/
//delete user
module.exports.deleteUser = async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    user.isDeleted = !user.isDeleted;
    const deleted =  await user.save();
    return res.status(200).json({ message: "User deleted/restored successfully", data : deleted });
  } catch (error) {
    console.log(error)
    next(new Error("Error while deleting/restoring user"))
  }
};
//update user image
module.exports.UpdateUserImage = async function (req, res, next) {
  let new_image = "default_image.jpg";
  try {
    if (req.file && req.file.filename) {
      new_image = req.file.filename;
    }
    await User.findByIdAndUpdate(req.params.id, { $set: { image : new_image } });
    return res.status(200).json({ message: "Image updated successfully", data : new_image });
  } catch (error) {
    next(new Error("Error while updating user"))
  } 
};
//update user details
module.exports.UpdateUserDetails = async function (req, res, next) {
  try {
    const { firstName, lastName, adresse, phone } = req.body;
    const user = await User.findById(req.params.id);
    if(firstName) user.firstName = firstName;  
    if(lastName) user.lastName = lastName;  
    if(phone) user.phone = phone;  
    if(adresse) user.adresse = adresse;  
    await user.save();
    const payload = await User.findById(req.params.id).select('-salt -password');
    return res.status(200).json({ message: "Details updated successfully", data : payload });
  } catch (error) {
    console.log(error)
    next(new Error("Error while updating user details"))
  } 
};
//change password
module.exports.changePassword = async function (req,res,next){
  try {
    const { oldPassword , newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.params.id);
    if(hashPassword(oldPassword, user.salt) == user.password){
      throw Error("Old password is not the same")
    }
    if(newPassword != confirmPassword){
      throw Error("Please verify your new password");
    }
    const new_salt = await genSalt();
    const hashed_pwd = await hashPassword(newPassword, new_salt);
    user.password = hashed_pwd;
    user.salt = new_salt;
    await user.save();
    return res.status(200).send({message : "Password updated successfully"});
  } catch (error) {
    next(new Error(error));
  }
}


module.exports.createUser = async (req, res, next) => {
  try {
    // ✅ Vérifier si l'email existe déjà
    const exist_user = await User.findOne({ email: req.body.email });
    if (exist_user) {
      throw new Error("User with this email already in use");
    }

    const plainPassword = req.body.password; 

    // ✅ Configuration SMTP pour envoyer l'email AVANT la création de l'utilisateur
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: "8741c5001@smtp-brevo.com",
        pass: "NfkRM783wstPE5Dy",
      },
    });

    // ✅ Contenu de l'email
    const mailOptions = {
      from: "nouhadr222@gmail.com", // Adresse expéditeur
      to: req.body.email, // Email du nouvel utilisateur
      subject: "Bienvenue sur Auditify - Vos identifiants",
      text: `Bonjour ${req.body.firstName},\n\nVotre compte a été créé avec succès sur Auditify.\n\nDétails de connexion :\n- Nom : ${req.body.firstName} ${req.body.lastName}\n- Email : ${req.body.email}\n- Mot de passe temporaire : ${plainPassword}\n\nMerci d'utiliser notre service.\n\nL'équipe Auditify.`,
    };

    // ✅ Envoi de l'email AVANT la création de l'utilisateur
    await transporter.sendMail(mailOptions);
    console.log("📩 Email avec mot de passe envoyé à :", req.body.email);

    // ✅ Hacher le mot de passe APRÈS l'envoi de l'email
    const new_salt = await genSalt();
    const hashed_pwd = await hashPassword(plainPassword, new_salt);

    // ✅ Enregistrer l'utilisateur dans la base de données
    const saved_user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      password: hashed_pwd,
      adresse: req.body.adresse,
      salt: new_salt,
      role: req.body.role,
      gender: req.body.gender,
    });

    return res.status(200).send({ data: saved_user, message: "User added successfully & Email sent" });

  } catch (error) {
    next(error);
  }
};
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const passwordHash = require("password-hash");
const User = require("../../Models/user");
const { Validator } = require("node-input-validator");
const Upload = require("../../service/upload");

function createToken(data) {
  return jwt.sign(data, "usertoken");
}

const getTokenData = async (token) => {
  let userData = User.findOne({ token: token }).exec();
  return userData;
};

const register = async (req, res) => {
  const v = new Validator(req.body, {
    email: "required|email",
    password: "required",
  });
  let matched = await v.check().then((val) => val);
  if (!matched) {
    return res.status(200).send({ status: false, error: v.errors });
  }
  User.findOne({ email: req.body.email }).then(async (data) => {
    if (data == null || data == "") {
      let userData = {
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: passwordHash.generate(req.body.password),
        confirmed_password:req.body.confirmed_password,
        country:req.body.country,
        token: createToken(req.body),
        created_at: Date.now(),
      };
      if (
        req.body.telephone != "" ||
        req.body.telephone != null ||
        typeof req.body.telephone != "undefined"
      ) {
        userData.telephone = req.body.telephone;
      }
      if (
        req.body.country != "" ||
        req.body.country != null ||
        typeof req.body.country != "undefined"
      ) {
        userData.country = req.body.country;
      }

    //   if (
    //     req.body.image != "" ||
    //     req.body.image != null ||
    //     typeof req.body.image != "undefined"
    //   ) {
    //     userData.image = req.body.image;
    //   }

      const all_users = new User(userData);

      return all_users
        .save()
        .then((result) => {
          res.status(200).json({
            status: true,
            success: true,
            message: "New user created successfully",
            data: result,
          });
        })
        .catch((error) => {
          res.status(200).json({
            status: false,
            success: false,
            message: "Server error. Please try again.",
            error: error,
          });
        });
    } else {
      res.status(400).json({
        status: false,
        message: "Email is already registered.",
        error: "Email exists.",
      });
    }
  });
};

const login = async (req, res) => {
  let v = new Validator(req.body, {
    email: "required|email",
    password: "required",
  });
  let matched = await v.check().then((val) => val);
  if (!matched) {
    return res.status(400).json({
      status: false,
      error: v.errors,
    });
  }

  User.findOne({ email: req.body.email }).then((data) => {
    if (data == null || data == "") {
      res.status(400).json({
        status: false,
        message: "Wrong email id.",
      });
    } else if (
      data != null &&
      data != "" &&
      data.comparePassword(req.body.password)
    ) {
      return res.status(200).json({
        status: true,
        message: "Successfully logged in",
        data: data, 
      });
    } else {
      res.status(500).json({
        status: false,
        message: "Wrong password.",
        error: "Wrong password.",
      });
    }
  });
};

//user add profile picture
// const profileImage = async (req, res) => {
//   let image_file = "";
//   let image_url = await Upload.uploadfile(req, "user");
//   if (req.file != null && req.file != "" && typeof req.file != "undefined") {
//     image_file = image_url;
  

//     res.status(200).json({
//       status: true,
//       image: uploadDAta,
//       error: null,
//     });
//   }
// };
const updateProfile = async (req, res) => {
  let profile = await User.findOne({
    _id: { $in: [mongoose.Types.ObjectId(req.params.id)] },
  }).exec();

  if (profile != null && profile != "") {
    User.findOneAndUpdate(
      { _id: { $in: [mongoose.Types.ObjectId(req.params.id)] } },
      req.body,
      { new: true },
      (err, result) => {
        if (!err) {
          res.status(200).json({
            status: true,
            message: "Profile successfully updated",
            profileDetails: result,
          });
        } else {
          res.status(500).json({
            status: false,
            message: "Failed to update.Server error",
            error: err,
          });
        }
      }
    );
  } else {
    res.status(400).json({
      status: false,
      message: "Profile not found.",
      data: profile,
    });
  }
};

module.exports = {
    getTokenData,
    register,
    login

};

import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import sendEmail from "../middlewares/mailer.js";

export function getAll(req, res) {
  User.find({})
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function getById(req, res) {
  User.findById(req.id)
    .then((docs) => {
      
      res.status(200).json(docs)
    })
    .catch((err) => {
      res.status(404).json({ error: "Unvalid ID" });
    });
}

//kif user iheb ibadel mot de passe. Tekhou id user fel param w oldPassword w newPassword fel body
export async function updatePassword(req, res) {
  let user = await User.findOne({ _id: req.id });

  if (await bcrypt.compare(req.body.oldPassword, user.Password)) {
    const newPasswordEncrypted = await bcrypt.hash(req.body.newPassword, 10);
    await User.findOneAndUpdate(
      { _id: req.id },
      {
        Password: newPasswordEncrypted,
      }
    )
      .then((docs) => {
        res.status(200).json({"message":"Password update successful"});
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } else {
    res.status(401).json({ error: "Incorrect old password" });
  }
}

//update photo de profil lel user tekho el id fel param w taswira esmha "ProfilePhoto" w traja3lek lien jdid mta taswira
export async function updatePhoto(req, res) {
  User.findOneAndUpdate(
    { _id: req.id },
    {
      ProfilePhoto: `${req.protocol}://${req.get("host")}${
        process.env.IMGURL
      }/${req.file.filename}`,
    }
  )
    .then((docs) => {
      var url = `${req.protocol}://${req.get("host")}${process.env.IMGURL}/${
        req.file.filename
      }`;
      res.status(200).json(url);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      console.log(err);
    });
}

export async function updateOnce(req, res) {
  User.findByIdAndUpdate(
    { _id: req.id },
    {
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Role: req.body.Role,
      Email: req.body.Email,
      ProfilePhoto: req.body.ProfilePhoto,
    },
    {
      // Hedha i5alih iraja3lek el version updated mtaa user mech el kdim
      returnDocument: "after",
    }
  )
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(404).json({ error: err });
    });
}

export async function deleteOnce(req, res) {
  let user = await User.findOne({ _id: req.params.id });
  if (user) {
    User.findByIdAndRemove(req.params.id, req.body)
      .then((docs) => {
        res.status(200).json({ Success: "User deleted." });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } else {
    res.status(404).json({ error: "User with given id doesnt exist." });
  }
}

//Send the reset password otp to the email
export async function sendOTPResetEmail(req, res) {
  let user = await User.findOne({ Email: req.body.Email });
  if (user) {
    //create OTP
    const OTPReset = Math.floor(1000 + Math.random() * 9000).toString();
    //update OTP in the database
    User.findOneAndUpdate({ _id: user._id }, { OTPReset: OTPReset })
      .then(async (docs) => {
        //send otp to email
        sendEmail(user.Email, "Password Reset", OTPReset);
        user.OTPReset = OTPReset;
        res.status(200).json("OTP generated");
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
  else {
    res.status(404).json({ error: "User with given email doesnt exist." });
  }
}

//Change password
export async function resetPassword(req, res) {
  const user = await User.findOne({ Email: req.body.Email });

  if (user) {
    if (req.body.OTPReset === user.OTPReset) {
      const EncryptedPassword = await bcrypt.hash(req.body.Password, 10);
      await User.findOneAndUpdate(
        { _id: user._id },
        {
          Password: EncryptedPassword,
          OTPReset: null
        }
      )
        .then((docs) => {
          user.Password = EncryptedPassword;
          res.status(200).json(docs);
        })
        .catch((err) => {
          res.status(500).json("Error while reseting password");
        });
    }
  }
}

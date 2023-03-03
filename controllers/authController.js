import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// ki user yaamel register nhotolo fi ProfilePhoto taswira par defaut esmha default.png w baad ki yaamel login ibadel wahdo
export async function register(req, res) {
  const { FirstName, LastName, Email, Password } = req.body;

  if (!(Email && Password && FirstName && LastName)) {
    res.status(400).send("All fields are required");
  }

  const oldUser = await User.findOne({ Email });
  if (oldUser) {
    return res.status(409).send("User already exists");
  }
  // Generate an OTP for email verification
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  let NewUser = new User({
    FirstName,
    LastName,
    Email: Email,
    Password: await bcrypt.hash(Password, 10),
    ProfilePhoto: `${req.protocol}://${req.get("host")}${process.env.IMGURL
      }/default.png`,
    OTP: otp
  });

  User.create(NewUser)
    .then((docs) => {
      // Send the OTP to the user's email address
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
      });
      const mailOptions = {
        from: process.env.USER,
        to: Email,
        subject: "Email verification",
        html: `
        <html>
  <head>
    <title>Email Verification OTP</title>
  </head>
  <body style="background-color: #f5f5f5; padding: 10px;">
    <div style="background-color: #ffffff; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px;">
      <h2 style="text-align: center; color: #BC539F;">Verify Your Email</h2>
      <p style="color: #333333;">Dear ${FirstName} ${LastName},</p>
      <p style="color: #333333;">Please use the following OTP to verify your email:</p>
      <div style="background-color: #BC539F; padding: 20px; text-align: center; font-size: 18px; border-radius: 10px;">
        <b style="color: #ffffff;">${otp}</b>
      </div>
      <p style="color: #333333;">Please note that this OTP is valid for 10 minutes only.</p>
      <p style="color: #333333;">Thank you for using our service!</p>
      <p style="color: #333333;">The Team</p>
    </div>
  </body>
</html>

        
        `,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
          res.status(500).send("Failed to send OTP");
        } else {
          res.status(201).json(docs);
        }
      });

    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

//Verify email 
export async function emailVerification(req, res) {
  const { Email, OTP } = req.body;

  const user = await User.findOne({ Email: Email });

  if (!user) {
    return res.status(400).send('User not found');
  }

  if (user.OTP !== OTP) {
    return res.status(400).send('Invalid OTP');
  }

  // Mark user email as verified
  user.Verified = true;
  user.OTP = undefined;
  await user.save();

  res.send('Your email has been verified');
}


export async function login(req, res) {
  const { Email, Password } = req.body;

  if (!(Email && Password)) {
    res.status(400).send("All fields are required");
  }

  const user = await User.findOne({ Email: req.body.Email });

  if (user) {
    if (await bcrypt.compare(Password, user.Password)) {
      const newToken = await jwt.sign({ id: user._id }, process.env.TOKENKEY, {
        expiresIn: "4d",
      });
      user.Token = newToken;
      user
        .updateOne({ _id: user._id, Token: newToken })
        .then((docs) => {
          res.status(200).json(newToken);
        })
        .catch((err) => {
          res.status(500).json({ error: err });
        });
    } else {
      res.status(401).send("Invalid credentials");
    }
  } else {
    res.status(404).send("Unexistant user");
  }
}

export async function logout(req, res) {
  const user = await User.findById(req.id)
  if (user.Token == null) {
    res.status(500).json({ error: "User already logged out" });
  }
  else {
    await User.findOneAndUpdate(
      { _id: req.id },
      {
        Token: null,
      }
    )
      .then((docs) => {
        res.status(200).json({ "message": "Logout successful" });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }

}

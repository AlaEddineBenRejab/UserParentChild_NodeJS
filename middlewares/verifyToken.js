import jwt from "jsonwebtoken";
import { User } from "../models/user.js";



export const checkCurrentUser = (req, res, next) => {
  let token = req.headers['authorization']
  console.log(token)
  if (token) {
   

    jwt.verify(
      token,
      process.env.TOKENKEY,
      (err, decoded) => {
        if (err) {
          return res.json({
            status: false,
            msg: 'token is invalid',
          })
        } else {
          
          User.findById(decoded.id) .then((docs) => {
            req.id = docs._id
            next()
          })
          .catch((err) => {
            return res.json({
              status: false,
              msg: 'token content invalid',
            })
          });
       
        }
      }
    )
  } else {
    return res.json({
      status: false,
      msg: 'token is not provided ',
    })
  }
}



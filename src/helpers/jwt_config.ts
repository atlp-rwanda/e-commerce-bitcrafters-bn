import {Person, verificationToken} from '../models/user';
import Jwt from "jsonwebtoken";
import jwt from "jsonwebtoken";
import express from "express";

declare global {
  namespace Express {
    interface Request {
      userInfo?: object|string;
    }
  } 
}

export const generateToken = (data:object) => {
  let token = Jwt.sign(data, "USER-AUTH", {
    expiresIn: 300000,
  });
  return token
};


export  const extractToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const NAMESPACE = 'USER-AUTH'
  try{
  let token = req.headers.authorization?.split(" ")[1]  || "";
 
  if (!token) {
    return res.status(401).json({
      message: "no access token found",
    });
  }

   jwt.verify(token, NAMESPACE, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }  
    res.locals.decoded = decoded
    req.userInfo = decoded;

    next();
  });
  }catch(error){
    console.log("Error Occured in extract token", error)
    res.status(500).json({message:"Internal server down"})
  }
  
}
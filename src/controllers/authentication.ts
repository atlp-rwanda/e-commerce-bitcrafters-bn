import { hashPassword, comparePassword } from "../helpers/hashPassword";
import express from "express";
import {Person, verificationToken} from "../models/user";
import { generateToken } from "../helpers/jwt_config";
import { Mailer } from "./sendEmail";
import crypto from "crypto"

export const Register = async (req: express.Request, res: express.Response) =>{
    try{
        let {email,phone, password, name, role} = req.body;
        if(role==null || role   === undefined || role.length ==0){
            role = "user"
        }
        password = await hashPassword(password)
        if(!email || !password || !name || !role || !phone || !password){
            return res.status(400).send({message:"Fill in all form fields"});
        }

        // const existingUser = await getUserByEmail(email)

        // if(existingUser){
        //     return res.status(400).send({message:"User already exists"});
        // }

       const token = generateToken({email: email, name:name})
        const baseUrl = `${process.env.NODEMAILER_BASE_URL}users/${token}`
        await Mailer(email,"Verify Account", baseUrl)

        const user = await Person.create({
            email,phone, name,role, password
        })

        return res.status(200).send({message:"User created successfuly, Email sent to account", data: user})
    } catch(error){
        
        return res.status(400).send({message:"User creation fail", error: error});
        }
}


const verifyEmail = async (req: express.Request, res: express.Response) =>{
    try{
        
        const user = await Person.findOne({
            where:{
                id:req.params.id
            }})
        if(!user){
            return res.status(404).send({message:"Invalid Link"})
        }
     const token = await verificationToken.findOne({where:{token:req.params.token}})
     if(!token){
        return res.status(404).send({message:"Invalid Link"})
    }

    await user.update({ verified:true})
    await user.update({token:"token_checked"})
    res.status(200).send({message:"Email verified"})
    }
    catch(error){
        console.log(error);
    }
}
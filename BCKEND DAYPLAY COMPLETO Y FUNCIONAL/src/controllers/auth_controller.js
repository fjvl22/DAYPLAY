import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Person from '../models/person.js';
import UserPending from "../models/user_pending.js";
import AppUser from "../models/app_user.js";
import Plan from '../models/plan.js';
import sendEmail from '../services/email.service.js';
export const register = async (req, res) => {
    try{
        const { nickname, email, password } = req.body;
        const exists = await Person.findOne({ where: { nickname } });
        if(exists) return res.status(400).json({ error: "Nickname already exists" });
        const hash = await bcrypt.hash(password, 10);
        const person = await Person.create({
            nickname,
            email,
            passwordHash: hash,
            personType: "USER"
        });
        await UserPending.create({personId: person.id});
        await sendEmail(email, "Registro recibido", '', `<h2>Hola ${nickname}</h2><p>Su registro está pendiente de aprobación por nuestros administradores.</p>`);
        res.status(201).json({ message: "Registration successful. Awaiting administrator approval." });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};
export const login = async (req, res) => {
    try{
        const { nickname, password } = req.body;
        const person = await Person.findOne({ where: { nickname } });
        if(!person) return res.status(404).json({ error: "Person not found" });
        const valid = await bcrypt.compare(password, person.passwordHash);
        if(!valid) return res.status(401).json({ error: "Incorrect password" });
        let accountStatus = "PENDING";
        if(person.personType==="ADMIN"){
            accountStatus = "ADMIN";
        }else{
            const appuser = await AppUser.findOne({ where: { personId: person.id } });
            if(!appuser) return res.status(403).json({ message: "User not found" });
            else{
                accountStatus = "USER_APPROVED";
                const userPlan = await Plan.findOne({
                    where: { id: appuser.planId }
                });
                if(!userPlan) return res.status(403).json({ message: "This user has not got an active plan" });
                const token = jwt.sign(
                    { id: appuser.personId, planType: userPlan.planType },
                    process.env.JWT_SECRET,
                    { expiresIn: "1d" }
                );
            }
        }
        person.active = true;
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};
export const forgotPassword = async (req, res) => {
    try{
        const { email } = req.body;
        if(!email) return res.status(400).json({ error: "Email required" });
        const person = await Person.findOne({ where: { email } });
        if(!person) return res.status(404).json({ error: "User not found" });
        const token = jwt.sign(
            { id: person.id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );
        const resetLink = `${process.env.FRONT_URL}/user/change-password?token=${token}`;
        await sendEmail(
            email,
            "Restablecer contraseña",
            '',
            `<h2>Hola ${person.nickname}</h2>
             <p>Haz clic en el enlace para cambiar tu contraseña:</p>
             <a href="${resetLink}">Cambiar contraseña</a>
             <p>Este enlace expira en 15 minutos.</p>`
        );
        res.json({ message: 'Reset link sent to your email.' });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};
export const resetPassword = async (req, res) => {
    try{
        const { token, newPassword } = req.body;
        if(!token || !newPassword) return res.status(400).json({ error: "Missing data" });
        let decoded;
        try{decoded = jwt.verify(token, process.env.JWT_SECRET);}catch{return res.status(401).json({ error: "Invalid or expired token" });}
        const person = await Person.findByPk(decoded.id);
        if(!person) return res.status(404).json({ error: "User not found" });
        person.passwordHash = await bcrypt.hash(newPassword, 10);
        await person.save();
        res.json({ message: "Password pdated successfully" });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};
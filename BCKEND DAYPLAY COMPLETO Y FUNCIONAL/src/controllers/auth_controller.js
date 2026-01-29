import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Person, UserPending, AppUser, Admin } from "../models/index.js";
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
        res.status(201).json({ message: "Registration successful. Awaiting administrator approval." });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};
export const login = async (req, res) => {
    try{
        const { nickname, password } = req.body;
        const person = await Person.findOne({ where: { nickname } });
        if(!person) return res.status(404).json({ error: "User not found" });
        const valid = await bcrypt.compare(password, person.passwordHash);
        if(!valid) return res.status(401).json({ error: "Incorrect password" });
        let accountStatus = "PENDING";
        if(person.personType==="ADMIN"){
            accountStatus = "ADMIN";
        }else{
            const appuser = await AppUser.findOne({ where: { personId: person.id } });
            if(appuser) accountStatus = "USER_APPROVED";
        }
        const token = jwt.sign(
            {
                id: person.id,
                nickname: person.nickname,
                role: person.personType,
                status: accountStatus
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES }
        );
        res.json({ token, status: accountStatus });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};
import bcrypt from 'bcrypt';
import { Person, UserPending } from '../models/index.js';

export const register = async (req, res) => {
    try{
        const { nickname, password, email } = req.body;
        if(!nickname||!password||!email) return res.status(400).json({ message: 'Data is missing' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await Person.create({
            nickname, password: hashedPassword, email, registrationDate: new Date(), active: false, personType: 'USER'
        });
        const newPendingUser = await UserPending.create({
            personId: newUser.id
        });
        res.status(201).json({ message: 'Successfully registered user', userId: newUser.id });
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
    }
};
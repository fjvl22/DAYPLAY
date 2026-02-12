import { Person, AppUser, Admin, UserPending } from '../models/index.js';

export const deleteAccount = async (req, res) => {
    const { id, role, status } = req.user;
    try{
        if(role==="ADMIN") await Admin.destroy({ where: { personId: id } });
        else if(status==="PENDING") await UserPending.destroy({ where: { personId: id } });
        else await AppUser.destroy({ where: { personId: id } });
        await Person.destroy({ where: { id } });
        return res.json({ message: 'Account correctly deleted' });
    }catch(err){
        return res.status(500).json({ error: err.message });
    }
};
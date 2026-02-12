import Plan from '../models/plan.js';

export const checkActivePlan = async (req, res, next) => {
  try{
    const userId = req.user.id;
    const plan = await Plan.findOne({ where: { active: true } });
    if(!plan){
      return res.status(403).json({ message: 'You need an active plan for this action' });
    }
    next();
  }catch(error){
    return res.status(500).json({ error: error.message });
  }
};
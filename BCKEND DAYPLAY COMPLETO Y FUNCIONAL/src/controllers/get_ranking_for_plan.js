import { Leaderboard, UserGame, AppUser, Plan } from '../models/index.js';
export const getRankingByGame = async (req, res) => {
    try{
        const userId = req.user.personId;
        const gameId = req.query.gameId;
        const user = await AppUser.findOne({ where: { personId: userId } });
        const plan = await Plan.findOne({ where: { id: user.planId } });
        if(!plan) return res.status(403).json({ message: 'User without a plan' });
        const planType = plan.planType;
        if(planType==='BASIC'){
            const ranking = await Leaderboard.findAll({
                where: { gameId, userId },
                order: [['score', 'DESC']]
            });
            return res.json(ranking);
        }
        const ranking = await Leaderboard.findAll({
            where: { gameId },
            order: [['score', 'DESC']]
        });
        res.json(ranking);
    }catch(error){
        res.status(500).json({ message: 'Error getting ranking' });
    }
};
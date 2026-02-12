import { Op, fn, col, literal } from 'sequelize';
import { GameMatch, Game } from '../models/index.js';

export async function validateDailyStoryAccess(userId){
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate()-1);
    const totalGames = await Game.count();
    if(totalGames!==4) throw new Error('The system requires exactly 4 active games');
    const countWins = async (date) => {
        return GameMatch.count({
            where: {
                userId,
                score: { [Op.gt]: 0 },
                date: {
                    [Op.between]: [
                        new Date(date.setHours(0, 0, 0, 0)),
                        new Date(date.setHours(23, 59, 59, 999))
                    ]
                }
            },
            distinct: true,
            col: 'gameId'
        });
    };
    const winsToday = await countWins(new Date(today));
    const winsYesterday = await countWins(new Date(yesterday));
    if(winsToday!==4||winsYesterday!==4) return false;
    const failedDay = await GameMatch.findOne({
        where: {
            userId,
            score: { [Op.gt]: 0 },
            date: {
                [Op.gte]: literal('DATE FORMAT(CURDATE(), "%Y-%m-01")')
            }
        },
        attributes: [
            [fn('DAY', col('DATE')), 'day'],
            [fn('COUNT', fn('DISTINCT', col('GAME_ID'))), 'games']
        ],
        group: ['day'],
        having: literal('games < 4')
    });
    return !failedDay;
}
import cron from 'node-cron';
import { activateAllUsersInAllGames } from './controllers/activate_all_users_in_all_games.js';

cron.schedule('0 0 * * *', async () => {
    console.log("Executing scheduled action...");
    await activateAllUsersInAllGames();
});
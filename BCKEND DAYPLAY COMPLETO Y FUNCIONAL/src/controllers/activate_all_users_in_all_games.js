import UserGame from '../models/user_game.js';
const activateAllUsersInAllGames = async () => {
    try{
        await UserGame.update(
            { active:true },
            { where: {} }
        );
        console.log("All activated users ✅");
    }catch(error){
        console.error("Error activating users: ", error);
    }
};

export default activateAllUsersInAllGames;
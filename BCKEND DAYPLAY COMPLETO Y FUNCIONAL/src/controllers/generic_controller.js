import Op from 'sequelize';
import GameMatch from '../models/game_match.js';

export const getAll = (Model) => async (req, res) => {
    try{
        const items = await Model.findAll();
        res.json(items);
    }catch(error){
        console.error("Error in getAll: ", error);
        res.status(500).json({ error: error.message });
    }
};

export const getById = (Model) => async (req, res) => {
    try{
        const item = await Model.findByPk(req.params.id);
        if(!item) return res.status(404).json({ error: "Register not found" });
        res.json(item);
    }catch(error){
        console.error("Error in getById: ", error);
        res.status(500).json({ error: error.message });
    }
};

export const createItem = (Model) => async (req, res) => {
    try{
        if(Model===GameMatch){
            const { userId, gameId } = req.body;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const existing = await GameMatch.findOne({
                where: {
                    userId,
                    gameId,
                    date: {
                        [Op.gte]: today
                    }
                }
            });
            if(existing){
                return res.status(400).json({ error: 'There is already a game scheduled for this user today in this game.' });
            }
        }
        const newItem = await Model.create(req.body);
        res.status(201).json(newItem);
    }catch(error){
        console.error("Error in createItem: ", error);
        res.status(500).json({ error: error.message });
    }
};

export const updateItem = (Model) => async (req, res) => {
    try{
        const item = await Model.findByPk(req.params.id);
        if(!item) return res.status(404).json({ error: "Register not found" });
        await item.update(req.body);
        res.json(item);
    }catch(error){
        console.error("Error in updateItem: ", error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteItem = (Model) => async (req, res) => {
    try{
        const item = await Model.findByPk(req.params.id);
        if(!item) return res.status(404).json({ error: "Register not found" });
        await item.destroy();
        res.json({ message: "Register correctly deleted" });
    }catch(error){
        console.error("Error in deleteItem: ", error);
        res.status(500).json({ error: error.message });
    }
};
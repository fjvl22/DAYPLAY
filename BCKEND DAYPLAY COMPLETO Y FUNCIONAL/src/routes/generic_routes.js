import { Router } from "express";
import {
    getAll,
    getById,
    createItem,
    updateItem,
    deleteItem
} from "../controllers/generic_controller.js";

export const registerRoutes = (routeName, Model) => {
    const router = Router();

    router.get("/", getAll(Model));
    router.get("/:id", getById(Model));
    router.post("/", createItem(Model));
    router.put("/:id", updateItem(Model));
    router.delete("/:id", deleteItem(Model));

    return {
        path: `/api/${routeName}`,
        router
    };
};
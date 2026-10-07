const userService =
    require("../services/UserService");

class UserController {

    async register(req, res, next) {

        try {

            const result =
                await userService.register(
                    req.body
                );

            res.status(201).json(result);

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
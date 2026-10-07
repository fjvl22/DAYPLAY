const registrationService = require('../model/services/registration_service');

class RegistrationController {

    async confirmRegistration(req, res, next) {

        try {

            const result = await registrationService.confirmRegistration(req.body.token);

            res.status(201).json(result);

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new RegistrationController();
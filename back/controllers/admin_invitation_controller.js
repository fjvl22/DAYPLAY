const adminInvitationService = require('../model/services/admin_invitation_service');

class AdminInvitationController {

    async createInvitation(req, res, next) {

        try {

            const result = await adminInvitationService.createInvitation(req.body.email, req.user.id);

            res.status(201).json(result);

        } catch (error) {
            next(error);
        }
    }

    async validateInvitation(req, res, next) {

        try {

            const result = await adminInvitationService.validateInvitation(req.params.token);

            res.status(200).json(result);

        } catch (error) {
            next(error);
        }
    }

    async registerAdmin(req, res, next) {

        try {

            const result = await adminInvitationService.registerAdmin(req.body);

            res.status(201).json(result);

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AdminInvitationController();
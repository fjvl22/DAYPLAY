const { Person, Admin, AppUser, UserPending } = require('../models');

module.exports = async function loadUser(req, res, next) {

  try {

    const personId = req.user.personId;

    const person = await Person.findByPk(personId);

    if (!person || !person.active) {
      return res.status(403).json({ message: 'Inactive person' });
    }

    req.context = {
      person,
      admin: null,
      appUser: null,
      pending: null
    };

    if (person.personType === 'ADMIN') {
      req.context.admin = await Admin.findOne({ where: { personId } });
    }

    req.context.appUser = await AppUser.findByPk(personId);
    req.context.pending = await UserPending.findByPk(personId);

    next();

  } catch (err) {
    next(err);
  }
}
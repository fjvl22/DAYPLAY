// services/systemEvent.service.js
const { SystemEvent } = require('../models');

async function createEvent({
    actorType,
    actorId = null,
    targetType,
    targetId = null,
    eventType,
    category,
    description = null,
    ipAddress = null
}) {
    return SystemEvent.create({
        actorType,
        actorId,
        targetType,
        targetId,
        eventType,
        category,
        description,
        ipAddress
    });
}

module.exports = { createEvent };
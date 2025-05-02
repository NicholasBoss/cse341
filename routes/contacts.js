const routes = require('express').Router();
const contactController = require('../controllers/contactController');

routes.get('/', contactController.getContacts);
routes.get('/:id', contactController.getContactById);

module.exports = routes;
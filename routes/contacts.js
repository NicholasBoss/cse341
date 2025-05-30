const routes = require('express').Router();
const contactController = require('../controllers/contactController');
const util = require('../utilities');
const validate = require('../utilities/validation');

routes.get('/', util.handleErrors(contactController.getContacts));
routes.get('/:id', util.handleErrors(contactController.getContactById));
routes.post('/', validate.validateContact(), util.handleErrors(contactController.createContact));
routes.put('/:id', validate.validateContact(), util.handleErrors(contactController.updateContact));
routes.delete('/:id', util.handleErrors(contactController.deleteContact));

module.exports = routes;
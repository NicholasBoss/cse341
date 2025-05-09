const routes = require('express').Router();
const contactController = require('../controllers/contactController');

routes.get('/', contactController.getContacts);
routes.get('/:id', contactController.getContactById);
routes.get('/buildContact', contactController.buildContact);
routes.post('/createContact', contactController.createContact);
routes.put('/updateContact/:id', contactController.updateContact);
routes.delete('/deleteContact/:id', contactController.deleteContact);

module.exports = routes;
const routes = require('express').Router();
const week1Controller = require('../controllers/week1Controller');
const swagger = require('./swagger');

routes.get('/', week1Controller.nameRoute);
routes.use('/contacts', require('./contacts'));
routes.use('/', swagger);

module.exports = routes;
const routes = require('express').Router();
const week1Controller = require('../controllers/week1Controller');

routes.get('/', week1Controller.nameRoute);

module.exports = routes;
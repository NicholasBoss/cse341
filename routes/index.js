const routes = require('express').Router();
const lesson1Controller = require('../controllers/week1Controller');

routes.get('/', lesson1Controller.nameRoute);

module.exports = routes;
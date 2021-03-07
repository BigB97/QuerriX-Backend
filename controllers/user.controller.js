/* eslint-disable class-methods-use-this */
const UserServ = require('../services/user.service');
const response = require('../utils/response');

class UserContoller {
  async create(req, res) {
    const result = await UserServ.create(req.body);
    res.status(200).send(response('User created', result));
  }

  async getAll(req, res) {
    const result = await UserServ.getAll();
    res.status(200).send(response('All users', result));
  }

  async getOne(req, res) {
    const result = await UserServ.getOne(req.params.userId);
    res.status(200).send(response('User data', result));
  }

  async update(req, res) {
    const result = await UserServ.update(req.params.userId, req.body);
    res.status(200).send(response('User updated', result));
  }

  async delete(req, res) {
    const result = await UserServ.delete(req.params.userId);
    res.status(200).send(response('User deleted', result));
  }

  async userPersona(req, res) {
    const { user } = req;
    const result = await UserServ.userPersona(user, req.body);
    res.status(200).send(response('Persona Created', result));
  }
}

module.exports = new UserContoller();

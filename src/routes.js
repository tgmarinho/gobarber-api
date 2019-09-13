import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Thiago Marinho',
    email: 'tgmarinho@gmail.com',
    password_hash: '1232131',
  });
  return res.json(user);
});

export default routes;

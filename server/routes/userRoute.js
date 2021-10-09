import { Router } from 'express';
import userCtrl from '../controllers/userCtrl';
import auth from '../middleware/auth';

const uRouter = Router()

uRouter.post('/register', userCtrl.register)

uRouter.post('/login', userCtrl.login)

uRouter.get('/logout', userCtrl.logout)

uRouter.get('/refresh_token', userCtrl.refreshToken)

uRouter.get('/infor', auth, userCtrl.getUser)

uRouter.patch('/addcart', auth, userCtrl.addCart)

uRouter.get('/history', auth, userCtrl.history)

export default uRouter 
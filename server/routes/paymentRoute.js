import {Router} from 'express';
import paymentCtrl from '../controllers/paymentCtrl';
import auth from '../middleware/auth';
import authAdmin from '../middleware/authAdmin';

const payRouter = Router()

payRouter.route('/payment')
    .get(auth, authAdmin, paymentCtrl.getPayments)
    .post(auth, paymentCtrl.createPayment)

export default payRouter
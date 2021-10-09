import {Router} from 'express';
import categoryCtrl from '../controllers/categoryCtrl';
import auth from '../middleware/auth';
import authAdmin from '../middleware/authAdmin';

const cRouter = Router()

cRouter.route('/category')
    .get(categoryCtrl.getCategories)
    .post(auth, authAdmin, categoryCtrl.createCategory)

cRouter.route('/category/:id')
    .delete(auth, authAdmin, categoryCtrl.deleteCategory)
    .put(auth, authAdmin, categoryCtrl.updateCategory)

export default cRouter
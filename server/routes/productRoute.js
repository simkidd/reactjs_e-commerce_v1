import {Router} from 'express';
import productCtrl from '../controllers/productCtrl';

const pRouter = Router()

pRouter.route('/products')
    .get(productCtrl.getProducts)
    .post(productCtrl.createProduct)

pRouter.route('/products/:id')
    .delete(productCtrl.deleteProduct)
    .put(productCtrl.updateProduct)

export default pRouter
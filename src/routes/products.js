import { Router } from 'express';

import * as productController from '../controllers/products.js';

import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../utils/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  productAddSchema,
  productUpdateSchema,
} from '../validation/product.js';

const productRoutes = Router();

productRoutes.use(authenticate);

productRoutes.get('/', ctrlWrapper(productController.getProductsController));

productRoutes.get(
  '/:id',
  isValidId,
  ctrlWrapper(productController.getProductByIdController)
);

productRoutes.post(
  '/',
  validateBody(productAddSchema),
  ctrlWrapper(productController.addProductController)
);

productRoutes.put(
  '/:id',
  isValidId,
  validateBody(productAddSchema),
  ctrlWrapper(productController.upsertProductController)
);

productRoutes.patch(
  '/:id',
  isValidId,
  validateBody(productUpdateSchema),
  ctrlWrapper(productController.patchProductController)
);

productRoutes.delete(
  '/:id',
  isValidId,
  ctrlWrapper(productController.deleteProductController)
);

export default productRoutes;

import createError from 'http-errors';

import * as productService from '../services/products.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseProductFilterParams } from '../utils/filters/parseProductFilterParams.js';
import { sortByList } from '../db/models/Products.js';

export const getProductsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
  const filter = parseProductFilterParams(req.query);
  filter.userId = req.user._id;

  const data = await productService.getProducts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully found products!',
    data,
  });
};

export const getProductByIdController = async (req, res) => {
  const { _id: userId } = req.user;
  const { id: _id } = req.params;
  const data = await productService.getProduct({ _id, userId });

  if (!data) {
    throw createError(404, `Product with id=${_id} not found`);
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id=${_id}!`,
    data,
  });
};

export const addProductController = async (req, res) => {
  const { _id: userId } = req.user;
  const product = await productService.addProduct({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: 'Successfully added product!',
    data: product,
  });
};

export const upsertProductController = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: userId } = req.user;
  const { isNew, data } = await productService.updateProduct(
    { _id, userId },
    { ...req.body, userId },
    {
      upsert: true,
    }
  );

  const status = isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Successfully upserted product!',
    data,
  });
};

export const patchProductController = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: userId } = req.user;
  const result = await productService.updateProduct({ _id, userId }, req.body);

  if (!result) {
    throw createError(404, `Product with id=${_id} not found`);
  }

  res.json({
    status: 200,
    message: 'Successfully updated a product!',
    data: result.data,
  });
};

export const deleteProductController = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: userId } = req.user;
  const data = await productService.deleteProduct({ _id, userId });

  if (!data) {
    throw createError(404, `Product with id=${_id} not found`);
  }

  res.sendStatus(204);
};

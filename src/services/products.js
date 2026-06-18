import ProductCollection from '../db/models/Products.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getProducts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * limit;

  const productsQuery = ProductCollection.find(); // отримуємо об'єкт запиту

  if (filter.name !== undefined) {
    productsQuery.where('name').equals(filter.name);
  }

  if (filter.price !== undefined) {
    productsQuery.where('price').equals(filter.price);
  }

  if (filter.category !== undefined) {
    productsQuery.where('category').equals(filter.category);
  }

  if (filter.userId) {
    productsQuery.where('userId').equals(filter.userId);
  }

  const total = await ProductCollection.find()
    .merge(productsQuery)
    .countDocuments(); // countDocuments повертає загальну кількість обєктів

  const data = await productsQuery
    .skip(skip)
    .limit(limit) // пропусти перші skip об'єкта і поверни наступні limit
    .sort({ [sortBy]: sortOrder });

  const paginationData = calcPaginationData({ total, page, perPage });

  return {
    data,
    ...paginationData,
  };
};

export const getProduct = filter => ProductCollection.findOne(filter);

export const getProductById = id => ProductCollection.findById(id);

export const addProduct = productData => ProductCollection.create(productData);

export const updateProduct = async (filter, productData, options = {}) => {
  const { upsert = false } = options;
  const result = await ProductCollection.findOneAndUpdate(
    filter,
    {
      $set: productData,
    },
    {
      new: true,
      upsert,
      includeResultMetadata: true,
    }
  );

  if (!result || !result.value) return null;

  const isNew = Boolean(result.lastErrorObject.upserted);

  return { isNew, data: result.value };
};

export const deleteProduct = id => ProductCollection.findOneAndDelete(id);

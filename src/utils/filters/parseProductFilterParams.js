const parseCategory = value => {
  if (typeof value !== 'string') return;

  const validCategory = ['books', 'electronics', 'clothing', 'other'];

  if (validCategory.includes(value.toLowerCase())) {
    return value.toLowerCase();
  }

  return;
};

export const parseProductFilterParams = ({ category }) => {
  const parsedCategory = parseCategory(category);

  return {
    category: parsedCategory,
  };
};

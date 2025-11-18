export const routesGenerators = (items) => {
  if (!Array.isArray(items)) {
    console.error("Invalid input: routesGenerators expects an array of items.");
    return [];
  }

  const generateRoutes = (items) =>
    items.reduce((acc, item) => {
      if (item.path && item.element) {
        acc.push({ path: item.path, element: item.element });
      }
      if (Array.isArray(item.children)) {
        acc.push(...generateRoutes(item.children));
      }
      return acc;
    }, []);

  return generateRoutes(items);
};

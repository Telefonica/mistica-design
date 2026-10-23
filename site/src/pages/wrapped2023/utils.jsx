export const formatCount = (count) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}k`;
  }
  return count.toString();
};

export const findItemWithHighestCount = (items) => {
  return items.reduce(
    (max, item) => (item.count > max.count ? item : max),
    items[0]
  );
};

export const separateItems = (items, selectedItem) => {
  const restOfItems = items.filter((item) => item !== selectedItem);
  return { selectedItem, restOfItems };
};

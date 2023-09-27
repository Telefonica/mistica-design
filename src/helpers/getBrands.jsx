export const GetBrands = (skinData) => {
  const brandNames = Object.keys(skinData);
  return brandNames.length > 0
    ? brandNames.map((brandName) => ({
        value: brandName,
        text: brandName.charAt(0).toUpperCase() + brandName.slice(1),
      }))
    : [];
};

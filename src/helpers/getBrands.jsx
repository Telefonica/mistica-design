import GetSkin from "./getSkin";

export const GetBrands = (branch = "production") => {
  const { skinData } = GetSkin({ branch: branch });
  const brandNames = Object.keys(skinData);
  return brandNames.length > 0
    ? brandNames.map((brandName) => ({
        value: brandName,
        text: brandName.charAt(0).toUpperCase() + brandName.slice(1),
      }))
    : [];
};

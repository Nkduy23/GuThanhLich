import { Brand } from "../../models";

export const getBrands = async () => {
  return Brand.find().lean();
};

import { db } from "../../../configs/firebase";
import { ProductType } from "../../stripeCircleWebhook.helpers";

export const getOffering = async (productType: ProductType) => {
  const doc = await db.collection("offerings").doc(productType).get();
  return doc.data();
};

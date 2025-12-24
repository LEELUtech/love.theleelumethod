import useSWR from "swr";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { OrderItemType, ProductType } from "@/types";
import { btnStyleKeyType } from "@/components/ui/button";

export interface Product {
  id: string;
  price: string;
  title: string;
  problem: string;
  discover: string[];
  imageUrl: string;
  smallImageUrl?: string;
  solution: string;
}

interface BundleProduct {
  id: string;
  discountPercentage: string;
  price: string;
  specialPrice?: string;
  destinySpecialPrice?: string;
  title: string;
  regularPrice: string;
  imageUrl: string;
  smallImageUrl?: string;
  smallVerticalImageUrl?: string;
  imageVerticalUrl?: string;
}

type ReturnType = {
  products: ProductType[];
  loading: boolean;
  bundleProductData: BundleProduct | undefined;
  orderItems: OrderItemType[];
  error: unknown;
};

const getStyleProperties = (
  id: string,
): {
  backgroundImg: string;
  btnStyleKey?: btnStyleKeyType;
  cardColor: string;
} => {
  const styleMap: Record<
    string,
    { backgroundImg: string; btnStyleKey: btnStyleKeyType; cardColor: string }
  > = {
    destiny: {
      backgroundImg: "bgDestiny",
      btnStyleKey: "blue",
      cardColor: "#277BDA",
    },
    money: {
      backgroundImg: "bgMoney",
      btnStyleKey: "green",
      cardColor: "#129442",
    },
    karmic: {
      backgroundImg: "bgKarmic",
      btnStyleKey: "orange",
      cardColor: "#DD8500",
    },
    weaknesses: {
      backgroundImg: "bgWeaknesses",
      btnStyleKey: "purple",
      cardColor: "#8F30D3",
    },
  };

  const style = styleMap[id];
  return {
    backgroundImg: style?.backgroundImg ?? "bgDefault",
    btnStyleKey: style?.btnStyleKey,
    cardColor: style?.cardColor,
  };
};

const orderItemProps = [
  {
    id: "destiny",
    selected: false,
    selectedStyle:
      "bg-gradient-to-r from-stone-900/20 to-blue-200/40 border border-blue-400",
  },
  {
    id: "karmic",
    selected: false,
    selectedStyle:
      "bg-gradient-to-r from-stone-900/20 to-orange-200/40 border border-orange-400",
  },
  {
    id: "weaknesses",
    selected: false,
    selectedStyle:
      "bg-gradient-to-r from-stone-900/20 to-purple-200/40 border border-purple-400",
  },
  {
    id: "money",
    selected: false,
    selectedStyle:
      "bg-gradient-to-r from-stone-900/20 to-green-200/40 border border-green-400",
  },
];

const fetchProducts = async (): Promise<(Product | BundleProduct)[]> => {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (Product | BundleProduct)[];
};

export const useProducts = (): ReturnType => {
  const { data, error, isLoading } = useSWR("products", fetchProducts);

  const isProduct = (item: Product | BundleProduct): item is Product => {
    return "problem" in item && "solution" in item && "discover" in item;
  };

  const bundleProductData = data?.find((item) => !isProduct(item));
  const productsWithStyles = data
    ?.filter((item): item is Product => item.id !== "bundle" && isProduct(item))
    .map((product) => ({
      ...product,
      ...getStyleProperties(product.id),
    }));

  const orderItems = orderItemProps.map((orderItem) => {
    const matchingProduct = productsWithStyles?.find(
      (product) => product.id === orderItem.id,
    );
    return {
      ...orderItem,
      title: matchingProduct?.title || "",
      price: Number(matchingProduct?.price.replace("$", "") || 0),
      image: matchingProduct?.smallImageUrl ?? "/images/order/orderDestiny.png",
    };
  });

  return {
    products: productsWithStyles ?? [],
    loading: isLoading,
    bundleProductData: bundleProductData as BundleProduct,
    orderItems: orderItems as OrderItemType[],
    error,
  };
};

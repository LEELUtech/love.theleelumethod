"use client";

import React, { useEffect } from "react";
import useProductStore from "@/store/useProductStore";

type Props = {
  ids: string[];
  children: React.ReactNode;
};

// Preloads product data before rendering children
export default function ProgramPreloader({ ids, children }: Props) {
  const preloadProducts = useProductStore((s) => s.preloadProducts);

  useEffect(() => {
    preloadProducts(ids);
  }, [preloadProducts, ids]);

  return <>{children}</>;
}

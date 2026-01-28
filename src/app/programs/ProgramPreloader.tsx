"use client";

import React, { useEffect, useMemo } from "react";
import useProductStore from "@/store/useProductStore";

type Props = {
  ids: string[];
  children: React.ReactNode;
};

export default function ProgramPreloader({ ids, children }: Props) {
  const preloadProducts = useProductStore((s) => s.preloadProducts);

  const key = useMemo(() => ids.slice().sort().join("|"), [ids]);

  useEffect(() => {
    preloadProducts(ids);
  }, [preloadProducts, key]);

  return <>{children}</>;
}

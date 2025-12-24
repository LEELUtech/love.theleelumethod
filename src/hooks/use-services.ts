import useSWR from "swr";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Service {
  id: string;
  price: string;
  title: string;
  description: string;
  btnTitle: string;
  imageUrl: string;
}

const fetchServices = async (): Promise<Service[]> => {
  const snapshot = await getDocs(collection(db, "services"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Service[];
};

export const useServices = () => {
  const { data, error, isLoading } = useSWR("services", fetchServices);

  return {
    services: data ?? [],
    loading: isLoading,
    error,
  };
};

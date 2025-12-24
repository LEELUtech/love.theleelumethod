import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProgramType } from "@/types";

export const useProgramData = (videoId: string | undefined) => {
  const [data, setData] = useState<ProgramType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!videoId) return;
      setIsLoading(true);

      try {
        const programDocRef = doc(db, "programs", videoId);
        const programSnapshot = await getDoc(programDocRef);

        if (programSnapshot.exists()) {
          setData(programSnapshot.data() as ProgramType);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [videoId]);

  return { data, dataLoading: isLoading };
};

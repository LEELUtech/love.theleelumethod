
import { useCallback } from "react";
import { getProgramId, sendFreeReport } from "@/lib/firebaseFunctions";
import { WEBINAR_URL } from "@/utils/constants";
import type { UserFormValues } from "@/components/ui/userModal/UserForm";

export function useFreeReport() {
					       const handleFreeReport = useCallback(
						       async (values: UserFormValues) => {
							       const videoId = await getProgramId(values.dateOfBirth);
							       const allProductIds = ["destiny", "karmic", "weaknesses", "money"];
							       const productIds = [allProductIds[Math.floor(Math.random() * allProductIds.length)]];

							       await sendFreeReport({
								       to: values.email,
								       productIds,
								       webinarUrl: WEBINAR_URL,
								       userData: {
									       dateOfBirth: values.dateOfBirth,
									       gender: values.gender,
									       videoId: videoId,
									       name: values.name ?? "",
									       email: values.email,
								       },
							       });
						       },
						       []
					       );

	return { handleFreeReport };
}

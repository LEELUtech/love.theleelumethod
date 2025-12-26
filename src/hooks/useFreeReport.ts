
import { useCallback } from "react";
import { getProgramId, sendFreeReport } from "@/lib/firebaseFunctions";
import { WEBINAR_URL } from "@/utils/constants";
import type { UserFormValues } from "@/components/ui/userModal/UserForm";

export function useFreeReport() {
			       const handleFreeReport = useCallback(
				       async (values: UserFormValues) => {
					       let dateOfBirth: string | undefined = undefined;
					       if (values.dateOfBirth) {
						       if (typeof values.dateOfBirth === 'string') {
							       dateOfBirth = values.dateOfBirth;
						       } else if (values.dateOfBirth instanceof Date) {
							       dateOfBirth = values.dateOfBirth.toISOString();
                   }
					       }
					       const videoId = await getProgramId(dateOfBirth);
					       const productIds = ["destiny"];

					       await sendFreeReport({
						       to: values.email,
						       productIds,
						       webinarUrl: WEBINAR_URL,
						       userData: {
							       dateOfBirth,
							       gender: values.gender,
							       videoId,
							       name: values.name ?? "",
							       email: values.email,
						       },
					       });
				       },
				       []
			       );

	return { handleFreeReport };
}

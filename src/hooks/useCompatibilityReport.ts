import { useCallback } from "react";
import { sendCompatibilityReport } from "@/lib/firebaseFunctions";
import type { CompatibilityFormValues } from "@/components/ui/forms/CompatibilityForm";

export function useCompatibilityReport() {

	const handleCompatibilityReport = useCallback(
		async (values: CompatibilityFormValues) => {
			const birthDate1 = values.dateOfBirth1;
			const birthDate2 = values.dateOfBirth2;
			const name1 = values.name1 ?? "";
			const name2 = values.name2 ?? "";

			await sendCompatibilityReport({
				email: values.email,
				birthDate1,
				birthDate2,
				name1,
				name2,
			});
		},
		[]
	);

	return { handleCompatibilityReport };
}

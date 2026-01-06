"use client";
import UserDataModal from "@/components/ui/modals/UserDataModal";
import PillButton from "@/components/ui/buttons/PillButton";

interface JoinProgramButtonProps {
	text?: string;
}

export default function JoinProgramButton({ text = "Join Program" }: JoinProgramButtonProps) {
	return (
		<UserDataModal
			trigger={(open) => (
				<PillButton onClick={open} type="button">
					<span>{text}</span>
				</PillButton>
			)}
			title="Join Program"
		/>
	);
}

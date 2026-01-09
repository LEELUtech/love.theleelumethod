import React from "react";

export type RelationshipTriageCardProps = {
	backgroundClass: string;
	icon: React.ReactNode;
	title: string;
	cta: React.ReactNode;
	children: React.ReactNode;
	className?: string;
};

export default function RelationshipTriageCard({
	backgroundClass,
	icon,
	title,
	cta,
	children,
	className,
}: RelationshipTriageCardProps) {
	return (
		<div
			className={`flex h-full flex-col rounded-[18px] px-8 py-10 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-[#e9e9e9] ${backgroundClass} ${className ?? ""}`}
		>
			<div className="mx-auto mb-6">{icon}</div>
			<h3 className="font-canela text-2xl text-center mb-6 tracking-[0.04em] text-[#1f1f1f] font-normal" >
				{title}
			</h3>
			<div className="font-figtree text-base leading-relaxed text-[#2f2f2f] space-y-3">{children}</div>
			<div className="mt-auto">{cta}</div>
		</div>
	);
}

function CheckoutSectionLoader({ text = "Initializing payment..." }: { text?: string }) {
	return (
		<div className="absolute inset-0 z-20 flex items-center justify-center rounded-[32px] bg-white/70 backdrop-blur-[2px]">
			<div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
				<span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black/60" />
				<p className="font-lato text-sm text-[#41444E]">{text}</p>
			</div>
		</div>
	);
}

export default CheckoutSectionLoader;
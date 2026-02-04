"use client";

import React, { useEffect, useRef } from "react";

type SlowVideoProps = {
	src: string;
	className?: string;
	playbackRate?: number;
};

export default function SlowVideo({
	src,
	className = "",
	playbackRate = 0.5,
}: SlowVideoProps) {
	const ref = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (ref.current) {
			ref.current.playbackRate = playbackRate;
		}
	}, [playbackRate]);

	return (
		<video
			ref={ref}
			src={src}
			autoPlay
			muted
			loop
			playsInline
			className={className}
		/>
	);
}

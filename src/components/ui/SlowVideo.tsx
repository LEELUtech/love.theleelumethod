"use client";

import React, { useEffect, useRef } from "react";

type SlowVideoProps = {
	src: string;
	className?: string;
	playbackRate?: number;
	skipSlowVideo?: boolean;
};

export default function SlowVideo({
	src,
	className = "",
	playbackRate = 0.5,
	skipSlowVideo = false,
}: SlowVideoProps) {
	const ref = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (ref.current) {
			ref.current.playbackRate = skipSlowVideo ? 1 : playbackRate;
		}
	}, [playbackRate, skipSlowVideo]);

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

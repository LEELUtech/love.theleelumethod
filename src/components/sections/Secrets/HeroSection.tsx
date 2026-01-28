"use client";
import ArcAutoOnce from "@/components/ui/ArcFlyOnce";
import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import { sendFreeGuideEmail } from "@/lib/firebaseFunctions";
import Image from "next/image";
import React from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SecretsHeroSection() {
	const [firstName, setFirstName] = React.useState("");
	const [email, setEmail] = React.useState("");

	const [submitting, setSubmitting] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const [success, setSuccess] = React.useState(false);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(false);

		const fn = firstName.trim();
		const em = email.trim();

		if (!fn) return setError("Please enter your first name.");
		if (!em || !emailRegex.test(em))
			return setError("Please enter a valid email.");

		setSubmitting(true);
		try {
			const res = await sendFreeGuideEmail({ firstName: fn, email: em });
			if (!res?.success)
				throw new Error("Email was not sent. Please try again.");

			setSuccess(true);
			setFirstName("");
			setEmail("");
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Something went wrong. Please try again.");
			}
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<section
			className="relative bg-cover bg-center bg-no-repeat"
			style={{ backgroundImage: "url(/images/bg/sand-bg.jpg)" }}
		>
			<Header />

			<div className="container pt-8 pb-16 md:pt-12 md:pb-20 lg:pt-16 lg:pb-[112px]">
				<div className="relative flex flex-col items-center justify-center w-full text-center gap-4 md:gap-5 lg:gap-6">
					<div className="relative flex flex-col items-center gap-3 md:gap-4 mt-4 md:mt-5 lg:mt-6">
						<div className="relative w-[278px] h-[290px] md:w-[220px] md:h-[240px] lg:w-[288px] lg:h-[290px]">
							<Image
								src="/images/resources-section-1.png"
								alt="Woman smiling in a red sweater"
								fill
								priority
								quality={100}
							/>

							<ArcAutoOnce
								className="absolute inset-0 -z-0 -translate-y-[15%] pointer-events-none -translate-x-[2%]"
								endAt={0.9}
								flightStart={0.2}
								durMs={1500}
								startDelayMs={500}
								arrowRotateDeg={254}
								arrowScale={0.8}
								arrowCenterX={6.5}
								arrowCenterY={-6}
								arrowOffsetY={3}
								arcRx={220}
								arcRy={208}
							/>

							<div className="absolute left-1/2 -translate-x-1/2 bottom-[-25px] md:bottom-[-30px] lg:bottom-[-35px] flex items-center justify-center bg-[#C4334F] rounded-[300px] w-[74px] h-[102px] z-10">
								<Image
									src="/leelu_logo.svg"
									alt=""
									width={46}
									height={46}
									className="filter invert"
								/>
							</div>
						</div>
					</div>

					<div className="mt-6 px-4 md:px-0">
						<h1 className="font-canela text-[48px] lg:text-[60px] font-light leading-[130%] text-black">
							<span className="text-[#BD2E45] italic mr-2">7 Secrets</span> to
							Mend a Broken Heart
						</h1>
						<p className="text-body mt-3 md:text-lg text-[#5A5757] font-lato font-medium leading-[26px]">
							This guide gives you 7 evidence-based strategies to reclaim your
							nervous system and your life.
						</p>
					</div>

					<form
						onSubmit={onSubmit}
						className="w-full md:max-w-[360px] lg:max-w-[384px] px-4 md:px-0"
					>
						<input
							type="text"
							name="firstName"
							placeholder="First Name"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							className="w-full rounded-md border border-[#E3D6CF] bg-white px-4 py-3 text-base text-[#1A0F0A] placeholder:text-[#5A5757] placeholder:text-lg outline-none"
						/>

						<input
							type="email"
							name="email"
							placeholder="Email Address"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full mt-4 rounded-md border border-[#E3D6CF] bg-white px-4 py-3 text-base text-[#1A0F0A] placeholder:text-[#5A5757] placeholder:text-lg outline-none"
						/>

						<Button
							variant="primary"
							size="md"
							className="w-full mt-4"
							loading={submitting}
							disabled={submitting}
							type="submit"
						>
							DOWNLOAD THE FREE GUIDE
						</Button>

						{error ? (
							<p className="mt-3 text-sm font-lato text-red-600">{error}</p>
						) : null}
						{success ? (
							<p className="mt-3 text-sm font-lato text-green-700">
								Sent! Check your inbox.
							</p>
						) : null}
					</form>
				</div>
			</div>
		</section>
	);
}

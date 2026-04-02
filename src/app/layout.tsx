import { Suspense } from "react";
import localFont from "next/font/local";
import { Figtree, Inter, Lato, Marcellus, Playfair_Display } from "next/font/google";
import "./globals.css";
import UTMTracker from "@/components/ui/UTMTracker"
import SalesIQScript from "@/components/ui/SalesIQScript"
import PageTracker from "@/components/ui/PageTracker"
import EngagementTracker from "@/components/ui/EngagementTracker"
import SessionScoreTracker from "@/components/ui/SessionScoreTracker"

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});

const playfair = Playfair_Display({
	weight: ["400", "600", "700"],
	subsets: ["latin"],
	variable: "--font-playfair",
	display: "swap",
});

const lato = Lato({
  weight: [
    "100",
    "300",
    "400", 
    "700", 
    "900"  
  ],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
});

const figtree = Figtree({
	weight: ["400", "600", "700"],
	subsets: ["latin"],
	variable: "--font-figtree",
	display: "swap",
});

const marcellus = Marcellus({
	weight: ["400", ],
	subsets: ["latin"],
	variable: "--font-marcellus",
	display: "swap",
});

const canela = localFont({
	src: [
		{ path: "./_fonts/CanelaTrial/Canela-Thin-Trial.otf", weight: "100", style: "normal" },
		{ path: "./_fonts/CanelaTrial/Canela-Light-Trial.otf", weight: "300", style: "normal" },
		{ path: "./_fonts/CanelaTrial/Canela-Regular-Trial.otf", weight: "400", style: "normal" },
		{ path: "./_fonts/CanelaTrial/Canela-Medium-Trial.otf", weight: "500", style: "normal" },
		{ path: "./_fonts/CanelaTrial/Canela-Bold-Trial.otf", weight: "700", style: "normal" },
		{ path: "./_fonts/CanelaTrial/Canela-Black-Trial.otf", weight: "900", style: "normal" },
	],
	variable: "--font-canela",
	display: "swap",
});

export const metadata = {
	title: "Love | The Leelu Method",
	description: "Stop guessing. Start calculating. The Leelu Method is relationship intelligence built on numerology and behavioral science. Decode your patterns. Find love.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={`${inter.variable} ${playfair.variable} ${figtree.variable} ${lato.variable} ${marcellus.variable} ${canela.variable}`}
		>
			<body className="antialiased">
				<UTMTracker />
				<SalesIQScript />
				<Suspense fallback={null}>
					<PageTracker />
				</Suspense>
				<Suspense fallback={null}>
					<EngagementTracker />
				</Suspense>
				<SessionScoreTracker />
				{children}
			</body>
		</html>
	);
}

import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";

const OnePageLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<Header className="bg-white z-30 relative max-w-[1600px] mx-auto" />
			<main>{children}</main>
			<Footer />
		</>
	);
};

export default OnePageLayout;

import React from "react";
import WebinarSection from "@/components/sections/Webinar/WebinarSection";
import WebinarContentSection from "@/components/sections/Webinar/WebinarContentSection";
import Footer from "@/components/ui/Footer";
import WebinarDiscoverSection from "@/components/sections/Webinar/WebinarDiscoverSection";
import WebinarWhatIfSection from "@/components/sections/Webinar/WebinarWhatIfSection";
import WebinarHeyImLilySection from "@/components/sections/Webinar/WebinarHeyImLilySection";

const WebinarPage = () => {
	return (
		<main>
			<WebinarSection />
			<WebinarContentSection />
			<WebinarWhatIfSection />
			<WebinarDiscoverSection />
			<WebinarHeyImLilySection />
			<Footer />
		</main>
	);
};

export default WebinarPage;

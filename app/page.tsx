import BentoGrid from "@/components/common/BentoGrid";
import Demo from "@/components/common/Demo";
import Footer from "@/components/common/Footer";
import Hero from "@/components/common/Hero";

import Navbar from "@/components/common/Navbar";
import Pricing from "@/components/common/Pricing";
import Reviews from "@/components/common/Reviews";

export default function Home() {
  return (
    <div className="px-3 flex justify-center flex-col gap-12 items-center">
      <Navbar />
      <Hero />
      <Demo />
      <BentoGrid />
      <Reviews />
      <Pricing />
      <Footer />
    </div>
  );
}

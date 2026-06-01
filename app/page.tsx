import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Method } from "@/components/Method";
import { Integrations } from "@/components/Integrations";
import { PublicSector } from "@/components/PublicSector";
import { PrivateSector } from "@/components/PrivateSector";
import { Compliance } from "@/components/Compliance";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <Method />
        <Integrations />
        <PublicSector />
        <PrivateSector />
        <Compliance />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

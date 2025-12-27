"use client";

import Navbar from "@/components/hi-main/components/Navbar";
import Hero from "@/components/hi-main/components/Hero";
import CityScene from "@/components/hi-main/components/CityScene";
import HeritageBackground from "@/components/hi-main/components/HeritageBackground";
import DurgaLiving from "@/components/hi-main/components/DurgaLiving";
import AitijyaBucket from "@/components/hi-main/components/AitijyaBucket";
import HeritageHighlights from "@/components/hi-main/components/HeritageHighlights";
import Contact from "@/components/hi-main/components/Contact";

export default function Home() {
  return (
    <>
      <HeritageBackground />
      <Navbar />
      <main>
        <Hero />
        <CityScene />
        <DurgaLiving />
        <AitijyaBucket />
        <HeritageHighlights />
        <Contact />
      </main>
    </>
  );
}

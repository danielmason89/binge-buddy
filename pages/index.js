import Head from "next/head";
// import Link from "next/link";
import HeroSection from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Binge Buddy</title>
        <meta
          name="description"
          content="Binge Buddy, your buddy with the best suggestions on what to binge."
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
        />
      </Head>
      <main>
        <HeroSection />
        <Features />
        <Testimonials />
      </main>
    </div>
  );
}

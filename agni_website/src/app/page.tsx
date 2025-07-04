'use client';

import Head from "next/head";
import Image from "next/image";
import Navbar from "./components/navbar";
import Hero from "./components/hero";
import ScrollVelocity from './components/scrollVelocity';
import WhyThisMatters from "./components/Problem_statement";
import Failures from "./components/failures";
import Future from "./components/future";
import Solutions from "./components/Solution";
import Why from "./components/why";
import Benefits from "./components/benefits";
import ContactForm from "./components/contactForm"
import AgniLoader from "./components/loading";
import HeroNew from "./components/hero_new"
import dynamic from 'next/dynamic';



export default function Home() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
      <Hero />
      {/* <ScrollVelocity
        texts={['Agni Robotics ', 'Seed the change Rule the game']} 
        velocity={100} 
        className="custom-scroll-text pb-4 bg-white"
      /> */}
      <WhyThisMatters />
      <Failures />
      <Future />  
      <Solutions />      
      <Why />
      <Benefits />
      <ContactForm />

      {/* <AgniLoader /> */}

        {/* <HeroNew /> */}
      {/* <VerticalCarousel cards={carouselData} autoRotateInterval={2000} /> */}

      {/* <main className="min-h-screen bg-neutral-100 dark:bg-neutral-950">
        <UpliftingCards />
      </main> */}
    </>
  );
}

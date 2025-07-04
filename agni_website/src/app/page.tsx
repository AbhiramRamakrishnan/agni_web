'use client';

import Head from "next/head";
import Image from "next/image";
import Navbar from "./components/navbar";
import Hero from "./components/hero";
import WhyThisMatters from "./components/Problem_statement";
import Failures from "./components/failures";
import Future from "./components/future";
import Solutions from "./components/Solution";
import Why from "./components/why";
import Benefits from "./components/benefits";
import ContactForm from "./components/contactForm"
import dynamic from 'next/dynamic';



export default function Home() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
      <Hero />
      <WhyThisMatters />
      <Failures />
      <Future />  
      <Solutions />      
      <Why />
      <Benefits />
      <ContactForm />

    
    </>
  );
}

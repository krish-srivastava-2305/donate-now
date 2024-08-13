"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Guide from "@/components/Guide";
import { Nav } from "@/components/Navbar";

export default function AuroraBackgroundDemo() {
  const router = useRouter();

  const donorGuideInfo = [
    {
      title: "Donor SignUp",
      description:
        "Register yourself to be part of an elite community that likes to take care of their fellow brothers and sisters.",
      content: (
        <div className="flex flex-col items-center justify-center w-full h-full gap-6 p-6 duration-300 ease-in-out">
          <h1 className="text-2xl font-bold text-center md:text-4xl dark:text-white">
            Registration
          </h1>
          <p className="text-lg font-semibold text-left text-pretty">
            Register to be part of a community that cares for others.
          </p>
          <Image
            src="https://res.cloudinary.com/dd0168zpx/image/upload/v1723469912/Screenshot_2024-08-12_190721_zwccx8.png"
            alt="Signup page"
            height={500}
            width={500}
            className="rounded-lg shadow-lg"
          />
        </div>
      ),
    },
    {
      title: "Email Verification",
      description:
        "We heavily depend on email service so it is mandatory for users to verify their email before donating.",
      content: (
        <div className="flex flex-col items-center justify-center w-full h-full gap-6 p-6 duration-300 ease-in-out">
          <h1 className="text-2xl font-bold text-center md:text-4xl dark:text-white">
            Email Verification
          </h1>
          <p className="text-lg font-semibold text-left text-pretty">
            Email verification is mandatory to ensure secure and reliable communication.
          </p>
          <Image
            src="https://res.cloudinary.com/dd0168zpx/image/upload/v1723482133/Screenshot_2024-08-12_223030_upaxve.png"
            alt="Email Verification"
            height={500}
            width={500}
            className="rounded-lg shadow-lg"
          />
        </div>
      ),
    },
    {
      title: "Start Helping!!!",
      description:
        "Once registered and verified, donors can view requests, add donations, and delete donations with a simple click.",
      content: (
        <div className="flex flex-col items-center justify-center w-full h-full gap-6 p-6 duration-300 ease-in-out">
          <h1 className="text-2xl font-bold text-center md:text-4xl dark:text-white">
            Start Donating...
          </h1>
          <p className="text-lg font-semibold text-left text-pretty">
            After verification, you can start helping by managing donations easily.
          </p>
          <Image
            src="https://res.cloudinary.com/dd0168zpx/image/upload/v1723482704/Screenshot_2024-08-12_224116_dwgpc6.png"
            alt="Start Donating"
            height={500}
            width={500}
            className="rounded-lg shadow-lg"
          />
        </div>
      ),
    },
    {
      title: "Contacting and Helping...",
      description:
        "Once your donation is live, users can send you a request on your email where you can verify their income and get in touch.",
      content: (
        <div className="flex flex-col items-center justify-center w-full h-full gap-6 p-6 duration-300 ease-in-out">
          <h1 className="text-2xl font-bold text-center md:text-4xl dark:text-white">
            Contacting and Helping...
          </h1>
          <p className="text-lg font-semibold text-left text-pretty">
            Users can contact you through email to verify their income and coordinate the donation.
          </p>
          <Image
            src="https://res.cloudinary.com/dd0168zpx/image/upload/v1723482133/Screenshot_2024-08-12_223030_upaxve.png"
            alt="Contacting and Helping"
            height={500}
            width={500}
            className="rounded-lg shadow-lg"
          />
        </div>
      ),
    },
  ];

  return (
    <AuroraBackground>
      <Nav />
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4 h-[100vh]"
      >
        <div className="text-3xl font-bold text-center md:text-7xl dark:text-white">
          Donations are cool, you know.
        </div>
        <div className="py-4 text-base font-extralight text-center md:text-4xl dark:text-neutral-200">
          And this website is the catalyst for it.
        </div>
        <div className="flex justify-between w-52 h-10 items-center">
          <a
            href="#donor"
            className="px-4 py-2 text-white duration-500 ease-in-out bg-black rounded-full hover:bg-white hover:text-black dark:bg-white dark:text-black font-semibold"
          >
            Donor
          </a>
          <a
            href="#receiver"
            className="px-4 py-2 text-white duration-500 ease-in-out bg-black rounded-full hover:bg-white hover:text-black dark:bg-white dark:text-black font-semibold"
          >
            Receiver
          </a>
        </div>
      </motion.div>
      <div
        id="donor"
        className="z-10 mt-8 h-[100vh] w-[98.5vw] overflow-hidden scrollbar-hide"
      >
        <div className="h-1/5 p-4 text-2xl font-bold text-center text-black md:text-7xl">
          Donor Guide
        </div>
        <Guide content={donorGuideInfo} />
      </div>

      <div
        id="receiver"
        className="z-10 mt-8 h-[100vh] w-[98.5vw] overflow-hidden scrollbar-hide"
      >
        <div className="h-1/5 p-4 text-2xl font-bold text-center text-black md:text-7xl">
          Receiver Guide
        </div>
        <Guide content={donorGuideInfo} />
      </div>
    </AuroraBackground>
  );
}

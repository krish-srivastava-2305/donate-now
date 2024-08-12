"use client";
import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import toast from "react-hot-toast";
import axios from "axios";

type itemType = {
  name: string;
  description: string;
  image?: string;
  _id: string;
  donor: string;
};

type props = {
  cards: Array<itemType>;
  images: boolean;
};

export function ExpandableCard({ cards, images }: props) {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null
  );
  const [request, setRequest] = useState<string>('Request')
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  const sendRequest = async (donorId: string) => {
    setRequest("Requesting")
    try {
      const res = await axios.post('/api/sendRequest', { donorId });
      toast.success("Request sent successfully");
    } catch (error) {
      toast.error("Error sending request");
    }
    setRequest("Request")
  };

  useEffect(() => {
    console.log(cards);
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.name}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.name}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              {images && (
                <motion.div layoutId={`image-${active.name}-${id}`}>
                  <Image
                    priority
                    width={200}
                    height={200}
                    src={active.image || "/default-image.jpg"}
                    alt={active.name}
                    className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                  />
                </motion.div>
              )}
              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="flex flex-col w-full">
                    <motion.h3
                      layoutId={`name-${active.name}-${id}`}
                      className="font-bold pb-8 text-neutral-700 dark:text-neutral-200 text-base"
                    >
                      {active.name}
                    </motion.h3>
                    {images && (
                      <motion.button
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => sendRequest(active.donor)}
                        className="px-4 py-3 w-24 text-sm rounded-full font-bold bg-green-500 text-white"
                      >
                        {request}
                      </motion.button>
                    )}
                  </div>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {active.description}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="mx-auto w-full grid grid-cols-2 md:grid-cols-4 items-start gap-4">
        {cards.map((card) => (
          <motion.div
            layoutId={`card-${card.name}-${id}`}
            key={card._id}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col w-full">
              {images && (
                <motion.div layoutId={`image-${card.name}-${id}`}>
                  <Image
                    width={100}
                    height={100}
                    src={card.image || "/default-image.jpg"}
                    alt={card.name}
                    className="h-60 w-full rounded-lg object-cover object-top"
                  />
                </motion.div>
              )}
              <div className="flex justify-center items-center flex-col">
                <motion.h3
                  layoutId={`name-${card.name}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-base"
                >
                  {card.name}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-base"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

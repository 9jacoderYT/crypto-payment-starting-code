"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Telegram } from "@mui/icons-material";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";

export default function SectionOne() {
  const ref = useRef(null);
  const isInView = useInView(ref);
  return (
    <div ref={ref}>
      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-lg md:px-24 lg:px-8 lg:py-20">
        <div className="flex flex-col justify-between lg:flex-row">
          <div className="mb-12 lg:max-w-lg lg:pr-5 lg:mb-0">
            <div className="max-w-xl mb-6">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: isInView ? 1 : 0 }}
                transition={{ duration: 1, ease: "easeIn", delay: 0.5 }}
                className="max-w-lg mb-6 text-3xl font-bold tracking-tight text-white sm:text-6xl sm:leading-none"
              >
                Welcome to FreeTradeTutor Premium membership page
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                className="text-base text-white md:text-2xl"
              >
                Join our Premium Telegram Channel
              </motion.p>

              <div className="flex flex-row gap-5 py-3">
                <motion.a
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
                  href="https://t.me/tradetutor01_bot?start=start"
                  target="_blank"
                  className="inline-block font-bold text-center uppercase align-middle cursor-pointer select-none px-8 text-sm leading-[50px] text-white transition-all duration-400 ease-out rounded shadow-lg bg-gradient-to-r from-[#c90075] via-[#de00ac] to-[#c90075] bg-[length:200%] bg-left hover:bg-right hover:transition-all hover:duration-500 hover:delay-100"
                >
                  <SupportAgentIcon className="my-auto mr-2" />
                  Support Team
                </motion.a>

                <motion.a
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
                  href="https://t.me/tradetutor01_bot"
                  target="_blank"
                  className="inline-block font-bold text-center uppercase align-middle cursor-pointer select-none px-8 text-sm leading-[50px] text-white transition-all duration-400 ease-out rounded shadow-lg bg-gradient-to-r from-[#0065e8] via-[#11a2f1] to-[#0065e8] bg-[length:200%] bg-left hover:bg-right hover:transition-all hover:duration-500 hover:delay-100"
                >
                  Subscribe now <Telegram />
                </motion.a>
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -30 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
            className="text-center lg:w-2/5"
          >
            <div>
              <div className="p-8 bg-gray-900 rounded">
                <div className="mb-4 text-center">
                  <p className="text-xl font-medium tracking-wide text-white">
                    Pro Plan
                  </p>
                  <div className="flex items-center justify-center">
                    <p className="mr-2 text-5xl font-semibold text-white lg:text-6xl">
                      $99.99
                    </p>
                    <p className="text-lg text-gray-500">/ month</p>
                  </div>
                </div>
                <ul className="mb-8 space-y-2">
                  <li className="flex items-center">
                    <div className="mr-3">
                      <VerifiedIcon className="text-teal-400" />
                    </div>
                    <p className="font-medium text-gray-300">
                      Exculsive Content
                    </p>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3">
                      <SupportAgentIcon className="text-teal-400" />
                    </div>
                    <p className="font-medium text-gray-300">Direct Support</p>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3">
                      <SystemUpdateAltIcon className="text-teal-400" />
                    </div>
                    <p className="font-medium text-gray-300">Early Updates</p>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3">
                      <GroupsIcon className="text-teal-400" />
                    </div>
                    <p className="font-medium text-gray-300">
                      Community Access
                    </p>
                  </li>
                </ul>
                <a
                  href="#payment"
                  type="submit"
                  className="inline-flex items-center justify-center w-full h-12 px-6 font-semibold tracking-wide text-teal-900 transition duration-200 rounded shadow-md bg-teal-400 hover:bg-teal-700 focus:shadow-outline focus:outline-none"
                >
                  Get Now
                </a>
              </div>
              <div className="w-11/12 h-2 mx-auto bg-gray-900 rounded-b opacity-75" />
              <div className="w-10/12 h-2 mx-auto bg-gray-900 rounded-b opacity-50" />
              <div className="w-9/12 h-2 mx-auto bg-gray-900 rounded-b opacity-25" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

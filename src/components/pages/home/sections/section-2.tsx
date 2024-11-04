"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SupportAgent, Telegram, Verified } from "@mui/icons-material";
import GroupsIcon from "@mui/icons-material/Groups";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";

export default function SectionTwo() {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <div ref={ref} id="about">
      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -50 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
            className="max-w-lg mb-6 italic text-3xl font-bold leading-none tracking-tight text-white sm:text-4xl md:mx-auto"
          >
            Join Our Premium Telegram Channel{" "}
            <Telegram className="text-blue-600" />
          </motion.h2>
          <p className="text-base text-white md:text-lg">
            Get exclusive insights, early updates, and direct support as a
            premium member
          </p>
        </div>

        <div className="grid gap-4 row-gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -50 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
            className="flex flex-col justify-between p-1 md:p-5 border border-[#ffc107] rounded shadow-sm"
          >
            <div>
              <div className="flex items-center justify-center w-16 h-16 md:mb-4">
                <Verified className="text-[#ffc107] text-3xl" />
              </div>
              <h6 className="mb-2 font-bold leading-5 text-white text-xl">
                Exclusive Content
              </h6>
              <p className="mb-3 text-sm text-white">
                Access unique insights available only to members.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
            className="flex flex-col justify-between p-1 md:p-5 border border-[#ffc107] rounded shadow-sm"
          >
            <div>
              <div className="flex items-center justify-center w-16 h-16 md:mb-4">
                <SupportAgent className="text-[#ffc107] text-3xl" />
              </div>
              <h6 className="mb-2 font-bold leading-5 text-white text-xl">
                Direct Support
              </h6>
              <p className="mb-3 text-sm text-white">
                One-one-one support from our team.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -50 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.9 }}
            className="flex flex-col justify-between p-1 md:p-5 border border-[#ffc107] rounded shadow-sm"
          >
            <div>
              <div className="flex items-center justify-center w-16 h-16 md:mb-4 ">
                <SystemUpdateAltIcon className="text-[#ffc107] text-3xl" />
              </div>
              <h6 className="mb-2 font-bold leading-5 text-white text-xl">
                Early Updates
              </h6>
              <p className="mb-3 text-sm text-white">
                Priority access to updates and resources.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 1.2 }}
            className="flex flex-col justify-between p-1 md:p-5 border border-[#ffc107] rounded shadow-sm"
          >
            <div>
              <div className="flex items-center justify-center w-16 h-16 md:mb-4 ">
                <GroupsIcon className="text-[#ffc107] text-3xl" />
              </div>
              <h6 className="mb-2 font-bold leading-5 text-white text-xl">
                Community Access
              </h6>
              <p className="mb-3 text-sm text-white">
                Join a network of like-minded subscribers
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

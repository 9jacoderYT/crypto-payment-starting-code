"use client";

import PaymentSection from "./payment";
import SectionOne from "./sections/section-1";
import SectionTwo from "./sections/section-2";
import { Faq } from "./sections/section-4";

export default function HomeComponent() {
  return (
    <div>
      <div
        style={{
          backgroundImage:
            "url(https://gfxpartner.com/Crypten/assets/dark/assets/images/banner-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="py-24"
      >
        <SectionOne />
      </div>

      <SectionTwo />

      <div className="max-w-xl md:mx-auto sm:text-center lg:max-w-2xl">
        <h2 className="max-w-lg mb-6 italic text-3xl font-bold leading-none tracking-tight text-white sm:text-4xl md:mx-auto">
          TradeTutor Membership Subscription
        </h2>
        <p className="text-base text-white md:text-lg">
          Please read through the steps provided, then begin the payment process
        </p>
      </div>
      <PaymentSection />

      <Faq />
    </div>
  );
}

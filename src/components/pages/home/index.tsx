"use client";

import PaymentSection from "./payment";

export default function HomeComponent() {
  return (
    <div>
      <div className="mx-auto text-center pt-12">
        <img
          src="https://avatars.githubusercontent.com/u/117041814?v=4"
          className="rounded-xl w-24 mx-auto"
        />
        <br />
        <h1 className="text-2xl text-white italic">
          9jacoder Crypto Payment System
        </h1>
        <div className="mx-auto max-w-xl flex flex-row justify-center my-5">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/640px-Instagram_logo_2022.svg.png"
            className="h-8 my-auto"
          />
          <a
            href="https://www.instagram.com/9jacoder.backup/"
            className="my-auto text-teal-300 italic ml-2 font-bold text-2xl"
          >
            @9jacoder
          </a>
        </div>

        <div className="mx-auto max-w-xl flex flex-row justify-center my-5">
          <img
            src="https://play-lh.googleusercontent.com/6am0i3walYwNLc08QOOhRJttQENNGkhlKajXSERf3JnPVRQczIyxw2w3DxeMRTOSdsY"
            className="h-8 my-auto rounded-lg"
          />
          <a
            href="https://www.youtube.com/@9jaCoder"
            className="my-auto text-teal-300 italic ml-2 font-bold text-2xl"
          >
            @9jacoder
          </a>
        </div>

        <div className="mx-auto max-w-xl flex flex-row justify-center my-5">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/X_logo.jpg/1200px-X_logo.jpg"
            className="h-8 my-auto rounded-lg"
          />
          <a
            href="https://x.com/9jacoder"
            className="my-auto text-teal-300 italic ml-2 font-bold text-2xl"
          >
            @9jacoder
          </a>
        </div>
      </div>

      <PaymentSection />
    </div>
  );
}

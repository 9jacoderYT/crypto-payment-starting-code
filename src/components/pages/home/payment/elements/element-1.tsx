"use client";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import { CheckCircle, Refresh } from "@mui/icons-material";

export default function ElementOne() {
  return (
    <>
      <div className="lg:py-6 lg:pr-16 flex-1 text-white">
        <div className="flex">
          <div className="flex flex-col items-center mr-4">
            <div>
              <div className="flex items-center justify-center w-10 h-10 border rounded-full">
                <SmartToyIcon className="text-[#ffc107]" />
              </div>
            </div>
            <div className="w-px h-full bg-gray-300" />
          </div>
          <div className="pt-1 pb-8">
            <p className="mb-2 text-lg font-bold text-white">Step 1</p>
            <p className="text-white">Enter how much you want to pay.</p>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-col items-center mr-4">
            <div>
              <div className="flex items-center justify-center w-10 h-10 border rounded-full">
                <MyLocationIcon className="text-[#ffc107]" />
              </div>
            </div>
            <div className="w-px h-full bg-gray-300" />
          </div>
          <div className="pt-1 pb-8">
            <p className="mb-2 text-lg font-bold text-white">Step 2</p>
            <div>
              Select what crypto currency and network you want to use
              <div className=" flex flex-row">
                <span className="">UsDt </span>

                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7yr98Y--6f6k2wPKHVa1hRqfND0GtgCyw_g&s"
                  className="h-6 mx-1 rounded-full animate-pulse"
                />
                <big className="italic mx-2">BSC(BEP20) Chain</big>
              </div>
              <div className=" flex flex-row">
                <span className="">BnB</span>

                <img
                  src="https://s2.coinmarketcap.com/static/img/coins/200x200/1839.png"
                  className="h-6 mx-1 rounded-full animate-pulse"
                />
                <big className="italic mx-2">BSC(BEP20) Chain</big>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-col items-center mr-4">
            <div>
              <div className="flex items-center justify-center w-10 h-10 border rounded-full">
                <LocalAtmIcon className="text-[#ffc107]" />
              </div>
            </div>
            <div className="w-px h-full bg-gray-300" />
          </div>
          <div className="pt-1 pb-8">
            <p className="mb-2 text-lg font-bold">Step 3</p>
            <p>
              Transfer the exact crypto amount that is generated to the wallet
              address provided, on the network that was shown.
            </p>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-col items-center mr-4">
            <div>
              <div className="flex items-center justify-center w-10 h-10 border rounded-full">
                <Refresh className="text-[#ffc107]" />
              </div>
            </div>
            <div className="w-px h-full bg-gray-300" />
          </div>
          <div className="pt-1 pb-8">
            <p className="mb-2 text-lg font-bold">Step 4</p>
            <p>
              Paste the Transaction Hash of your transfer, to the field
              provided, and click "
              <big className="italic text-teal-400">
                I have made the payment
              </big>
              "
            </p>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-col items-center mr-4">
            <div>
              <div className="flex items-center justify-center w-10 h-10 border rounded-full">
                <CheckCircle className="text-[#ffc107]" />
              </div>
            </div>
          </div>
          <div className="pt-1">
            <p className="mb-2 text-lg font-bold">Success</p>
            <p>The website will inform you if your payment was validated</p>
          </div>
        </div>
      </div>
    </>
  );
}

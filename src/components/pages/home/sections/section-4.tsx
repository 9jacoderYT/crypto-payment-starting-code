import React, { useState, ReactNode } from "react";

interface ItemProps {
  title: string;
  children: ReactNode;
}

const Item: React.FC<ItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="border rounded shadow-sm">
      <button
        type="button"
        aria-label="Open item"
        title="Open item"
        className="flex items-center justify-between w-full p-4 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="text-lg font-medium text-white">{title}</p>
        <div className="flex items-center justify-center w-8 h-8 border rounded-full">
          <svg
            viewBox="0 0 24 24"
            className={`w-3 text-white transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          >
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeMiterlimit="10"
              points="2,7 12,17 22,7"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="p-4 pt-0">
          <p className="text-white">{children}</p>
        </div>
      )}
    </div>
  );
};

export const Faq: React.FC = () => {
  return (
    <div
      id="faq"
      className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20"
    >
      <div className="max-w-xl sm:mx-auto lg:max-w-2xl">
        <div className="flex flex-col mb-16 sm:text-center">
          <div className="max-w-xl md:mx-auto sm:text-center lg:max-w-2xl">
            <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-white sm:text-4xl md:mx-auto italic">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-white md:text-lg">
              Some questions asked by our community.
              <br />
              In case of extra support, please contact us via email at
              <a
                href="mailto:freetradementorship@gmail.com"
                className="text-teal-400 mx-2"
              >
                freetradementorship@gmail.com
              </a>
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <Item title="How long does my membership remain active?">
            Membership is valid for 30 days, after which you will be
            automatically removed from the group unless you renew.
          </Item>
          <Item title="Can I make a payment from my Bybit or KuCoin account?">
            Yes, you can make payments from your Bybit or KuCoin account. Just
            ensure you select the BSC (BEP20) network and enter the correct
            wallet address.
          </Item>
          <Item title="Do you accept Bitcoin payments?">
            Currently, we only accept payments in USDT or BNB to ensure fast and
            seamless transactions.
          </Item>
          <Item title="What should I do if there's an issue with my transfer?">
            No worries! Our support team is available 24/7. Just reach out, and
            we’ll help resolve any issues with your transfer.
          </Item>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import "./EnvelopeGreetingCard.css";
import { BrowserView, MobileView, TabletView } from "react-device-detect";
export default function EnvelopeGreetingCard({
  fbimg,
  message,
  occassion,
  totext,
  fromtext,
}) {
  const [mainclass, setmainclass] = useState("new");
  const handlechangeclass = () => {
    if (mainclass === "new") {
      setmainclass("open");
    }
  };
  return (
    <div className="envelopecardbody">
      <div
        onClick={() => {
          handlechangeclass();
        }}
        className={`envelope ${mainclass} `}
      >
        <div class="EnvelopeGreetingCardfront">
          <div class="EnvelopeGreetingCardmail">
            <p>{occassion}</p>
            <p>Click me</p>
          </div>
        </div>
        <div class="EnvelopeGreetingCardback">
          <div
            style={{
              backgroundImage: "url(" + fbimg + ")",
            }}
            class="EnvelopeGreetingCardletter"
          >
            <p> {message} </p>
            <p>{fromtext}</p>
            <p>{totext}</p>
            <div class="EnvelopeGreetingCardbox">
              <div class="EnvelopeGreetingCardcake">
                <div class="EnvelopeGreetingCardcandle">
                  <div class="EnvelopeGreetingCardfire"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="EnvelopeGreetingCardflip left-EnvelopeGreetingCardflip"></div>
          <div class="EnvelopeGreetingCardflip right-EnvelopeGreetingCardflip"></div>
          <div class="EnvelopeGreetingCardflip bottom-EnvelopeGreetingCardflip"></div>
          <div class="EnvelopeGreetingCardflip top-EnvelopeGreetingCardflip"></div>
        </div>
      </div>
    </div>
  );
}

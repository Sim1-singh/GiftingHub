import React, { useState, useEffect } from "react";
import "./ThreeDCarousel.css";

export default function ThreeDCarousel({
  fbimg1,
  fbimg2,
  fbimg3,
  fbimg4,
  fbimg5,
  fbimg6,
  text,
}) {
  const [odrag, setodrag] = useState();
  const [ospin, setospin] = useState();
  const [aImg, setaImg] = useState([]);
  // You can change global variables here:
  var radius = 240; // how big of the radius

  useEffect(() => {
    setodrag(document.getElementById("drag-container"));
    setospin(document.getElementById("spin-container"));
    setaImg(document.getElementsByClassName("threedCarouselImg"));
  }, []);
  setTimeout(init, 100);

  var aEle = [...aImg]; // combine 2 arrays

  // // Size of ground - depend on radius
  // var ground = document.getElementById("ground");
  // ground.style.width = radius * 3 + "px";
  // ground.style.height = radius * 3 + "px";

  function init(delayTime) {
    for (var i = 0; i < aEle.length; i++) {
      aEle[i].style.transform =
        "rotateY(" + i * 60 + "deg) translateZ(" + radius + "px)";
      aEle[i].style.transition = "transform 1s";
      aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
    }
  }

  // function applyTranform(obj) {
  //   // Constrain the angle of camera (between 0 and 180)
  //   if (tY > 180) tY = 180;
  //   if (tY < 0) tY = 0;

  //   // Apply the angle
  //   obj.style.transform = "rotateX(" + -tY + "deg) rotateY(" + tX + "deg)";
  // }

  // function playSpin(yes) {
  //   ospin.style.animationPlayState = yes ? "running" : "paused";
  // }

  // var sX,
  //   sY,
  //   nX,
  //   nY,
  //   desX = 0,
  //   desY = 0,
  //   tX = 0,
  //   tY = 10;

  // // setup events
  // document.onpointerdown = function (e) {
  //   clearInterval(odrag.timer);
  //   e = e || window.event;
  //   var sX = e.clientX,
  //     sY = e.clientY;

  //   this.onpointermove = function (e) {
  //     e = e || window.event;
  //     var nX = e.clientX,
  //       nY = e.clientY;
  //     desX = nX - sX;
  //     desY = nY - sY;
  //     tX += desX * 0.1;
  //     tY += desY * 0.1;
  //     applyTranform(odrag);
  //     sX = nX;
  //     sY = nY;
  //   };

  //   this.onpointerup = function (e) {
  //     odrag.timer = setInterval(function () {
  //       desX *= 0.95;
  //       desY *= 0.95;
  //       tX += desX * 0.1;
  //       tY += desY * 0.1;
  //       applyTranform(odrag);
  //       playSpin(false);
  //       if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
  //         clearInterval(odrag.timer);
  //         playSpin(true);
  //       }
  //     }, 17);
  //     this.onpointermove = this.onpointerup = null;
  //   };

  //   return false;
  // };

  document.onmousewheel = function (e) {
    e = e || window.event;
    var d = e.wheelDelta / 20 || -e.detail;
    radius += d;
    init(1);
  };
  return (
    <div id="ThreeDCarouseldiv">
      <div id="drag-container">
        <div style={{ height: "170px", width: "120px" }} id="spin-container">
          <img className="threedCarouselImg" src={fbimg1} alt="" />
          <img className="threedCarouselImg" src={fbimg2} alt="" />
          <img className="threedCarouselImg" src={fbimg3} alt="" />
          <img className="threedCarouselImg" src={fbimg4} alt="" />
          <img className="threedCarouselImg" src={fbimg5} alt="" />
          <img className="threedCarouselImg" src={fbimg6} alt="" />
          <p>{text}</p>
        </div>
        <div
          style={{ height: radius * 3 + "px", width: radius * 3 + "px" }}
          id="ground"
        ></div>
      </div>
    </div>
  );
}

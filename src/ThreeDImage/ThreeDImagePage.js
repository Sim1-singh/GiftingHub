import { makeStyles } from "@material-ui/core/styles";
import FlightTakeoffIcon from "@material-ui/icons/FlightTakeoff";
import GradientIcon from "@material-ui/icons/Gradient";
import ImageIcon from "@material-ui/icons/Image";
import ShareIcon from "@material-ui/icons/Share";
import VisibilityIcon from "@material-ui/icons/Visibility";
import React, { useState } from "react";
import { BrowserView } from "react-device-detect";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";
import Tour from "reactour";
import { v4 as uuidv4 } from "uuid";
import "../Buttons.css";
import firebase, { storage } from "../firebase";
import NavBar from "../NavBars/NavBar";
import HeaderBtn from "../Studio/HeaderBtn";
import Copy from "../Utils/Copy";
import CropPage from "../Utils/CropPage";
import Share from "../Utils/Share";
import ThreeDImage from "./ThreeDImage";
const secuseStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(0),
    },
  },
  input: {
    display: "none",
  },
}));

function ThreeDImagePage() {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const secclasses = secuseStyles();
  const [showshare, setshowshare] = useState(false);
  const [livelink, setlivelink] = useState();
  const [previewlink, setpreviewlink] = useState("");
  const [fireurl, setFireUrl] = useState("");
  const [imageAsFile, setImageAsFile] = useState("");
  const [image_url, setimage_url] = useState();
  const [opencrop, setopencrop] = useState(false);
  const [send, setsend] = useState();
  const [loading, setloading] = useState(false);
  const [fbimg, setfbimg] = useState(
    "https://firebasestorage.googleapis.com/v0/b/update-image.appspot.com/o/imp%2Fspiderfor3D.jpg?alt=media&token=82409f17-8360-41e0-ac89-086bee0297bc"
  );
  const [firstcol, setfirstcol] = useState("#C28484");
  const [secondcol, setsecondcol] = useState("#1c1008");
  const [color, setColor] = useState({});
  const [accentColor, setaccentColor] = useState("#70cff3");
  const [showoptions, setshowoptions] = useState(false);
  const onSelectFile = (e) => {
    setsend(window.URL.createObjectURL(e.target.files[0]));

    setopencrop(true);
  };

  const handleFireBaseUpload = () => {
    setloading(true);
    var ud = uuidv4();
    console.log(ud);

    const uploadTask = storage
      .ref(`/images/${imageAsFile.name}`)
      .put(imageAsFile);
    if (!livelink) {
      const todoRef = firebase.database().ref("ThreeDImage");
      const todo = {
        url: fbimg,
        firstcol: firstcol,
        secondcol: secondcol,
      };
      var newKey = todoRef.push(todo).getKey();
      setlivelink("http://update-image.web.app/live/threedimage/" + newKey);
      setpreviewlink("/live/threedimage/" + newKey);

      setloading(false);
    } else {
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (err) => {
          //catches the errors
          console.log(err);
        },
        () => {
          console.log(image_url);
          var s = storage
            .ref("images")
            .child(ud)
            .putString(image_url, "base64", { contentType: "image/jpg" })
            .then((savedImage) => {
              savedImage.ref.getDownloadURL().then((downUrl) => {
                console.log(downUrl, "downurl");
                setFireUrl(downUrl);
                const todoRef = firebase.database().ref("ThreeDImage");
                const todo = {
                  url: downUrl,
                  firstcol: firstcol,
                  secondcol: secondcol,
                };
                var newKey = todoRef.push(todo).getKey();
                setlivelink("http://update-image.web.app/live/threedimage/" + newKey);
                setpreviewlink("/live/threedimage/" + newKey);
              });
              setloading(false);
            });
        }
      );
    }
  };
  const tourConfig = [
    {
      selector: '[data-tut="reactour__changeImage"]',
      content: `Choose an image from you local device to be displayed on the 3D tiles.`,
    },
    {
      selector: '[data-tut="reactour__gradient"]',
      content: `Colors mean more to the eye than what it sees. Use these options to select the appropriate gradient range for the background.`,
    },
    {
      selector: '[data-tut="reactour__generatelink"]',
      content: `Tada! Almost done, do generate the link for enabling the various sharing options.`,
    },

    {
      selector: '[data-tut="reactour__preview"]',
      content: `Previews the component  created in a new page.`,
    },
    {
      selector: '[data-tut="reactour__copylink"]',
      content: `Copies the generated live link to clipboard.`,
    },
    {
      selector: '[data-tut="reactour__sharelink"]',
      content: `Displays options to share the live link on Facebook, WhatsApp, Twitter and Email.`,
    },
  ];
  return (
    <div>
      <NavBar />
      <div>
        {" "}
        <Tour
          onRequestClose={() => {
            setIsTourOpen(false);
          }}
          steps={tourConfig}
          isOpen={isTourOpen}
          maskClassName="mask"
          className="helper"
          rounded={5}
          accentColor={accentColor}
        />
      </div>
      <br />
      <br />
      <br />

      <div class="container-fluid pt-3 px-0">
        <div class="row editpageseditarea">
          <div class="  col-lg-9  mb-3 px-0">
            <ThreeDImage
              firstcol={firstcol}
              secondcol={secondcol}
              fbimg={fbimg}
            />
          </div>

          <div className=" editpagesrightnav   col-lg-3   mb-3">
            <BrowserView>
              <center>
                <div
                  style={{
                    justifyContent: "center",
                    padding: "20px 0 0 0 ",
                  }}
                >
                  <span style={{ color: "#ffffff" }}>
                    {" "}
                    Hello! Allow us to give you a small tour on how to generate
                    this special gift. We are sure you wouldn't need one the
                    next time you are back.
                    <br /> P.S : Its that easy
                  </span>
                  <HeaderBtn
                    handleClick={() => {
                      setIsTourOpen(true);
                    }}
                    Icon={FlightTakeoffIcon}
                    title=" Start Tour "
                  />
                </div>
              </center>
              <hr />
            </BrowserView>

            <div style={{ justifyContent: "center" }}>
              <center>
                <div data-tut="reactour__changeImage">
                  <input
                    style={{ display: "none" }}
                    accept="image/* "
                    className={secclasses.input}
                    id="LocalfileInput"
                    name="LocalfileInput"
                    type="file"
                    accept="image/*"
                    onChange={onSelectFile}
                    onClick={(event) => {
                      event.target.value = null;
                    }}
                  />
                  {opencrop ? (
                    <CropPage
                      send={send}
                      setfbimg={setfbimg}
                      setimage_url={setimage_url}
                      aspect_ratio={4 / 3}
                      opencrop={opencrop}
                      setopencrop={setopencrop}
                    />
                  ) : null}
                  <label htmlFor="LocalfileInput">
                    <HeaderBtn Icon={ImageIcon} title="Change  image " />
                  </label>
                </div>
                <div data-tut="reactour__gradient">
                  <input
                    type="color"
                    id="FirstColor"
                    initialValue={firstcol}
                    value={firstcol}
                    onChange={(e) => {
                      setfirstcol(e.target.value);
                    }}
                    placement="right"
                    autoAdjust="true"
                    style={{
                      margin: "auto",
                      visibility: "hidden",
                      position: "relative",
                      display: "flex",
                      height: "5px",
                    }}
                  />
                  <label htmlFor="FirstColor">
                    <HeaderBtn
                      Icon={GradientIcon}
                      title="Gradient Left Color"
                    />
                  </label>
                  <input
                    type="color"
                    id="ToColor"
                    initialValue={secondcol}
                    value={secondcol}
                    onChange={(e) => {
                      setsecondcol(e.target.value);
                    }}
                    placement="right"
                    autoAdjust="true"
                    style={{
                      margin: "auto",
                      visibility: "hidden",
                      position: "relative",
                      display: "flex",
                      height: "5px",
                    }}
                  />
                  <label htmlFor="ToColor">
                    <HeaderBtn
                      Icon={GradientIcon}
                      title="Gradient Right Color"
                    />
                  </label>
                </div>

                <center data-tut="reactour__generatelink">
                  <div style={{ marginTop: "20px" }}>
                    <button
                      onClick={() => {
                        handleFireBaseUpload();
                        setshowoptions(true);
                      }}
                      className="main-button"
                      data-tut="reactour__generatelink"
                    >
                      Generate Link
                    </button>
                  </div>
                </center>
                {loading ? (
                  <Loader
                    type="BallTriangle"
                    color="#00BFFF"
                    height={100}
                    width={100}
                  />
                ) : (
                  <center>
                    {livelink || isTourOpen ? (
                      <div>
                        <div
                          data-tut="reactour__preview"
                          style={{ marginTop: "20px" }}
                        >
                          <Link class="logo" to={previewlink} target="_blank">
                            <HeaderBtn Icon={VisibilityIcon} title="Preview " />
                          </Link>
                        </div>
                        <div
                          data-tut="reactour__copylink"
                          style={{ marginTop: "20px", width: "200px" }}
                        >
                          <Copy livelink={livelink} />
                        </div>
                        {!showshare ? (
                          <div
                            data-tut="reactour__sharelink"
                            style={{ marginTop: "20px" }}
                          >
                            <HeaderBtn
                              handleClick={() => {
                                setshowshare(true);
                              }}
                              Icon={ShareIcon}
                              title="Share "
                            />
                          </div>
                        ) : (
                          <Share livelink={livelink} />
                        )}
                      </div>
                    ) : null}
                  </center>
                )}
              </center>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThreeDImagePage;

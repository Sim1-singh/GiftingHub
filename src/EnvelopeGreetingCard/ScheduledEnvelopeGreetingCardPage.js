import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core/styles";
import CreateIcon from "@material-ui/icons/Create";
import ImageIcon from "@material-ui/icons/Image";
import VisibilityIcon from "@material-ui/icons/Visibility";
import React, { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Tour from "reactour";
import { v4 as uuidv4 } from "uuid";
import "../Buttons.css";
import firebase, { storage } from "../firebase";
import HeaderBtn from "../Studio/HeaderBtn";
import Copy from "../Utils/Copy";
import CropPage from "../Utils/CropPage";
import EnvelopeGreetingCard from "./EnvelopeGreetingCard";
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

function ScheduledEnvelopeGreetingCardPage({
  step,
  slug,
  getDoc,
  isTourOpen,
  setTourOpend,
}) {
  const [accentColor, setaccentColor] = useState("#70cff3");
  let { edit } = useSelector((state) => ({ ...state }));
  const [Cloading, setCLoading] = useState(false);
  const [loading, setloading] = useState(false);
  const database = firebase.firestore();
  const secclasses = secuseStyles();
  const [showshare, setshowshare] = useState(false);
  const [livelink, setlivelink] = useState();
  const [previewlink, setpreviewlink] = useState("");
  const [fireurl, setFireUrl] = useState("");
  const [imageAsFile, setImageAsFile] = useState("");
  const [image_url, setimage_url] = useState();
  const [opencrop, setopencrop] = useState(false);
  const [send, setsend] = useState();
  const { user } = useSelector((state) => ({ ...state }));

  const [message, setmessage] = useState(
    "Sending you love for every moment of your big day"
  );
  const [occassion, setoccassion] = useState("Happy Birthday !!!");
  const [totext, settotext] = useState("HBD Older Sis !!!");
  const [fromtext, setfromtext] = useState("I am...");
  const [fbimg, setfbimg] = useState(
    "https://images.unsplash.com/photo-1476234251651-f353703a034d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
  );
  const [showoptions, setshowoptions] = useState(false);
  useEffect(() => {
    setCLoading(true);
    if (edit.text != "") {
      const todoRef = firebase
        .database()
        .ref("/EnvelopeGreetingCard/" + edit.text)
        .once("value")
        .then((snapshot) => {
          var img = snapshot.val().url;
          setfbimg(img);

          var msg = snapshot.val().message;
          setmessage(msg);
          var occn = snapshot.val().occassion;
          setoccassion(occn);
          var to_nam = snapshot.val().totext;
          settotext(to_nam);
          var from_nam = snapshot.val().fromtext;
          setfromtext(from_nam);
          setCLoading(false);
        });
    } else {
      setCLoading(false);
    }
  }, []);
  const onSelectFile = (e) => {
    setsend(window.URL.createObjectURL(e.target.files[0]));
    setshowoptions(false);
    setopencrop(true);
  };

  const handleFireBaseUpload = async () => {
    setloading(true);
    var ud = uuidv4();
    console.log(ud);
    const uploadTask = await storage
      .ref(`/images/${imageAsFile.name}`)
      .put(imageAsFile);
    if (edit.text != "") {
      const todoRef = firebase
        .database()
        .ref("EnvelopeGreetingCard/" + edit.text);
      const todo = {
        url: fbimg,
        message: message,
        occassion: occassion,
        totext: totext,
        fromtext: fromtext,
      };
      todoRef.update(todo);
      setlivelink(
        "http://update-image.web.app/scheduledlive/envelopegreetingcard/" +
          edit.text +
          "/" +
          slug
      );
      setpreviewlink(
        "/scheduledlive/envelopegreetingcard/" + edit.text + "/" + slug
      );

      setloading(false);
    } else if (!livelink) {
      const todoRef = firebase.database().ref("EnvelopeGreetingCard");
      const todo = {
        url: fbimg,
        message: message,
        occassion: occassion,
        totext: totext,
        fromtext: fromtext,
      };
      var newKey = await todoRef.push(todo).getKey();
      setlivelink(
        "http://update-image.web.app/scheduledlive/envelopegreetingcard/" +
          newKey +
          "/" +
          slug
      );
      setpreviewlink(
        "/scheduledlive/envelopegreetingcard/" + newKey + "/" + slug
      );
      const snapshot = await database
        .collection("n-day-pack")
        .doc(`${user.uid}`)
        .collection("giftshub")
        .doc(slug)
        .get();
      const data = snapshot.data().array_data;
      const newdata = data;
      newdata[step].url =
        "http://update-image.web.app/scheduledlive/envelopegreetingcard/" +
        newKey +
        "/" +
        slug;
      await database
        .collection("n-day-pack")
        .doc(`${user.uid}`)
        .collection("giftshub")
        .doc(slug)
        .update(
          {
            array_data: newdata,
          },
          { merge: true }
        );
      await database.collection("Livelinks").doc(slug).update(
        {
          array_data: newdata,
        },
        { merge: true }
      );
      toast.success("Envelope Greeting Card successfully added to your pack");
      getDoc();
      setloading(false);
    }
    {
      edit.text != "" &&
        toast.success("Envelope Greeting Card updated successfully");
    }
  };
  async function EditPack() {}

  const tourConfig = [
    {
      selector: '[data-tut="reactour__changeImage"]',
      content: `Choose the image from you local device to be  printed onto the greeting card`,
    },

    {
      selector: '[data-tut="reactour__to"]',
      content: ` Enter the special person’s name `,
    },
    {
      selector: '[data-tut="reactour__from"]',
      content: ` Enter your name
      `,
    },
    {
      selector: '[data-tut="reactour__message"]',
      content: `We all love short and cute messages, so pour your heart but pay attention to the word limit!`,
    },
    {
      selector: '[data-tut="reactour__occasion"]',
      content: `Wishings for the special occasion`,
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
      selector: '[data-tut="reactour__addtopack"]',
      content: `Adds this component to the n-day pack you created`,
    },
    {
      selector: '[data-tut="reactour__updatepack"]',
      content: `Updates this component with the changes you made in the n-day pack.`,
    },
    {
      selector: '[data-tut="reactour__sharelink"]',
      content: `Displays options to share the live link on Facebook, WhatsApp, Twitter and Email.`,
    },
  ];

  return (
    <div>
      <Tour
        onRequestClose={() => {
          setTourOpend(false);
        }}
        steps={tourConfig}
        isOpen={isTourOpen}
        maskClassName="mask"
        className="helper"
        rounded={5}
        accentColor={accentColor}
      />

      <div class="container-fluid pt-3 px-0">
        <div class="row editpageseditarea">
          <div class="  col-lg-9 px-0 mb-3">
            {Cloading ? (
              <Loader
                type="BallTriangle"
                color="#fdc674"
                height={100}
                width={100}
              />
            ) : (
              <div>
                <EnvelopeGreetingCard
                  fbimg={fbimg}
                  message={message}
                  occassion={occassion}
                  totext={totext}
                  fromtext={fromtext}
                />
              </div>
            )}
          </div>

          <div className="editpagesrightnav col-lg-3 mb-3">
            <div style={{ padding: "20px 0", justifyContent: "center" }}>
              <center>
                <div data-tut="reactour__changeImage">
                  <input
                    style={{ display: "none" }}
                    accept="image/* "
                    className={secclasses.input}
                    id="LocalfileInput"
                    name="LocalfileInput"
                    multiple
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
                      aspect_ratio={2 / 3}
                      opencrop={opencrop}
                      setopencrop={setopencrop}
                    />
                  ) : null}
                  <label htmlFor="LocalfileInput">
                    <HeaderBtn Icon={ImageIcon} title="Change  image " />
                  </label>
                </div>
                <center>
                  <div
                    data-tut="reactour__to"
                    style={{ width: "200px" }}
                    className="RightSideBar2__Btn"
                  >
                    <CreateIcon
                      style={{
                        margin: "0 10px 0 5px",
                        color: "#ffffff",
                        fontSize: "large",
                      }}
                    />
                    <InputBase
                      className="RightSideBar2__Btn"
                      multiline
                      style={{
                        color: "#068dc0",
                        margin: "0",
                        backgroundColor: "#ffffff",
                        width: "200px",
                      }}
                      value={totext}
                      onChange={(e) => {
                        settotext(e.target.value);
                        setshowoptions(false);
                      }}
                    />
                  </div>
                  <div
                    data-tut="reactour__from"
                    style={{ width: "200px" }}
                    className="RightSideBar2__Btn"
                  >
                    <CreateIcon
                      style={{
                        margin: "0 10px 0 5px",
                        color: "#ffffff",
                        fontSize: "large",
                      }}
                    />
                    <InputBase
                      className="RightSideBar2__Btn"
                      multiline
                      style={{
                        color: "#068dc0",
                        margin: "0",
                        backgroundColor: "#ffffff",
                        width: "200px",
                      }}
                      value={fromtext}
                      onChange={(e) => {
                        setfromtext(e.target.value);
                        setshowoptions(false);
                      }}
                    />
                  </div>
                  <div
                    data-tut="reactour__message"
                    style={{ width: "200px" }}
                    className="RightSideBar2__Btn"
                  >
                    <CreateIcon
                      style={{
                        margin: "0 10px 0 5px",
                        color: "#ffffff",
                        fontSize: "large",
                      }}
                    />
                    <InputBase
                      className="RightSideBar2__Btn"
                      multiline
                      style={{
                        color: "#068dc0",
                        margin: "0",
                        backgroundColor: "#ffffff",
                        width: "200px",
                      }}
                      value={message}
                      onChange={(e) => {
                        setmessage(e.target.value);
                        setshowoptions(false);
                      }}
                    />
                  </div>
                  <div
                    data-tut="reactour__occasion"
                    style={{ width: "200px" }}
                    className="RightSideBar2__Btn"
                  >
                    <CreateIcon
                      style={{
                        margin: "0 10px 0 5px",
                        color: "#ffffff",
                        fontSize: "large",
                      }}
                    />
                    <InputBase
                      className="RightSideBar2__Btn"
                      multiline
                      style={{
                        color: "#068dc0",
                        margin: "0",
                        backgroundColor: "#ffffff",
                        width: "200px",
                      }}
                      value={occassion}
                      onChange={(e) => {
                        setoccassion(e.target.value);
                        setshowoptions(false);
                      }}
                    />
                  </div>
                </center>
                <center>
                  {loading ? (
                    <Loader
                      type="BallTriangle"
                      color="#00BFFF"
                      height={100}
                      width={100}
                    />
                  ) : (
                    <div style={{ marginTop: "20px" }}>
                      {edit.text == "" || isTourOpen ? (
                        <button
                          className="main-button"
                          onClick={() => {
                            handleFireBaseUpload();
                            setshowoptions(true);
                          }}
                          data-tut="reactour__generatelink"
                        >
                          Add to Pack
                        </button>
                      ) : null}
                      {edit.text != "" || isTourOpen ? (
                        <button
                          className="main-button"
                          onClick={() => {
                            handleFireBaseUpload();
                            setshowoptions(true);
                          }}
                          data-tut="reactour__updatepack"
                        >
                          Update pack
                        </button>
                      ) : null}
                    </div>
                  )}
                </center>
                <center>
                  {(livelink && showoptions && !loading) || isTourOpen ? (
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
                        style={{ width: "200px", marginTop: "20px" }}
                      >
                        <Copy livelink={livelink} />
                      </div>
                    </div>
                  ) : null}
                </center>
              </center>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScheduledEnvelopeGreetingCardPage;

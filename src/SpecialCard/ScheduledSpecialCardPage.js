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
import SpecialCard from "./SpecialCard";
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

function ScheduledSpecialCardPage({
  step,
  slug,
  getDoc,
  isTourOpen,
  setTourOpend,
}) {
  const [showoptions, setshowoptions] = useState(false);
  let { edit } = useSelector((state) => ({ ...state }));
  const [Cloading, setCLoading] = useState(false);
  const database = firebase.firestore();
  let docToPrint = React.createRef();
  const secclasses = secuseStyles();
  const [loading, setloading] = useState(false);
  const [accentColor, setaccentColor] = useState("#70cff3");
  const [showshare, setshowshare] = useState(false);
  const [livelink, setlivelink] = useState();
  const [previewlink, setpreviewlink] = useState("");
  const [fireurl, setFireUrl] = useState("");
  const [imageAsFile, setImageAsFile] = useState("");
  const [image_url, setimage_url] = useState();
  const [opencrop, setopencrop] = useState(false);
  const [send, setsend] = useState();
  const { user } = useSelector((state) => ({ ...state }));

  const [head1, sethead1] = useState("My Best Friend");
  const [head2, sethead2] = useState("Toph Beifong");
  const [para, setpara] = useState(
    " Thanks for being a great friend You are our special friend . You are my special friend, I have never met a person like you. You have such a great personality. You are just the best"
  );
  const [fbimg, setfbimg] = useState(
    "https://firebasestorage.googleapis.com/v0/b/update-image.appspot.com/o/imp%2Fwwoman.jpg?alt=media&token=6c7031d9-6519-45c5-8256-44a52a4c1b20"
  );

  useEffect(() => {
    setCLoading(true);
    if (edit.text != "") {
      const todoRef = firebase
        .database()
        .ref("/SpecialCard/" + edit.text)
        .once("value")
        .then((snapshot) => {
          var img = snapshot.val().url;
          setfbimg(img);
          var head1 = snapshot.val().head1;
          sethead1(head1);
          var head2 = snapshot.val().head2;
          sethead2(head2);
          var para = snapshot.val().para;
          setpara(para);
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

    const uploadTask = await storage
      .ref(`/images/${imageAsFile.name}`)
      .put(imageAsFile);
    if (edit.text != "") {
      const todoRef = firebase.database().ref("SpecialCard/" + edit.text);
      const todo = {
        url: fbimg,
        head1: head1,
        head2: head2,
        para: para,
      };
      todoRef.update(todo);
      setlivelink(
        "http://update-image.web.app/scheduledlive/specialcard/" +
          edit.text +
          "/" +
          slug
      );
      setpreviewlink("/scheduledlive/specialcard/" + edit.text + "/" + slug);
      setloading(false);
    } else if (!livelink) {
      const todoRef = firebase.database().ref("SpecialCard");
      const todo = {
        url: fbimg,
        head1: head1,
        head2: head2,
        para: para,
      };
      var newKey = await todoRef.push(todo).getKey();
      setlivelink(
        "http://update-image.web.app/scheduledlive/specialcard/" + newKey + "/" + slug
      );
      setpreviewlink("/scheduledlive/specialcard/" + newKey + "/" + slug);
      const snapshot = await database
        .collection("n-day-pack")
        .doc(`${user.uid}`)
        .collection("giftshub")
        .doc(slug)
        .get();
      const data = snapshot.data().array_data;
      const newdata = data;
      newdata[step].url =
        "http://update-image.web.app/scheduledlive/specialcard/" + newKey + "/" + slug;
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
      toast.success("Special Card successfully added to your pack");
      getDoc();
      setloading(false);
    }
    {
      edit.text != "" && toast.success("Special Card updated successfully");
    }
  };

  async function EditPack() {}
  const tourConfig = [
    {
      selector: '[data-tut="reactour__changeImage"]',
      content: `Choose an image from you local device to be displayed on the Special Card.`,
    },
    {
      selector: '[data-tut="reactour__head1"]',
      content: `How are you and this special someone related?`,
    },
    {
      selector: '[data-tut="reactour__head2"]',
      // content: `Enter the special person’s name.`,
      content: `An optional one-liner to make this person giggle maybe?`,
    },
    {
      selector: '[data-tut="reactour__para"]',
      content: `Words have the power to transform the deepest thoughts into a beautiful poem. Type away your heartfelt message and tell them how much they mean to you.`,
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
          <div class="col-lg-9 d-flex justify-content-center mb-3 px-0">
            {Cloading ? (
              <Loader
                type="BallTriangle"
                color="#fdc674"
                height={100}
                width={100}
              />
            ) : (
              <div>
                <SpecialCard
                  fbimg={fbimg}
                  head1={head1}
                  head2={head2}
                  para={para}
                />
              </div>
            )}
          </div>

          <div className="editpagesrightnav   col-lg-3  mb-3">
            {" "}
            <div style={{ justifyContent: "center", padding: "20px 0" }}>
              <div data-tut="reactour__changeImage">
                <center>
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
                      aspect_ratio={1 / 1}
                      opencrop={opencrop}
                      setopencrop={setopencrop}
                    />
                  ) : null}
                  <label htmlFor="LocalfileInput">
                    <HeaderBtn Icon={ImageIcon} title="Change  image " />
                  </label>
                </center>
              </div>

              <center>
                <div data-tut="reactour__head1">
                  <div
                    style={{
                      width: "200px",

                      marginTop: "10px",
                    }}
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
                      value={head1}
                      onChange={(e) => {
                        setshowoptions(false);
                        sethead1(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div data-tut="reactour__head2">
                  <div
                    style={{
                      width: "200px",

                      marginTop: "10px",
                    }}
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
                      value={head2}
                      onChange={(e) => {
                        setshowoptions(false);
                        sethead2(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div
                  data-tut="reactour__para"
                  style={{
                    width: "200px",

                    marginTop: "20px",
                  }}
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
                    value={para}
                    onChange={(e) => {
                      setshowoptions(false);
                      setpara(e.target.value);
                    }}
                  />
                </div>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScheduledSpecialCardPage;

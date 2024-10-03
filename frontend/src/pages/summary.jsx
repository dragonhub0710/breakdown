import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  Button,
  Input,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { ReactMic } from "react-mic";
import Lottie from "react-lottie";
import Loading_Animation from "@/widgets/solid_loading.json";
import Record_Loading_Animation from "@/widgets/record_loading.json";
import CountdownTimer from "@/widgets/countdowntimer/countdowntimer";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllSummaries,
  removeSummary,
  updateSummary,
  updateRecordSummarize,
  getOneSummary,
} from "@/actions/summary";

export function Summary() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isloading, setIsloading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [countTime, setCountTime] = useState(120);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [menuAnimationClass, setMenuAnimationClass] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [modalSize, setModalSize] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [shareId, setShareId] = useState("");
  const auth = useSelector((state) => state.auth);
  const summary = useSelector((state) => state.summary);
  const summaryRef = useRef(summary);
  const loadingOption = {
    loop: true,
    autoplay: true,
    animationData: Loading_Animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const recordloadingOption = {
    loop: true,
    autoplay: true,
    animationData: Record_Loading_Animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    if (window.innerWidth > 960) {
      setModalSize("sm");
    } else {
      setModalSize("xl");
    }
    const pathArray = window.location.pathname.split("/");
    const id = pathArray[pathArray.length - 1];
    setShareId(id);
    setIsloading(true);
    dispatch(getOneSummary({ id })).finally(() => {
      setIsloading(false);
    });
  }, []);

  useEffect(() => {
    if (auth.isAuthenticated) {
      dispatch(getAllSummaries());
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    if (countTime == 1) {
      setRecording(false);
      const wave = document.querySelector(".wave");
      wave.style.animation = "none";
    }
  }, [countTime]);

  useEffect(() => {
    if (isOpenMenu) {
      setMenuAnimationClass("hide-menu");
    } else {
      setMenuAnimationClass("shown-menu");
    }
  }, [isOpenMenu]);

  useEffect(() => {
    summaryRef.current = summary;
  }, [summary]);

  const handleStartRecording = () => {
    setRecording((recording) => !recording);
    const wave = document.querySelector(".small-wave");

    if (!recording) {
      // Start recording animation
      startWaveAnimation(wave);
    } else {
      // Stop recording animation and reset
      stopWaveAnimation(wave);
    }
  };

  const startWaveAnimation = (wave) => {
    wave.style.animation = "none"; // Reset animation
    wave.offsetHeight; // Trigger reflow to allow animation restart
    wave.style.animation = "waveEffect 2s ease-out infinite";
  };

  const stopWaveAnimation = (wave) => {
    wave.style.animation = "none"; // Immediately stop the animation
  };

  const onStop = (recordedBlob) => {
    const file = new File([recordedBlob.blob], "recording.wav", {
      type: "audio/wav",
    });

    const formData = new FormData();
    formData.append("file", file);
    let summary = summaryRef.current;
    formData.append("id", summary.selectedOne.id);

    setIsloading(true);
    dispatch(updateRecordSummarize(formData)).finally(() => {
      setIsloading(false);
    });
  };

  const handleOpenMenu = () => {
    setIsOpenMenu((menu) => !menu);
  };

  const handleEditSave = () => {
    setIsloading(true);
    const data = {
      id: summary.selectedOne.id,
      title: newTitle,
    };
    dispatch(updateSummary(data)).finally(() => {
      setIsloading(false);
    });
    setIsEditOpen((isEditOpen) => !isEditOpen);
  };

  const handleRemove = () => {
    setIsloading(true);
    dispatch(removeSummary({ id: summary.selectedOne.id })).finally(() => {
      setIsloading(false);
    });
    setIsDeleteOpen((isDeleteOpen) => !isDeleteOpen);
  };

  const handleSelected = (id) => {
    navigate(`/summary/${id}`);
  };

  const handleEditOpen = () => {
    if (!isEditOpen) {
      setNewTitle(summary.selectedOne.title);
    }
    setIsEditOpen((isEditOpen) => !isEditOpen);
  };

  const handleDeleteOpen = () => {
    setIsDeleteOpen((isDeleteOpen) => !isDeleteOpen);
  };

  const handleCopy = () => {
    let text = extractTextFromHTML(summary.selectedOne.content);
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsOpen(true);
        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const extractTextFromHTML = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  };

  const handleShare = () => {};

  return (
    <>
      <div
        className={`relative flex h-full min-h-[calc(100vh-80px)] w-full pt-[80px] lg:overflow-auto ${
          isOpenMenu ? "overflow-hidden" : "overflow-auto"
        }`}
      >
        {isloading && (
          <div className="z-60 absolute left-0 top-0 h-full w-full"></div>
        )}
        <div
          className={`fixed top-0 z-50 flex h-full min-h-[calc(100vh-96px-100px)] min-w-[300px] justify-between border-r-2 border-[#b3b3b379] bg-gray-50 lg:z-10 lg:animate-none lg:pt-[80px] ${menuAnimationClass} ${
            auth.isAuthenticated ? "block" : "hidden"
          }`}
        >
          <div className="relative h-full w-full">
            {isOpenMenu && (
              <div
                onClick={handleOpenMenu}
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg hover:bg-[#d1d1d1]"
              >
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 1024 1024"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#000000"
                    d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"
                  />
                </svg>
              </div>
            )}
            <div className="w-full px-4 py-8 text-center text-xl font-bold  lg:text-2xl">
              My Workspaces
            </div>
            <div className="h-full max-h-[calc(100vh-96px)] min-h-[calc(100vh-96px)] w-full overflow-y-auto p-4 lg:max-h-[calc(100vh-96px-80px)] lg:min-h-[calc(100vh-96px-80px)]">
              <div className="px-2">
                {summary.list &&
                  summary.list.length != 0 &&
                  summary.list.map((item, idx) => {
                    return (
                      <a key={idx} href={`/summary/${item.shareId}`}>
                        <div
                          className={`relative mb-2 w-full cursor-pointer rounded-lg px-4 py-2 hover:bg-[#e0e0e0] ${
                            item.shareId == shareId && "bg-[#e0e0e0]"
                          }`}
                        >
                          <Typography className="w-[160px] overflow-hidden text-ellipsis whitespace-nowrap text-base">
                            {idx + 1}. {item.title}
                          </Typography>
                          <div
                            className={`absolute right-0 top-0 h-full ${
                              item.shareId == shareId ? "block" : "hidden"
                            }`}
                          >
                            <div className="flex h-full w-full items-center">
                              <div
                                onClick={handleEditOpen}
                                className="mx-2 flex items-center justify-center rounded"
                              >
                                <svg
                                  fill="#000000"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20px"
                                  height="20px"
                                  viewBox="0 0 494.936 494.936"
                                >
                                  <g>
                                    <g>
                                      <path
                                        d="M389.844,182.85c-6.743,0-12.21,5.467-12.21,12.21v222.968c0,23.562-19.174,42.735-42.736,42.735H67.157
			c-23.562,0-42.736-19.174-42.736-42.735V150.285c0-23.562,19.174-42.735,42.736-42.735h267.741c6.743,0,12.21-5.467,12.21-12.21
			s-5.467-12.21-12.21-12.21H67.157C30.126,83.13,0,113.255,0,150.285v267.743c0,37.029,30.126,67.155,67.157,67.155h267.741
			c37.03,0,67.156-30.126,67.156-67.155V195.061C402.054,188.318,396.587,182.85,389.844,182.85z"
                                      />
                                      <path
                                        d="M483.876,20.791c-14.72-14.72-38.669-14.714-53.377,0L221.352,229.944c-0.28,0.28-3.434,3.559-4.251,5.396l-28.963,65.069
			c-2.057,4.619-1.056,10.027,2.521,13.6c2.337,2.336,5.461,3.576,8.639,3.576c1.675,0,3.362-0.346,4.96-1.057l65.07-28.963
			c1.83-0.815,5.114-3.97,5.396-4.25L483.876,74.169c7.131-7.131,11.06-16.61,11.06-26.692
			C494.936,37.396,491.007,27.915,483.876,20.791z M466.61,56.897L257.457,266.05c-0.035,0.036-0.055,0.078-0.089,0.107
			l-33.989,15.131L238.51,247.3c0.03-0.036,0.071-0.055,0.107-0.09L447.765,38.058c5.038-5.039,13.819-5.033,18.846,0.005
			c2.518,2.51,3.905,5.855,3.905,9.414C470.516,51.036,469.127,54.38,466.61,56.897z"
                                      />
                                    </g>
                                  </g>
                                </svg>
                              </div>
                              <div
                                onClick={handleDeleteOpen}
                                className="mx-2 flex items-center justify-center rounded"
                              >
                                <svg
                                  fill="#000000"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20px"
                                  height="20px"
                                  viewBox="0 0 482.428 482.429"
                                >
                                  <g>
                                    <g>
                                      <path
                                        d="M381.163,57.799h-75.094C302.323,25.316,274.686,0,241.214,0c-33.471,0-61.104,25.315-64.85,57.799h-75.098
			c-30.39,0-55.111,24.728-55.111,55.117v2.828c0,23.223,14.46,43.1,34.83,51.199v260.369c0,30.39,24.724,55.117,55.112,55.117
			h210.236c30.389,0,55.111-24.729,55.111-55.117V166.944c20.369-8.1,34.83-27.977,34.83-51.199v-2.828
			C436.274,82.527,411.551,57.799,381.163,57.799z M241.214,26.139c19.037,0,34.927,13.645,38.443,31.66h-76.879
			C206.293,39.783,222.184,26.139,241.214,26.139z M375.305,427.312c0,15.978-13,28.979-28.973,28.979H136.096
			c-15.973,0-28.973-13.002-28.973-28.979V170.861h268.182V427.312z M410.135,115.744c0,15.978-13,28.979-28.973,28.979H101.266
			c-15.973,0-28.973-13.001-28.973-28.979v-2.828c0-15.978,13-28.979,28.973-28.979h279.897c15.973,0,28.973,13.001,28.973,28.979
			V115.744z"
                                      />
                                      <path
                                        d="M171.144,422.863c7.218,0,13.069-5.853,13.069-13.068V262.641c0-7.216-5.852-13.07-13.069-13.07
			c-7.217,0-13.069,5.854-13.069,13.07v147.154C158.074,417.012,163.926,422.863,171.144,422.863z"
                                      />
                                      <path
                                        d="M241.214,422.863c7.218,0,13.07-5.853,13.07-13.068V262.641c0-7.216-5.854-13.07-13.07-13.07
			c-7.217,0-13.069,5.854-13.069,13.07v147.154C228.145,417.012,233.996,422.863,241.214,422.863z"
                                      />
                                      <path
                                        d="M311.284,422.863c7.217,0,13.068-5.853,13.068-13.068V262.641c0-7.216-5.852-13.07-13.068-13.07
			c-7.219,0-13.07,5.854-13.07,13.07v147.154C298.213,417.012,304.067,422.863,311.284,422.863z"
                                      />
                                    </g>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
        <div
          className={`w-full px-6 py-6 lg:px-8 ${
            auth.isAuthenticated ? "lg:ml-[300px]" : "container mx-auto"
          }`}
        >
          <div className="w-full">
            <div
              onClick={handleOpenMenu}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg hover:bg-[#cccccc] lg:hidden"
            >
              <svg
                width="20px"
                height="20px"
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M109.632 673.664h519.68c25.152 0 45.568-22.016 45.568-48.896 0-26.88-20.416-48.896-45.568-48.896h-519.68c-25.216 0-45.632 22.016-45.632 48.896 0 26.88 20.48 48.896 45.632 48.896z m0-228.096h519.68c25.152 0 45.568-21.952 45.568-48.896 0-26.88-20.416-48.896-45.568-48.896h-519.68c-25.216 0-45.632 22.016-45.632 48.896 0 26.88 20.48 48.896 45.632 48.896z m3.264-219.904h795.776c26.88 0 50.56-20.352 51.328-47.168A48.896 48.896 0 0 0 911.104 128H115.328c-26.88 0-50.56 20.416-51.328 47.168a48.896 48.896 0 0 0 48.896 50.56z m619.776 447.232V348.672L960 510.784l-227.328 162.112c0 0.768 0 0.768 0 0z m178.432 122.944H115.328c-26.88 0-50.56 20.48-51.328 47.232a48.896 48.896 0 0 0 48.896 50.496h795.776c26.88 0 50.56-20.416 51.328-47.232a48.896 48.896 0 0 0-48.896-50.496z"
                  fill="#000000"
                />
              </svg>
            </div>
            <div className="flex w-full justify-between">
              <a href="/">
                <div className="flex w-fit cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-base hover:bg-[#cccccc]">
                  <svg
                    width="8px"
                    height="14px"
                    viewBox="0 0 8 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.65723 1L1.70748 5.94975C1.31695 6.34027 1.31695 6.97344 1.70748 7.36396L6.65723 12.3137"
                      stroke="#06021E"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Back
                </div>
              </a>
              <div className="flex">
                <div
                  onClick={handleShare}
                  className={`mx-2 flex w-fit cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-base hover:bg-[#cccccc] ${
                    auth.user && auth.user.id == summary.selectedOne.userId
                      ? "block"
                      : "hidden"
                  }`}
                >
                  <svg
                    fill="#000000"
                    height="16px"
                    width="16px"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 481.6 481.6"
                  >
                    <g>
                      <path
                        d="M381.6,309.4c-27.7,0-52.4,13.2-68.2,33.6l-132.3-73.9c3.1-8.9,4.8-18.5,4.8-28.4c0-10-1.7-19.5-4.9-28.5l132.2-73.8
		c15.7,20.5,40.5,33.8,68.3,33.8c47.4,0,86.1-38.6,86.1-86.1S429,0,381.5,0s-86.1,38.6-86.1,86.1c0,10,1.7,19.6,4.9,28.5
		l-132.1,73.8c-15.7-20.6-40.5-33.8-68.3-33.8c-47.4,0-86.1,38.6-86.1,86.1s38.7,86.1,86.2,86.1c27.8,0,52.6-13.3,68.4-33.9
		l132.2,73.9c-3.2,9-5,18.7-5,28.7c0,47.4,38.6,86.1,86.1,86.1s86.1-38.6,86.1-86.1S429.1,309.4,381.6,309.4z M381.6,27.1
		c32.6,0,59.1,26.5,59.1,59.1s-26.5,59.1-59.1,59.1s-59.1-26.5-59.1-59.1S349.1,27.1,381.6,27.1z M100,299.8
		c-32.6,0-59.1-26.5-59.1-59.1s26.5-59.1,59.1-59.1s59.1,26.5,59.1,59.1S132.5,299.8,100,299.8z M381.6,454.5
		c-32.6,0-59.1-26.5-59.1-59.1c0-32.6,26.5-59.1,59.1-59.1s59.1,26.5,59.1,59.1C440.7,428,414.2,454.5,381.6,454.5z"
                      />
                    </g>
                  </svg>
                  Share
                </div>
                <div
                  onClick={handleCopy}
                  className="relative mx-2 flex w-fit cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-base hover:bg-[#cccccc]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="16px"
                    width="16px"
                    viewBox="0 0 115.77 122.88"
                  >
                    <g>
                      <path d="M89.62,13.96v7.73h12.19h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02v0.02 v73.27v0.01h-0.02c-0.01,3.84-1.57,7.33-4.1,9.86c-2.51,2.5-5.98,4.06-9.82,4.07v0.02h-0.02h-61.7H40.1v-0.02 c-3.84-0.01-7.34-1.57-9.86-4.1c-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-0.02V92.51H13.96h-0.01v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1 c-2.5-2.51-4.06-5.98-4.07-9.82H0v-0.02V13.96v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07V0h0.02h61.7 h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02V13.96L89.62,13.96z M79.04,21.69v-7.73v-0.02h0.02 c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v64.59v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h12.19V35.65 v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07v-0.02h0.02H79.04L79.04,21.69z M105.18,108.92V35.65v-0.02 h0.02c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v73.27v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h61.7h0.02 v0.02c0.91,0,1.75-0.39,2.37-1.01c0.61-0.61,1-1.46,1-2.37h-0.02V108.92L105.18,108.92z" />
                    </g>
                  </svg>
                  Copy
                  {isOpen && (
                    <div className="absolute top-12">
                      <div className="flex h-12 w-[100px] items-center justify-center rounded-xl border-2 border-[#666666] bg-[#eeeefd] px-2 shadow-2xl">
                        <Typography className="text-sm">
                          Text copied!
                        </Typography>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            className={`flex w-full flex-col ${
              auth.user && auth.user.id == summary.selectedOne.userId
                ? "block"
                : "hidden"
            }`}
          >
            <div className="flex w-full justify-center">
              <Typography className="text-xl font-semibold">
                ADD/ADJUST
              </Typography>
            </div>
            <div className="my-2 flex justify-center">
              <div
                onClick={handleStartRecording}
                className="relative h-20 w-20 lg:h-24 lg:w-24"
              >
                <div className="absolute left-0 top-0 z-10 flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#ecec2b] hover:bg-[#fdfd5a]">
                  <svg
                    width="44px"
                    height="44px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 10V12C19 15.866 15.866 19 12 19M5 10V12C5 15.866 8.13401 19 12 19M12 19V22M8 22H16M12 15C10.3431 15 9 13.6569 9 12V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V12C15 13.6569 13.6569 15 12 15Z"
                      stroke="#000000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div
                  className={`${
                    isloading ? "visible" : "invisible"
                  } absolute left-[-8px] top-[-8px] z-50 h-24 w-24 lg:h-28 lg:w-28`}
                >
                  <Lottie
                    options={recordloadingOption}
                    isClickToPauseDisabled={true}
                  />
                </div>
                <div className="small-wave"></div>
              </div>
              <div className="mx-5 flex w-fit flex-col items-center justify-center">
                <CountdownTimer
                  status={recording}
                  setCountTime={setCountTime}
                />
              </div>
            </div>
            <div className="flex w-full justify-center">
              <div
                className={`${
                  isloading ? "visible" : "invisible"
                } h-auto w-10 lg:w-14`}
              >
                <Lottie options={loadingOption} isClickToPauseDisabled={true} />
              </div>
            </div>
          </div>
          {summary.selectedOne && (
            <div className="prose">
              <div
                dangerouslySetInnerHTML={{
                  __html: summary.selectedOne.content,
                }}
                className="text-base font-normal"
              />
            </div>
          )}
        </div>
        <ReactMic
          record={recording}
          className="sound-wave hidden"
          onStop={onStop}
          strokeColor="#000000"
          backgroundColor="#FF4081"
          visualSetting="sinewave"
          visualSettingFillColor="#ffffff"
        />
        <Dialog open={isEditOpen} handler={handleEditOpen} size={modalSize}>
          <DialogHeader>
            <Typography variant="h4" className="w-full text-center">
              Edit Title
            </Typography>
          </DialogHeader>
          <DialogBody>
            <div className="mb-2 h-full w-full rounded-lg border-2 border-black">
              {summary && summary.list && summary.list.length != 0 && (
                <Input
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full !border-0 text-base"
                  defaultValue={summary.selectedOne.title}
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              )}
            </div>
            <div className="flex w-full justify-end gap-3">
              <Button
                onClick={handleEditOpen}
                className="bg-[#4728f8] text-base normal-case shadow-none hover:shadow-none"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditSave}
                className="flex items-center bg-[#4728f8] text-base normal-case shadow-none hover:shadow-none"
              >
                {isloading && (
                  <div className="flex h-8 w-8 items-center justify-center">
                    <Lottie
                      options={loadingOption}
                      isClickToPauseDisabled={true}
                    />
                  </div>
                )}
                Save
              </Button>
            </div>
          </DialogBody>
        </Dialog>
        <Dialog open={isDeleteOpen} handler={handleDeleteOpen} size={modalSize}>
          <DialogHeader>
            <Typography variant="h5" className="w-full text-center">
              Are you going to remove this chat?
            </Typography>
          </DialogHeader>
          <DialogBody>
            <div className="flex w-full justify-center gap-3">
              <Button
                className="bg-[#4728f8] text-base normal-case shadow-none hover:shadow-none"
                onClick={handleDeleteOpen}
              >
                Cancel
              </Button>
              <Button
                className="flex items-center bg-[#4728f8] text-base normal-case shadow-none hover:shadow-none"
                onClick={handleRemove}
              >
                {isloading && (
                  <div className="flex h-8 w-8 items-center justify-center">
                    <Lottie
                      options={loadingOption}
                      isClickToPauseDisabled={true}
                    />
                  </div>
                )}
                Delete
              </Button>
            </div>
          </DialogBody>
        </Dialog>
      </div>
    </>
  );
}

export default Summary;

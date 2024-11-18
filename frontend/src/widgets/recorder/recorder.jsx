import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Lottie from "react-lottie";
import Loading_Animation from "@/widgets/solid_loading.json";
import { ReactMic } from "react-mic";
import { Avatar } from "@material-tailwind/react";
import { summarize } from "@/actions/summary";
import CountdownTimer from "../countdowntimer/countdowntimer";

const Recorder = () => {
  const dispatch = useDispatch();
  const [isloading, setIsloading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [countTime, setCountTime] = useState(120);
  const summary = useSelector((state) => state.summary);
  const originalTextRef = useRef(null);

  const loadingOption = {
    loop: true,
    autoplay: true,
    animationData: Loading_Animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    if (summary.selectedItem) {
      originalTextRef.current = summary.selectedItem.transcription;
    }
  }, [summary.selectedItem]);

  useEffect(() => {
    if (countTime == 1) {
      setRecording(false);
    }
  }, [countTime]);

  const handleStartRecording = () => {
    setRecording((recording) => !recording);
  };

  const onStop = (recordedBlob) => {
    const file = new File([recordedBlob.blob], "recording.wav", {
      type: "audio/wav",
    });

    const formData = new FormData();
    formData.append("file", file);
    if (originalTextRef.current) {
      formData.append("originalText", originalTextRef.current);
    }
    setIsloading(true);
    dispatch(summarize(formData)).finally(() => {
      setIsloading(false);
    });
  };

  return (
    <div className="fixed bottom-8 z-20 flex h-[84px] w-full items-center justify-center">
      <div
        onClick={handleStartRecording}
        className={`flex h-[84px] w-[84px] cursor-pointer items-center justify-center rounded-full shadow-[0_5px_5px_rgba(0,0,0,0.5)] ${
          recording
            ? "bg-[#D40000]"
            : isloading
            ? "bg-[#1F2122]"
            : "bg-[#D31510]"
        }`}
      >
        {recording ? (
          <CountdownTimer status={recording} setCountTime={setCountTime} />
        ) : isloading ? (
          <div className="h-16 w-16">
            <Lottie options={loadingOption} isClickToPauseDisabled={true} />
          </div>
        ) : (
          <Avatar src="img/mic.svg" className="h-9 w-9" />
        )}
      </div>
      <ReactMic record={recording} className="hidden" onStop={onStop} />
    </div>
  );
};

export default Recorder;

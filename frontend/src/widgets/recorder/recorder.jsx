import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Lottie from "react-lottie";
import Loading_Animation from "@/widgets/solid_loading.json";
import { ReactMic } from "react-mic";
import { Avatar } from "@material-tailwind/react";
import { recordBreakdown, recordUpdateBreakdown } from "@/actions/breakdown";
import CountdownTimer from "../countdowntimer/countdowntimer";
import { recordFeedback } from "@/actions/feedback";

const Recorder = (props) => {
  const dispatch = useDispatch();
  const { isLoading, setIsLoading, isFeedback } = props;
  const [recording, setRecording] = useState(false);
  const [countTime, setCountTime] = useState(120);
  const breakdown = useSelector((state) => state.breakdown);
  const selectedBreakdownRef = useRef(null);
  const feedbackRef = useRef(false);

  const loadingOption = {
    loop: true,
    autoplay: true,
    animationData: Loading_Animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    if (breakdown.selectedBD) {
      selectedBreakdownRef.current = breakdown.selectedBD;
    }
  }, [breakdown.selectedBD]);

  useEffect(() => {
    if (isFeedback) {
      feedbackRef.current = isFeedback;
    }
  }, [isFeedback]);

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
    if (selectedBreakdownRef.current && selectedBreakdownRef.current.content) {
      formData.append("originalText", selectedBreakdownRef.current.content);
    }
    setIsLoading(true);
    if (feedbackRef.current) {
      formData.append("type", "feedback");
      dispatch(recordFeedback(formData)).finally(() => {
        setIsLoading(false);
      });
    } else {
      formData.append("type", "breakdown");
      if (selectedBreakdownRef.current && selectedBreakdownRef.current.id) {
        formData.append("id", selectedBreakdownRef.current.id);
        dispatch(recordUpdateBreakdown(formData)).finally(() => {
          setIsLoading(false);
        });
      } else {
        dispatch(recordBreakdown(formData)).finally(() => {
          setIsLoading(false);
        });
      }
    }
  };

  return (
    <div className="fixed bottom-8 z-20 h-[84px] w-full">
      <div className="relative flex h-full w-full items-center justify-center">
        {isLoading && (
          <div className="absolute left-0 top-0 z-50 h-full w-full opacity-100"></div>
        )}
        <div
          onClick={handleStartRecording}
          className={`flex h-[84px] w-[84px] cursor-pointer items-center justify-center rounded-full shadow-[0_5px_5px_rgba(0,0,0,0.5)] ${
            recording
              ? "bg-[#D40000]"
              : isLoading
              ? "bg-[#1F2122]"
              : "bg-[#D31510]"
          }`}
        >
          {recording ? (
            <CountdownTimer status={recording} setCountTime={setCountTime} />
          ) : isLoading ? (
            <div className="relative h-16 w-16">
              <Lottie options={loadingOption} isClickToPauseDisabled={true} />
            </div>
          ) : (
            <Avatar src="/img/mic.svg" className="h-9 w-9" />
          )}
        </div>
      </div>
      <ReactMic record={recording} className="hidden" onStop={onStop} />
    </div>
  );
};

export default Recorder;

import React, { useEffect, useRef, useState } from "react";
import { Avatar, Typography } from "@material-tailwind/react";
import CountdownTimer from "@/widgets/countdowntimer/countdowntimer";
import { ReactMic } from "react-mic";
import Lottie from "react-lottie";
import Loading_Animation from "@/widgets/dot_loading.json";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { recordSummarize } from "@/actions/summary";

export function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isloading, setIsloading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [countTime, setCountTime] = useState(120);
  const auth = useSelector((state) => state.auth);
  const summary = useSelector((state) => state.summary);

  const loadingOption = {
    loop: true,
    autoplay: true,
    animationData: Loading_Animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    if (countTime == 1) {
      setRecording(false);
      const wave = document.querySelector(".wave");
      wave.style.animation = "none";
    }
  }, [countTime]);

  useEffect(() => {
    if (summary.selectedOne) {
      navigate(`/summary/${summary.selectedOne.shareId}`);
    }
  }, [summary.selectedOne]);

  const handleStartRecording = () => {
    if (!auth.isAuthenticated) {
      navigate("/signin");
    }
    if (countTime > 1) {
      setRecording((recording) => !recording);
      const wave = document.querySelector(".wave");

      if (!recording) {
        // Start recording animation
        startWaveAnimation(wave);
      } else {
        // Stop recording animation and reset
        stopWaveAnimation(wave);
      }
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
    setIsloading(true);
    dispatch(recordSummarize(formData)).finally(() => {
      setIsloading(false);
    });
  };

  return (
    <>
      <div className="relative flex h-full min-h-[calc(100vh-80px)] w-full items-center justify-center pt-[80px]">
        {isloading && (
          <div className="absolute left-0 top-0 h-full w-full"></div>
        )}
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Typography className="my-4 text-3xl font-semibold">
            TALK IT THROUGH
          </Typography>
          <Typography className="mb-16 text-3xl font-semibold">
            BREAK IT DOWN
          </Typography>
          <div onClick={handleStartRecording} className="relative h-36 w-36">
            <div className="absolute left-0 top-0 z-10 flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#ecec2b] hover:bg-[#fdfd5a]">
              <svg
                width="64px"
                height="64px"
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
            <div className="wave"></div>
          </div>
          <div className="my-4 flex w-full flex-col items-center justify-center">
            <CountdownTimer status={recording} setCountTime={setCountTime} />
            <div
              className={`${isloading ? "visible" : "invisible"} h-auto w-14`}
            >
              <Lottie options={loadingOption} isClickToPauseDisabled={true} />
            </div>
          </div>
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
      </div>
    </>
  );
}

export default Home;

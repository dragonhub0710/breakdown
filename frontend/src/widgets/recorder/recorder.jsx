import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Lottie from "react-lottie";
import Loading_Animation from "@/widgets/solid_loading.json";
import { ReactMic } from "react-mic";
import {
  Avatar,
  Button,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  Checkbox,
} from "@material-tailwind/react";
import {
  recordBreakdown,
  recordUpdateBreakdown,
  saveNewBreakdown,
  updateBreakdown,
} from "@/actions/breakdown";
import CountdownTimer from "../countdowntimer/countdowntimer";
import {
  recordFeedback,
  initFeedback,
  createFeedback,
} from "@/actions/feedback";
import { initCurrentBreakdown } from "@/actions/breakdown";
import SignIn from "@/widgets/auth/signin";
import SignUp from "@/widgets/auth/signup";

const Recorder = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, setIsLoading, isFeedback } = props;
  const [countTime, setCountTime] = useState(120);
  const [queue, setQueue] = useState(new Array(30).fill(10));
  const breakdown = useSelector((state) => state.breakdown);
  const auth = useSelector((state) => state.auth);
  const feedback = useSelector((state) => state.feedback);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [feedbackOwnerName, setFeedbackOwerName] = useState("");
  const [showFeedback, setShowFeedback] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const selectedBreakdownRef = useRef(null);
  const feedbackRef = useRef(false);
  const recordingRef = useRef(false);

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
    if (feedback.newFeedback != "") {
      if (auth.isAuthenticated) {
        setFeedbackOwerName(auth.user.username);
      } else {
        setFeedbackOwerName("Anonymous");
      }
    }
  }, [feedback.newFeedback]);

  useEffect(() => {
    if (countTime == 1) {
      // setRecording(false);
      recordingRef.current = false;
    }
  }, [countTime]);

  const handleStartRecording = async () => {
    if (recordingRef.current) {
      // setRecording(false);
      recordingRef.current = false;
    } else {
      // setRecording(true);
      recordingRef.current = true;
      await navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          handleStream(stream);
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
        });
    }
  };

  const handleStream = (stream) => {
    const audioContext = new AudioContext();
    const mediaStreamSource = audioContext.createMediaStreamSource(stream);
    const analyzer = audioContext.createAnalyser();

    // Connect the media stream source to the analyzer
    mediaStreamSource.connect(analyzer);

    // Configure the analyzer
    analyzer.smoothingTimeConstant = 0.3; // Smooth the audio data
    analyzer.fftSize = 1024; // Specify the size of the FFT

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Start recording
    handleStartRecording();

    function handleStartRecording() {
      const chunks = [];

      function analyzeAudio() {
        if (!recordingRef.current) {
          stopRecording();
          return;
        }

        analyzer.getByteTimeDomainData(dataArray);
        const volume = getVolume(dataArray);

        let height = valueToHeight(volume);

        updateQueue(height);

        // Continue recording
        setTimeout(() => {
          analyzeAudio();
        }, 100); // Repeat the analysis every 100ms
      }

      // Start analyzing audio
      analyzeAudio();

      function stopRecording() {
        // setRecording(false);
        recordingRef.current = false;

        // Stop the media stream and disconnect the analyzer
        mediaStreamSource.disconnect();
        analyzer.disconnect();
      }

      // Event listener for the audio data
      audioContext.onaudioprocess = (e) => {
        // Store the audio data in chunks
        const float32array = e.inputBuffer.getChannelData(0);
        const chunk = new Float32Array(float32array);
        chunks.push(chunk);
      };
    }

    function getVolume(dataArray) {
      let sum = 0;

      // Calculate the sum of the audio data
      for (let i = 0; i < dataArray.length; i++) {
        sum += Math.abs(dataArray[i] - 128);
      }

      // Calculate the average volume
      const average = sum / dataArray.length;

      return average;
    }
  };

  // Function to update the queue
  const updateQueue = (newItem) => {
    setQueue((prevQueue) => {
      // Clone the previous queue to avoid direct state mutation
      let updatedQueue = [...prevQueue];

      // Check if the queue length has reached its max size of 20
      if (updatedQueue.length >= 30) {
        // Remove the oldest item (first item in the array) if max size is reached
        updatedQueue.shift();
      }

      // Add the new item to the end of the queue
      updatedQueue.push(newItem);
      // Return the updated queue
      return updatedQueue;
    });
  };

  function valueToHeight(value) {
    const minValue = 0;
    const maxValue = 5;
    const minPixel = 10;
    const maxPixel = 30;

    // Ensure the value is within bounds
    const boundedValue = Math.min(Math.max(value, minValue), maxValue);

    // Linear scaling calculation
    const pixelHeight =
      minPixel +
      ((boundedValue - minValue) * (maxPixel - minPixel)) /
        (maxValue - minValue);
    return pixelHeight;
  }

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

  const handleGoSignIn = () => {
    setShowSignInModal(true);
    setShowRemoveModal(false);
  };

  const handleGoBack = () => {
    if (breakdown.isNew) {
      if (breakdown.selectedBD.isShared) {
        dispatch(initCurrentBreakdown());
        navigate("/");
      } else {
        const hideModalFlag = localStorage.getItem("hideModalFlag");
        if (!hideModalFlag) {
          setShowRemoveModal(true);
        } else {
          navigate("/recording");
          dispatch(initCurrentBreakdown());
        }
      }
    } else {
      dispatch(initCurrentBreakdown());
      if (auth.isAuthenticated) {
        navigate("/");
      } else {
        navigate("/recording");
      }
    }
  };

  const handleSetShare = () => {
    if (auth.isAuthenticated) {
      if (breakdown.isNew && !breakdown.selectedBD.id) {
        dispatch(
          saveNewBreakdown({ breakdown: breakdown.selectedBD, isShared: true })
        );
      } else {
        const data = {
          breakdown: breakdown.selectedBD,
        };
        data.breakdown.isShared = true;
        dispatch(updateBreakdown(data));
      }
    } else {
      setShowSignInModal(true);
    }
  };

  const handleGoBackConfirm = () => {
    if (isChecked) {
      localStorage.setItem("hideModalFlag", true);
    }
    dispatch(initCurrentBreakdown());
    navigate("/recording");
    setShowRemoveModal(false);
  };

  const handleCheckbox = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleOpenFeedback = () => {
    setShowFeedback((showFeedback) => !showFeedback);
  };

  const handleRemove = () => {
    dispatch(initFeedback());
  };

  const handleSubmitFeedback = () => {
    // create new feedback
    const data = {
      content: feedback.newFeedback,
      userId: auth.isAuthenticated ? auth.user.id : -1,
      breakdownId: breakdown.selectedBD.id,
      shareId: breakdown.selectedBD.shareId,
    };
    dispatch(createFeedback(data));
    dispatch(initFeedback());
  };

  return (
    <div
      className={`fixed left-0 right-0 z-30 transition-all duration-300 ease-in-out ${
        showFeedback ? "bottom-0" : "bottom-[calc(75px-70vh)]"
      }`}
    >
      <div
        className={`relative flex min-h-[160px] w-full flex-col bg-white p-5 pb-0 ${
          breakdown.selectedBD && "border-t-[1px] border-t-[#00000029]"
        } ${feedback.newFeedback ? "h-[70vh]" : "h-full"}`}
      >
        {isLoading && (
          <div className="absolute left-0 top-0 z-50 h-full w-full opacity-100"></div>
        )}
        {feedback.newFeedback && (
          <div className="flex h-[calc(70vh-180px)] w-full flex-col justify-start gap-2 overflow-y-auto border-b-[1px] border-[#D5D5D5] pb-2">
            <div className="flex w-full items-center justify-between">
              <Typography className="text-xl font-semibold text-black">
                Your Feedback
              </Typography>
              <Button
                variant="outlined"
                onClick={handleOpenFeedback}
                className="flex h-8 w-8 items-center justify-center rounded-lg border-[1px] border-[#D5D5D5] p-0"
              >
                <Avatar
                  src="/img/down.svg"
                  className={`h-4 w-auto ${showFeedback ? "" : "rotate-180"}`}
                />
              </Button>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9599FF] text-xl font-semibold capitalize">
                {feedbackOwnerName[0]}
              </div>
              <Typography className="mx-4 text-xl font-bold capitalize">
                {feedbackOwnerName}
              </Typography>
            </div>
            <Typography className="text-base font-normal">
              {feedback.newFeedback}
            </Typography>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 flex h-fit w-full flex-col items-center justify-between p-5 pt-3">
          <div className="flex h-fit w-full items-center justify-between">
            <div className="flex w-[90px] justify-center">
              {auth.isAuthenticated ? (
                breakdown.selectedBD &&
                (feedback.newFeedback ? (
                  <Button
                    onClick={handleRemove}
                    variant="outlined"
                    disabled={isLoading || recordingRef.current}
                    className="relative flex h-9 w-fit cursor-pointer items-center justify-between rounded-lg border-[1px] border-[#D5D5D5] px-3 disabled:bg-[#AAADB1]"
                  >
                    <Avatar
                      src="/img/trash.svg"
                      className="h-4 w-auto rounded-none"
                    />
                    <Typography className="ml-[6px] text-sm font-semibold normal-case text-black">
                      Delete
                    </Typography>
                  </Button>
                ) : (
                  <Button
                    onClick={handleGoBack}
                    variant="outlined"
                    disabled={isLoading || recordingRef.current}
                    className="relative flex h-9 w-fit cursor-pointer items-center justify-between rounded-lg border-[1px] border-[#D5D5D5] px-3 disabled:bg-[#AAADB1]"
                  >
                    <Avatar
                      src="/img/back.svg"
                      className="h-4 w-auto rounded-none"
                    />
                    <Typography className="ml-[6px] text-sm font-semibold normal-case text-black">
                      Back
                    </Typography>
                  </Button>
                ))
              ) : breakdown.isNew ? (
                <Button
                  onClick={handleGoBack}
                  variant="outlined"
                  disabled={isLoading || recordingRef.current}
                  className="relative flex h-9 w-fit cursor-pointer items-center justify-between rounded-lg border-[1px] border-[#D5D5D5] px-3 disabled:bg-[#AAADB1]"
                >
                  <Avatar
                    src="/img/back.svg"
                    className="h-4 w-auto rounded-none"
                  />
                  <Typography className="ml-[6px] text-sm font-semibold normal-case text-black">
                    Back
                  </Typography>
                </Button>
              ) : feedback.newFeedback ? (
                <Button
                  onClick={handleRemove}
                  variant="outlined"
                  disabled={isLoading || recordingRef.current}
                  className="relative flex h-9 w-fit cursor-pointer items-center justify-between rounded-lg border-[1px] border-[#D5D5D5] px-3 disabled:bg-[#AAADB1]"
                >
                  <Avatar
                    src="/img/trash.svg"
                    className="h-4 w-auto rounded-none"
                  />
                  <Typography className="ml-[6px] text-sm font-semibold normal-case text-black">
                    Delete
                  </Typography>
                </Button>
              ) : (
                <Button
                  onClick={handleGoSignIn}
                  variant="outlined"
                  disabled={isLoading || recordingRef.current}
                  className="relative flex h-9 w-fit cursor-pointer items-center justify-between rounded-lg border-[1px] border-[#D5D5D5] px-3 disabled:bg-[#AAADB1]"
                >
                  <Avatar
                    src="/img/user.svg"
                    className="h-3 w-auto rounded-none"
                  />
                  <Typography className="ml-[6px] text-sm font-semibold normal-case text-black">
                    Sign In
                  </Typography>
                </Button>
              )}
            </div>
            <div
              onClick={handleStartRecording}
              className={`flex h-[84px] w-[84px] cursor-pointer items-center justify-center rounded-full ${
                recordingRef.current
                  ? "bg-[#D40000]"
                  : isLoading
                  ? "bg-[#1F2122]"
                  : "bg-[#D31510]"
              }`}
            >
              {recordingRef.current ? (
                <CountdownTimer
                  status={recordingRef.current}
                  setCountTime={setCountTime}
                />
              ) : isLoading ? (
                <div className="relative h-16 w-16">
                  <Lottie
                    options={loadingOption}
                    isClickToPauseDisabled={true}
                  />
                </div>
              ) : (
                <Avatar src="/img/mic.svg" className="h-9 w-9" />
              )}
            </div>
            <div className="w-[90px]">
              {auth.isAuthenticated ? (
                breakdown.selectedBD &&
                (feedback.newFeedback ? (
                  <Button
                    onClick={handleSubmitFeedback}
                    variant="outlined"
                    disabled={isLoading || recordingRef.current}
                    className="relative flex h-9 w-fit cursor-pointer items-center justify-between rounded-lg border-[1px] border-[#D5D5D5] px-3 disabled:bg-[#AAADB1]"
                  >
                    <Avatar
                      src="/img/check.svg"
                      className="h-4 w-auto rounded-none"
                    />
                    <Typography className="ml-[6px] text-sm font-semibold normal-case text-black">
                      Submit
                    </Typography>
                  </Button>
                ) : (
                  <Button
                    onClick={handleSetShare}
                    variant="outlined"
                    disabled={
                      isLoading ||
                      recordingRef.current ||
                      breakdown.selectedBD.isShared
                    }
                    className="relative flex h-9 w-fit cursor-pointer items-center justify-between rounded-lg border-[1px] border-[#D5D5D5] px-3 disabled:bg-[#AAADB1]"
                  >
                    <Avatar
                      src="/img/share.svg"
                      className="h-4 w-auto rounded-none"
                    />
                    <Typography className="ml-[6px] text-sm font-semibold normal-case text-black">
                      Share
                    </Typography>
                  </Button>
                ))
              ) : breakdown.isNew ? (
                <Button
                  onClick={handleSetShare}
                  variant="outlined"
                  disabled={
                    isLoading ||
                    recordingRef.current ||
                    breakdown.selectedBD.isShared
                  }
                  className="relative flex h-9 w-fit cursor-pointer items-center justify-between rounded-lg border-[1px] border-[#D5D5D5] px-3 disabled:bg-[#AAADB1]"
                >
                  <Avatar
                    src="/img/share.svg"
                    className="h-4 w-auto rounded-none"
                  />
                  <Typography className="ml-[6px] text-sm font-semibold normal-case text-black">
                    Share
                  </Typography>
                </Button>
              ) : (
                feedback.newFeedback && (
                  <Button
                    onClick={handleSubmitFeedback}
                    variant="outlined"
                    disabled={isLoading || recordingRef.current}
                    className="relative flex h-9 w-fit cursor-pointer items-center justify-between rounded-lg border-[1px] border-[#D5D5D5] px-3 disabled:bg-[#AAADB1]"
                  >
                    <Avatar
                      src="/img/check.svg"
                      className="h-4 w-auto rounded-none"
                    />
                    <Typography className="ml-[6px] text-sm font-semibold normal-case text-black">
                      Submit
                    </Typography>
                  </Button>
                )
              )}
            </div>
          </div>
          <div className="mt-1 flex h-10 w-full items-center justify-center">
            {isLoading ? (
              <Typography className="text-sm font-semibold text-black">
                Processing
              </Typography>
            ) : recordingRef.current ? (
              queue.length == 30 &&
              queue.map((item, idx) => {
                const heightInPixels = `${item}px`;
                return (
                  <div
                    key={idx}
                    className="voice-animation mx-[3px] w-[4px] rounded-md bg-[#B4B4B4]"
                    style={{ height: heightInPixels }}
                  ></div>
                );
              })
            ) : breakdown.selectedBD ? (
              isFeedback ? (
                <Typography className="text-sm font-semibold text-black">
                  Give feedback
                </Typography>
              ) : (
                <Typography className="text-sm font-semibold text-black">
                  Add context for a better breakdown
                </Typography>
              )
            ) : (
              <Typography className="text-sm font-semibold text-black">
                Record
              </Typography>
            )}
          </div>
        </div>
      </div>
      <Dialog
        open={showRemoveModal}
        handler={setShowRemoveModal}
        className="!min-w-[90vw]"
      >
        <DialogHeader>
          <Typography variant="h4" className="mt-5 w-full text-center">
            Lose Your Breakdown?
          </Typography>
        </DialogHeader>
        <DialogBody>
          <div className="mb-2 h-full w-full rounded-lg px-3">
            <Typography className="w-full text-black">
              If you go back without signing up, your current breakdown will be
              lost. Sign up now to save it
            </Typography>
          </div>
          <div className="my-2 w-full">
            <Checkbox label="Don’t show this again" onChange={handleCheckbox} />
          </div>
          <div className="my-2 flex w-full justify-end gap-3">
            <Button
              onClick={handleGoBackConfirm}
              variant="outlined"
              className="flex h-10 w-[100px] items-center justify-center border-black p-0 text-base normal-case text-black shadow-none hover:shadow-none"
            >
              Go back
            </Button>
            {!auth.isAuthenticated && (
              <Button
                onClick={handleGoSignIn}
                className="flex h-10 w-[100px] items-center justify-center bg-[#D31510] p-0 text-base normal-case text-white shadow-none hover:shadow-none"
              >
                Sign In
              </Button>
            )}
          </div>
        </DialogBody>
      </Dialog>
      {showSignInModal && (
        <SignIn
          setOpenSignUp={setShowSignUpModal}
          setOpenSignIn={setShowSignInModal}
        />
      )}
      {showSignUpModal && (
        <SignUp
          setOpenSignUp={setShowSignUpModal}
          setOpenSignIn={setShowSignInModal}
        />
      )}
      <ReactMic
        record={recordingRef.current}
        className="hidden"
        onStop={onStop}
      />
    </div>
  );
};

export default Recorder;

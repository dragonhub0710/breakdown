import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Typography,
  Button,
  Checkbox,
  Dialog,
  DialogHeader,
  DialogBody,
} from "@material-tailwind/react";
import {
  getOneBreakdown,
  updateBreakdown,
  initCurrentBreakdown,
  saveNewBreakdown,
} from "@/actions/breakdown";
import Recorder from "@/widgets/recorder/recorder";
import SignIn from "@/widgets/auth/signin";
import SignUp from "@/widgets/auth/signup";
import Feedback from "@/widgets/feedback/feedback";

export function Breakdown() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isFeedback, setIsFeedback] = useState(false);
  const [overCommenters, setOverCommenters] = useState(0);
  const [isCopyDone, setIsCopyDone] = useState(false);
  const auth = useSelector((state) => state.auth);
  const breakdown = useSelector((state) => state.breakdown);
  const feedback = useSelector((state) => state.feedback);

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (id != "new" && breakdown.selectedBD) {
      if (!token && !breakdown.isNew) {
        // checking the public breakdown before login
        setIsFeedback(true);
      }

      if (token && auth.user && breakdown.selectedBD.userId != auth.user.id) {
        // checking the breakdown as viewer after login
        setIsFeedback(true);
      }

      if (
        breakdown.selectedBD.commenters &&
        breakdown.selectedBD.commenters.length > 5
      ) {
        setOverCommenters(breakdown.selectedBD.commenters.length - 5);
      }
    }
  }, [breakdown.selectedBD]);

  useEffect(() => {
    if (id != "new") {
      dispatch(getOneBreakdown({ shareId: id }));
    } else {
      if (!breakdown.selectedBD) {
        navigate("/recording");
      }
    }
  }, [auth.isAuthenticated]);

  const handleGoBreakdowns = () => {
    if (id == "new" && !breakdown.selectedBD.id) {
      dispatch(saveNewBreakdown({ breakdown: breakdown.selectedBD })).then(
        () => {
          navigate("/");
        }
      );
    } else {
      navigate("/");
    }
  };

  const handleSetShare = () => {
    if (id == "new" && !breakdown.selectedBD.id) {
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
  };

  const handleGoSignIn = () => {
    setShowSignInModal((showSignInModal) => !showSignInModal);
    setShowRemoveModal(false);
  };

  const handleGoBack = () => {
    if (!breakdown.isNew) {
      dispatch(initCurrentBreakdown());
      navigate("/");
    } else {
      const hideModalFlag = localStorage.getItem("hideModalFlag");
      if (!hideModalFlag) {
        setShowRemoveModal((prev) => !prev);
      } else {
        dispatch(initCurrentBreakdown());
        navigate("/");
      }
    }
  };

  const handleFeedback = () => {
    if (auth.isAuthenticated && auth.user.id == breakdown.selectedBD.userId) {
      setShowFeedbackModal(true);
    }
  };

  const handleCopyText = () => {
    const extractedText = extractTextFromContent(breakdown.selectedBD.content);
    navigator.clipboard.writeText(extractedText);
    setIsCopyDone(true);
    setTimeout(() => {
      setIsCopyDone(false);
    }, 2000);
  };

  const extractTextFromContent = (content) => {
    // Create a temporary DOM element
    const tempElement = document.createElement("div");

    // Set the inner HTML of the temporary element
    tempElement.innerHTML = content;

    // Extract the text content
    const extractedText = tempElement.textContent || tempElement.innerText;

    return extractedText;
  };

  return (
    <>
      <div className="mx-auto flex h-full min-h-screen w-full max-w-[450px] flex-col">
        <div className="fixed left-0 top-0 flex w-full justify-end bg-white p-4">
          <Button
            variant="outlined"
            onClick={handleCopyText}
            className={`flex h-9 items-center justify-center gap-1 border-[1px] border-[#D4D4D4] px-3 text-sm font-medium normal-case text-black ${
              isCopyDone ? "bg-[#0000001F]" : "bg-[white]"
            }`}
          >
            <Avatar src="/img/copy.svg" className="h-3 w-auto rounded-none" />
            {isCopyDone ? "Copied!" : "Copy"}
          </Button>
          {/* {auth.isAuthenticated ? (
            <div className="flex w-full justify-between gap-3 bg-white p-4">
              <Button
                variant="outlined"
                onClick={handleGoBreakdowns}
                className="flex h-10 w-44 cursor-pointer items-center justify-center rounded-lg border-[1px] border-[#D5D5D5] p-0"
              >
                <Avatar src="/img/back.svg" className="h-4 w-auto" />
                <Typography className="ml-4 text-lg font-semibold normal-case text-black">
                  Breakdowns
                </Typography>
              </Button>
              <Button
                onClick={handleSetShare}
                variant="outlined"
                disabled={breakdown.selectedBD && breakdown.selectedBD.isShared}
                className="flex h-10 w-44 items-center justify-center rounded-lg border-[1px] border-[#D5D5D5] p-0"
              >
                <Avatar src="/img/share.svg" className="h-4 w-6" />
                <Typography className="ml-2 text-base font-semibold normal-case text-black">
                  Copy & Share
                </Typography>
              </Button>
            </div>
          ) : (
            <div className="flex w-full justify-between gap-3 bg-white p-4">
              <div
                onClick={handleGoBack}
                className="flex h-10 w-44 cursor-pointer items-center justify-center rounded-lg border-[1px] border-[#D5D5D5]"
              >
                <Avatar src="/img/back.svg" className="h-4 w-auto" />
                <Typography className="ml-4 text-base font-semibold">
                  Back
                </Typography>
              </div>
              <div
                onClick={handleGoSignIn}
                className="flex h-10 w-44 cursor-pointer items-center justify-center rounded-lg border-[1px] border-[#D5D5D5]"
              >
                <Typography className="text-base font-semibold">
                  Sign In
                </Typography>
              </div>
            </div>
          )} */}
        </div>

        <div className="flex h-full flex-col items-center overflow-y-auto p-4 pb-40 pt-16">
          {breakdown.selectedBD && (
            <>
              <div className="w-full">
                <Typography className="text-start text-2xl font-bold">
                  {breakdown.selectedBD.title}
                </Typography>
              </div>
              <div
                onClick={handleFeedback}
                className={`my-2 flex h-8 w-full cursor-pointer items-center px-2 ${
                  !breakdown.selectedBD.commenters && "hidden"
                }`}
              >
                {breakdown.selectedBD.commenters &&
                  breakdown.selectedBD.commenters
                    .slice(0, 5)
                    .map((commenter, idx) => {
                      return (
                        <div
                          key={idx}
                          className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full border-[1px] border-[white] bg-[#9599FF] text-base font-bold capitalize text-[black]"
                        >
                          {commenter}
                        </div>
                      );
                    })}
                {overCommenters > 0 && (
                  <div className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full border-[1px] border-[white] bg-[#D31510] text-sm font-normal capitalize text-[white]">
                    +{overCommenters}
                  </div>
                )}
              </div>
              <div className="prose">
                <div
                  dangerouslySetInnerHTML={{
                    __html: breakdown.selectedBD.content,
                  }}
                  className="text-base font-normal"
                />
              </div>
            </>
          )}
        </div>
      </div>
      <Recorder
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        isFeedback={isFeedback}
      />

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
      {showFeedbackModal && (
        <Feedback
          setOpenFeedback={setShowFeedbackModal}
          setOpenSignIn={setShowSignInModal}
        />
      )}
    </>
  );
}

export default Breakdown;

import React, { useState } from "react";
import {
  Avatar,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  Button,
  Checkbox,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import Recorder from "@/widgets/recorder/recorder";
import { useDispatch, useSelector } from "react-redux";
import SignIn from "@/widgets/auth/signin";
import SignUp from "@/widgets/auth/signup";
import {
  createNewSummary,
  initCurrentItem,
  updateSummary,
} from "@/actions/summary";

export function Summary() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const auth = useSelector((state) => state.auth);
  const summary = useSelector((state) => state.summary);

  const handleCheckbox = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleGoBack = () => {
    const hideModalFlag = localStorage.getItem("hideModalFlag");
    if (!hideModalFlag) {
      setShowModal((showModal) => !showModal);
    } else {
      dispatch(initCurrentItem());
      navigate("/");
    }
  };

  const handleGoSignIn = () => {
    setShowSignInModal((showSignInModal) => !showSignInModal);
    setShowModal(false);
  };

  const handleGoBackConfirm = () => {
    if (isChecked) {
      localStorage.setItem("hideModalFlag", true);
    }
    navigate("/");
  };

  const handleShowModal = () => {
    setShowModal((showModal) => !showModal);
  };

  const handleGoShare = () => {
    if (summary.selectedItem && !summary.selectedItem.isShared) {
      if (summary.isNew) {
        dispatch(
          createNewSummary({
            summary: summary.selectedItem,
            isShared: true,
          })
        );
      } else if (summary.selectedItem.userId == auth.user.id) {
        dispatch(
          updateSummary({
            summary: summary.selectedItem,
            isShared: true,
          })
        );
      }
    }
  };

  const handleGoBreakdowns = () => {
    if (summary.isNew) {
      dispatch(
        createNewSummary({
          summary: summary.selectedItem,
          isShared: false,
        })
      ).then(() => {
        navigate("/list");
      });
    } else {
      navigate("/list");
    }
  };

  return (
    <>
      <div className="h-screen w-full">
        {auth.isAuthenticated ? (
          <div className="flex w-full justify-between gap-3 p-4">
            <div
              onClick={handleGoBreakdowns}
              className="flex h-10 w-44 cursor-pointer items-center justify-center rounded-lg border-[1px] border-[#D5D5D5]"
            >
              <Avatar src="img/back.svg" className="h-4 w-auto" />
              <Typography className="ml-4 text-base font-semibold">
                Breakdowns
              </Typography>
            </div>
            <div
              onClick={handleGoShare}
              className={`flex h-10 w-44 items-center justify-center rounded-lg border-[1px] border-[#D5D5D5] ${
                summary.selectedItem && !summary.selectedItem.isShared
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50"
              }`}
            >
              <Avatar src="img/share.svg" className="h-6 w-auto" />
              <Typography className="ml-4 text-base font-semibold">
                Copy & Share
              </Typography>
            </div>
          </div>
        ) : (
          <div className="flex w-full justify-between gap-3 p-4">
            <div
              onClick={handleGoBack}
              className="flex h-10 w-44 cursor-pointer items-center justify-center rounded-lg border-[1px] border-[#D5D5D5]"
            >
              <Avatar src="img/back.svg" className="h-4 w-auto" />
              <Typography className="ml-4 text-base font-semibold">
                Back
              </Typography>
            </div>
            <div
              onClick={handleGoSignIn}
              className="flex h-10 w-44 cursor-pointer items-center justify-center rounded-lg border-[1px] border-[#D5D5D5]"
            >
              <Typography className="text-base font-semibold">
                Sign In to share
              </Typography>
            </div>
          </div>
        )}
        <div className="h-full max-h-[calc(100vh-72px)] w-full overflow-y-auto p-4">
          {summary && summary.selectedItem && (
            <div className="mb-4 text-2xl font-bold">
              {summary.selectedItem.title}
            </div>
          )}
          {summary && summary.selectedItem && (
            <div className="prose">
              <div
                dangerouslySetInnerHTML={{
                  __html: summary.selectedItem.content,
                }}
                className="text-base font-normal"
              />
            </div>
          )}
        </div>
        <Recorder />
      </div>
      <Dialog open={showModal} handler={setShowModal} className="!min-w-[90vw]">
        <DialogHeader>
          <Typography variant="h4" className="mt-5 w-full text-center">
            Lose Your Breakdown?
          </Typography>
          <div onClick={handleShowModal} className="absolute right-3 top-3">
            <Avatar src="img/close.svg" className="h-6 w-6" />
          </div>
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
            <Button
              onClick={handleGoSignIn}
              className="flex h-10 w-[100px] items-center justify-center bg-[#D31510] p-0 text-base normal-case text-white shadow-none hover:shadow-none"
            >
              Sign In
            </Button>
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
    </>
  );
}

export default Summary;

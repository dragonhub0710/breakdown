import React, { useEffect, useState } from "react";
import { Typography, Avatar, Button } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Recorder from "@/widgets/recorder/recorder";
import SignIn from "@/widgets/auth/signin";
import SignUp from "@/widgets/auth/signup";

export function Recording() {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const breakdown = useSelector((state) => state.breakdown);
  const [isLoading, setIsLoading] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  useEffect(() => {
    if (breakdown.selectedBD) {
      navigate(`/breakdown/new`);
    }
  }, [breakdown.selectedBD]);

  const handleGoSignIn = () => {
    setShowSignInModal(true);
  };

  return (
    <>
      <div className="relative mx-auto flex h-screen w-full max-w-[450px] flex-col items-center p-5">
        {!auth.isAuthenticated && (
          <div className="flex w-full justify-center">
            <Button
              onClick={handleGoSignIn}
              variant="outlined"
              disabled={isLoading}
              className="relative flex h-10 w-full cursor-pointer items-center justify-center rounded-lg border-[1px] border-[#D5D5D5] disabled:bg-[#AAADB1]"
            >
              <div className="absolute left-5 top-0 flex h-full items-center">
                <Avatar
                  src="/img/user.svg"
                  className="h-4 w-auto rounded-none"
                />
              </div>
              <Typography className="ml-4 text-lg font-semibold normal-case text-black">
                Sign In
              </Typography>
            </Button>
          </div>
        )}
        <div className="flex flex-1 flex-col items-center justify-center">
          <Typography className="my-4 text-center text-3xl font-bold">
            Share your thoughts
          </Typography>
          <Typography className="my-4 text-center text-lg font-normal">
            Speak openly about your plan or task to get an easy, actionable
            breakdown for you or your team
          </Typography>
        </div>
        <Recorder
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          isFeedback={false}
        />
      </div>
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

export default Recording;

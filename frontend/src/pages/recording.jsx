import React, { useEffect, useState } from "react";
import { Typography, Avatar, Button } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Recorder from "@/widgets/recorder/recorder";

export function Recording() {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const breakdown = useSelector((state) => state.breakdown);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (breakdown.selectedBD) {
      navigate(`/breakdown/new`);
    }
  }, [breakdown.selectedBD]);

  return (
    <>
      <div className="relative mx-auto flex h-screen w-full max-w-[450px] flex-col items-center p-5">
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
          isRecordingPage={true}
        />
      </div>
    </>
  );
}

export default Recording;

import React, { useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Recorder from "@/widgets/recorder/recorder";

export function Home() {
  const navigate = useNavigate();
  const summary = useSelector((state) => state.summary);

  useEffect(() => {
    if (summary && summary.selectedItem) {
      navigate("/summary");
    }
  }, [summary.selectedItem]);

  return (
    <>
      <div className="relative flex h-screen w-full items-center justify-center p-5">
        <div className="text-center">
          <Typography className="my-4 text-3xl font-bold">
            Share your thoughts
          </Typography>
          <Typography className="my-4 text-lg font-normal">
            Speak openly about your plan or task to get an easy, actionable
            breakdown for you or your team
          </Typography>
        </div>
        <Recorder />
      </div>
    </>
  );
}

export default Home;

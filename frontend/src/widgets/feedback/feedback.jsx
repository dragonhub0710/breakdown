import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Avatar, Alert, Button } from "@material-tailwind/react";
import {
  deleteFeedback,
  approveFeedback,
  rejectFeedback,
  createFeedback,
  initFeedback,
  getFeedbackList,
} from "@/actions/feedback";

const Feedback = (props) => {
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const { setOpenFeedback, setOpenSignIn } = props;
  const [feedbackList, setFeedbackList] = useState([]);
  const auth = useSelector((state) => state.auth);
  const breakdown = useSelector((state) => state.breakdown);
  const feedback = useSelector((state) => state.feedback);

  useEffect(() => {
    let list = [];
    if (feedback.isNew) {
      let user = "Anonymous";
      if (auth.isAuthenticated) {
        user = auth.user.username;
      }
      const data = {
        content: feedback.newFeedback,
        username: user,
        isApproved: false,
      };
      list = [data];
    } else {
      dispatch(getFeedbackList({ breakdownId: breakdown.selectedBD.id }));
    }
    setFeedbackList(list);
  }, []);

  useEffect(() => {
    if (feedback.feedbackList && feedback.feedbackList.length > 0) {
      let list = [...feedback.feedbackList];
      setFeedbackList(list);
    }
  }, [feedback.feedbackList]);

  const handleGoSignIn = () => {
    setOpenSignIn((openSignIn) => !openSignIn);
  };

  const handleGoBack = () => {
    dispatch(initFeedback());
    setOpenFeedback((openFeedback) => !openFeedback);
  };

  const handleRemove = (feedbackId) => {
    if (feedbackId == -1) {
      dispatch(rejectFeedback());
      setOpenFeedback((openFeedback) => !openFeedback);
    } else {
      dispatch(
        deleteFeedback({
          id: feedbackId,
          breakdownId: breakdown.selectedBD.id,
        })
      );
    }
  };

  const handleApprove = (feedbackId) => {
    if (feedbackId == -1) {
      // create new feedback
      const data = {
        content: feedback.newFeedback,
        userId: auth.isAuthenticated ? auth.user.id : -1,
        breakdownId: breakdown.selectedBD.id,
        shareId: breakdown.selectedBD.shareId,
      };
      dispatch(createFeedback(data));
      dispatch(initFeedback());
      setOpenFeedback((openFeedback) => !openFeedback);
    } else {
      // approve feedback
      dispatch(
        approveFeedback({
          id: feedbackId,
          breakdownId: breakdown.selectedBD.id,
        })
      ).then(() => {
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
      });
    }
  };

  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-full bg-white">
      {showToast && (
        <div className="fixed bottom-4 left-0 z-50 flex w-full justify-center">
          <Alert className="w-fit bg-black text-white">
            Approved and added to breakdown
          </Alert>
        </div>
      )}
      <div className="relative flex h-full w-full flex-col justify-between gap-3 bg-white">
        <div className="mx-auto h-full w-full max-w-[450px] overflow-y-auto p-4 pb-[100px]">
          <Typography className="mt-10 text-3xl font-bold">Feedback</Typography>
          {feedbackList &&
            feedbackList.length > 0 &&
            feedbackList.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`flex flex-col gap-3 ${
                    index != feedbackList.length - 1 &&
                    "border-b-[1px] border-b-[#D5D5D5]"
                  } py-4`}
                >
                  <div className="my-2 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9599FF] text-xl font-bold capitalize">
                      {item.username[0]}
                    </div>
                    <Typography className="mx-4 text-xl font-bold capitalize">
                      {item.username}
                    </Typography>
                  </div>
                  <Typography className="text-base font-normal">
                    {item.content}
                  </Typography>
                  <div className="flex w-full gap-4">
                    <Button
                      variant="outlined"
                      onClick={() => handleRemove(item.id || -1, item.userId)}
                      className="flex h-10 items-center justify-center gap-2 border-[1px] border-[#D5D5D5] px-3 py-0 text-base font-semibold text-black"
                    >
                      <Avatar
                        src="/img/trash.svg"
                        className="h-4 w-auto rounded-none"
                      />
                      <Typography className="text-base font-semibold normal-case">
                        Remove
                      </Typography>
                    </Button>
                    <Button
                      variant="outlined"
                      disabled={item.isApproved}
                      onClick={() => handleApprove(item.id || -1)}
                      className="flex h-10 items-center justify-center gap-2 border-[1px] border-[#D5D5D5] px-3 py-0 text-base font-semibold text-black"
                    >
                      <Avatar
                        src="/img/check.svg"
                        className="h-auto w-6 rounded-none"
                      />
                      <Typography className="text-base font-semibold normal-case">
                        Approve
                      </Typography>
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="absolute bottom-0 flex w-full justify-center gap-3 border-t-[1px] bg-white px-10 py-7">
          <Button
            variant="outlined"
            className="flex w-full justify-center gap-6 border-[1px] border-[#D5D5D5] text-center"
            onClick={handleGoBack}
          >
            <Avatar
              src="/img/backward-arrow.svg"
              className="h-4 w-auto rounded-none"
            />
            <Typography className="text-sm font-semibold normal-case text-black">
              Back to breakdown
            </Typography>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;

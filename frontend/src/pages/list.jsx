import React, { useEffect, useState } from "react";
import {
  Avatar,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  Button,
} from "@material-tailwind/react";
import { UserIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyList,
  getPublicList,
  removeSummary,
  getSummary,
} from "@/actions/summary";

export function List() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const auth = useSelector((state) => state.auth);
  const summary = useSelector((state) => state.summary);

  useEffect(() => {
    if (auth.isAuthenticated) {
      dispatch(getMyList());
      dispatch(getPublicList());
    }
  }, [auth.isAuthenticated]);

  const handleGoBack = () => {
    navigate("/");
  };

  const handleShowRemoveModal = () => {
    setShowRemoveModal((showRemoveModal) => !showRemoveModal);
  };

  const handleRemove = () => {
    dispatch(removeSummary({ id }));
  };

  const handleGotoSummary = (id) => {
    dispatch(getSummary({ id })).then(() => navigate(`/summary`));
  };

  return (
    <>
      <div className="h-screen w-full">
        <div className="flex w-full p-4">
          <div
            onClick={handleGoBack}
            className="flex h-10 w-44 cursor-pointer items-center justify-center rounded-lg border-[1px] border-[#D5D5D5]"
          >
            <Avatar src="img/back.svg" className="h-4 w-auto" />
            <Typography className="ml-4 text-base font-semibold">
              Back
            </Typography>
          </div>
        </div>
        <div className="h-full max-h-[calc(100vh-72px)] w-full overflow-y-auto p-4 pb-[180px]">
          {summary.mylist.map((item) => {
            return (
              <div
                key={item.id}
                onClick={() => handleGotoSummary(item.id)}
                className="my-2 flex w-full cursor-pointer flex-col gap-2 rounded-lg border-[1px] border-[#D5D5D5] px-4 py-6"
              >
                <Typography className="line-clamp-2 overflow-hidden text-xl font-bold text-[#1F2122]">
                  {item.title}
                </Typography>
                <Typography className="line-clamp-2 overflow-hidden text-base text-[#414346]">
                  {/* {item.content} */}
                  hello world hello world hello world hello world hello world
                </Typography>
                <div className="flex h-6 w-full items-center justify-between">
                  <div className="flex h-full w-fit items-center rounded-full bg-[#FFEBE7] px-2 text-sm font-bold text-[#D31510]">
                    Owner
                  </div>
                  <div onClick={handleShowRemoveModal}>
                    <Avatar src="img/trash.svg" className="h-5 w-auto" />
                  </div>
                </div>
              </div>
            );
          })}
          {summary.publiclist.map((item) => {
            return (
              <div
                key={item.id}
                className="flex w-full flex-col gap-2 rounded-lg border-[1px] border-[#D5D5D5] px-4 py-6"
              >
                <Typography className="line-clamp-2 overflow-hidden text-xl font-bold text-[#1F2122]">
                  {item.title}
                </Typography>
                <Typography className="line-clamp-2 overflow-hidden text-base text-[#414346]">
                  {item.content}
                </Typography>
                <div className="flex h-6 w-full items-center justify-between">
                  <div className="flex h-full w-fit items-center rounded-full bg-[#FFECCC] px-2 text-base font-bold text-[#B14700]">
                    Viewer
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="fixed bottom-0 left-0 right-0">
          <div className="flex h-36 w-full flex-col gap-4 border-t-[1px] border-[#D5D5D5] bg-white px-5 py-4">
            <div className="flex w-full items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D31510]">
                <Avatar src="img/mic.svg" className="h-5 w-auto" />
              </div>
              <Typography className="text-[32px] font-black tracking-tighter text-[#1F2122]">
                BREAKDOWNS
              </Typography>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D5D5D5]">
                <UserIcon className="h-8 w-8" />
              </div>
            </div>
            <div className="flex w-full items-center justify-center rounded-lg border-[1px] border-[#D5D5D5] px-4 py-2">
              <Typography className="text-base font-normal text-[#414346]">
                Upgrade to unlimited: $9.99/mo
              </Typography>
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
                If you delete this breakdown, you will no longer have access to
                it or be able to modify it
              </Typography>
            </div>
            <div className="my-2 flex w-full justify-end gap-3">
              <Button
                onClick={handleShowRemoveModal}
                variant="outlined"
                className="flex h-10 w-[100px] items-center justify-center border-[#D5D5D5] p-0 text-base normal-case text-black shadow-none hover:shadow-none"
              >
                Keep
              </Button>
              <Button
                onClick={handleRemove}
                className="flex h-10 w-[100px] items-center justify-center bg-[#D31510] p-0 text-base normal-case text-white shadow-none hover:shadow-none"
              >
                Delete
              </Button>
            </div>
          </DialogBody>
        </Dialog>
      </div>
    </>
  );
}

export default List;

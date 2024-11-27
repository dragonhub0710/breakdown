import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  Avatar,
  Alert,
  Button,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { signout } from "@/actions/auth";
import {
  getMyList,
  getPublicList,
  deleteBreakdown,
  initCurrentBreakdown,
} from "@/actions/breakdown";

export function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [limited, setLimited] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [breakdownId, setBreakdownId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const auth = useSelector((state) => state.auth);
  const breakdown = useSelector((state) => state.breakdown);

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (!token) {
      navigate("/recording");
    }
  }, []);

  useEffect(() => {
    if (auth.isAuthenticated) {
      dispatch(initCurrentBreakdown());
      dispatch(getMyList());
      dispatch(getPublicList());
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    if (breakdown.myList.length === 0 && breakdown.publicList.length === 0) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, [breakdown.myList, breakdown.publicList]);

  const handleSignout = () => {
    dispatch(signout());
    navigate("/recording");
  };

  const handleShowRemoveModal = (id, e) => {
    e.stopPropagation();
    setShowRemoveModal(true);
    setBreakdownId(id);
  };

  const handleRemove = () => {
    dispatch(deleteBreakdown({ id: breakdownId }));
    setShowRemoveModal(false);
  };

  const handleUpgrade = () => {
    setLimited(true);
  };

  const handleCopyLink = (id, e) => {
    e.stopPropagation(); // Prevent triggering the parent div's onClick
    const shareUrl = `${window.location.origin}/breakdown/${id}`;
    navigator.clipboard.writeText(shareUrl);

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000); // Hide after 2 seconds
  };

  const handleGotoBreakdown = (id) => {
    navigate(`/breakdown/${id}`);
  };

  const handleCreateNewBreakdown = () => {
    dispatch(initCurrentBreakdown());
    navigate("/recording");
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
      <div className="mx-auto flex h-full w-full max-w-[450px] flex-col p-4 pb-36">
        {showToast && (
          <Alert className="fixed left-1/2 top-4 z-50 flex w-fit -translate-x-1/2 transform bg-black text-white">
            Link copied!
          </Alert>
        )}
        {isEmpty && (
          <div className="flex h-screen w-full flex-col items-center justify-center p-10 text-center">
            <Typography className="text-2xl font-bold">
              No Breakdowns Yet
            </Typography>
            <Typography className="my-4 text-lg font-normal">
              Start sharing your thoughts and we’ll break them down for you and
              your team!
            </Typography>
          </div>
        )}
        {breakdown.myList.length > 0 &&
          breakdown.myList.map((item, idx) => {
            return (
              <div
                key={idx}
                onClick={() => handleGotoBreakdown(item.shareId)}
                className="my-2 flex w-full cursor-pointer flex-col gap-2 rounded-lg border-[1px] border-[#D5D5D5] px-4 py-6"
              >
                <Typography className="line-clamp-2 overflow-hidden text-xl font-bold text-[#1F2122]">
                  {item.title}
                </Typography>
                <Typography className="line-clamp-2 overflow-hidden text-base font-normal text-[#414346]">
                  {extractTextFromContent(item.content)}
                </Typography>
                <div className="flex h-6 w-full items-center justify-between">
                  <div className="flex h-full items-center gap-5">
                    <div className="flex h-full w-fit items-center rounded-full bg-[#FFEBE7] px-2 text-sm font-bold text-[#D31510]">
                      Owner
                    </div>
                    <div className="flex h-6 items-center">
                      {item.commenters &&
                        item.commenters.length > 0 &&
                        item.commenters.slice(0, 5).map((commenter, idx) => {
                          return (
                            <div
                              key={idx}
                              className="-ml-2 flex h-6 w-6 items-center justify-center rounded-full border-[1px] border-[white] bg-[#59A7F6] text-sm font-bold text-[black]"
                            >
                              {commenter}
                            </div>
                          );
                        })}
                      {item.commenters && item.commenters.length > 5 && (
                        <div className="-ml-2 flex h-6 w-6 items-center justify-center rounded-full border-[1px] border-[white] bg-[#D31510] text-xs font-normal capitalize text-[white]">
                          +{item.commenters.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div
                      className="cursor-pointer"
                      onClick={(e) => handleCopyLink(item.shareId, e)}
                    >
                      <Avatar src="/img/share.svg" className="h-5 w-auto" />
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={(e) => handleShowRemoveModal(item.id, e)}
                    >
                      <Avatar src="/img/trash.svg" className="h-5 w-auto" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        {breakdown.publicList.length > 0 &&
          breakdown.publicList.map((item, idx) => {
            return (
              <div
                key={idx}
                onClick={() => handleGotoBreakdown(item.shareId)}
                className="my-2 flex w-full cursor-pointer flex-col gap-2 rounded-lg border-[1px] border-[#D5D5D5] px-4 py-6"
              >
                <Typography className="line-clamp-2 overflow-hidden text-xl font-bold text-[#1F2122]">
                  {item.title}
                </Typography>
                <Typography className="line-clamp-2 overflow-hidden text-base font-normal text-[#414346]">
                  {extractTextFromContent(item.content)}
                </Typography>
                <div className="flex h-6 w-full items-center justify-between">
                  <div className="flex h-full items-center gap-5">
                    <div className="flex h-full w-fit items-center rounded-full bg-[#FFECCC] px-2 text-sm font-bold text-[#B14C00]">
                      Viewer
                    </div>
                    <div className="flex h-6 items-center">
                      {item.commenters &&
                        item.commenters.length > 0 &&
                        item.commenters.slice(0, 5).map((commenter, idx) => {
                          return (
                            <div
                              key={idx}
                              className="-ml-2 flex h-6 w-6 items-center justify-center rounded-full border-[1px] border-[white] bg-[#59A7F6] text-sm font-bold capitalize text-[black]"
                            >
                              {commenter}
                            </div>
                          );
                        })}
                      {item.commenters && item.commenters.length > 5 && (
                        <div className="-ml-2 flex h-6 w-6 items-center justify-center rounded-full border-[1px] border-[white] bg-[#D31510] text-xs font-normal capitalize text-[white]">
                          +{item.commenters.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        <div className="fixed bottom-0 left-0 right-0">
          <div className="flex h-36 w-full flex-col gap-4 border-t-[1px] border-[#D5D5D5] bg-white px-5 py-4">
            <div className="mx-auto flex w-full max-w-[450px] items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D31510]">
                <Avatar src="/img/mic.svg" className="h-5 w-auto" />
              </div>
              <Typography className="text-[32px] font-black tracking-tighter text-[#1F2122]">
                BREAKDOWN
              </Typography>
              <Menu placement="top-end">
                <MenuHandler>
                  <div className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-2 border-[black] bg-[#D5D5D5]">
                    <Avatar src="/img/user.png" className="h-11 w-11" />
                  </div>
                </MenuHandler>
                <MenuList>
                  <MenuItem
                    onClick={handleSignout}
                    className="flex items-center justify-between gap-3"
                  >
                    <Typography className="font-semibold text-black">
                      Sign Out
                    </Typography>
                    <Avatar src="/img/signout.svg" className="h-5 w-auto" />
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
            <div className="mx-auto flex w-full max-w-[450px] items-center justify-between gap-3 py-2">
              <Button
                variant="outlined"
                onClick={handleCreateNewBreakdown}
                className="flex h-10 w-40 items-center justify-center border-[1px] border-[#D5D5D5] p-0 text-base font-medium normal-case text-black"
              >
                New Breakdown
              </Button>
              <Button
                variant="outlined"
                onClick={handleUpgrade}
                className={`flex h-10 w-40 items-center justify-center border-[1px] border-[#D5D5D5] p-0 text-base font-medium normal-case ${
                  limited ? "bg-[#D31510] text-white" : "bg-white text-black"
                }`}
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>

        <Dialog
          open={showRemoveModal}
          handler={setShowRemoveModal}
          className="!w-[90vw] !max-w-[450px]"
        >
          <DialogHeader>
            <Typography variant="h4" className="mt-5 w-full text-center">
              Lose Your Breakdown?
            </Typography>
          </DialogHeader>
          <DialogBody>
            <div className="mb-2 h-full w-full rounded-lg px-3">
              <Typography className="w-full font-normal text-black">
                If you delete this breakdown, you will no longer have access to
                it or be able to modify it
              </Typography>
            </div>
            <div className="my-2 flex w-full justify-end gap-3">
              <Button
                onClick={() => setShowRemoveModal(false)}
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

export default Home;

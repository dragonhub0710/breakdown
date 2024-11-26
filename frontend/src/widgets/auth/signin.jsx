import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Lottie from "react-lottie";
import Loading_Animation from "../solid_loading.json";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Typography, Avatar, Input } from "@material-tailwind/react";
import { signin } from "@/actions/auth";

const SignIn = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailRequired, setEmailRequired] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const { setOpenSignUp, setOpenSignIn } = props;
  const loadingOptions = {
    loop: true,
    autoplay: true,
    animationData: Loading_Animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleClose = () => {
    setOpenSignIn(false);
  };

  const handleGotoSignUp = () => {
    setOpenSignIn(false);
    setOpenSignUp(true);
  };

  const handleEmailChange = (e) => {
    if (e.target.value == "") {
      setEmailRequired(true);
    } else {
      setEmailRequired(false);
    }
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    if (e.target.value == "") {
      setPasswordRequired(true);
    } else {
      setPasswordRequired(false);
    }
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    if (email == "") {
      setEmailRequired(true);
      return;
    }
    if (password == "") {
      setPasswordRequired(true);
      return;
    }
    const data = { email, password };

    setLoading(true);
    dispatch(signin(data))
      .then(() => {
        setLoading(false);
        setOpenSignIn(false);
      })
      .catch(() => setLoading(false));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="fixed left-0 top-0 z-40 flex h-full w-full items-center justify-center backdrop-blur-md">
      <div className="mx-auto flex w-[90vw] max-w-[400px] flex-col gap-3 rounded-lg border-[1px] border-[#D9D9D9] bg-white p-4">
        <div
          onClick={handleClose}
          className="flex w-full cursor-pointer justify-between"
        >
          <Typography className="text-2xl font-bold">Sign In</Typography>
          <Avatar src="/img/close.svg" className="h-6 w-6" />
        </div>
        <Typography className="text-base font-normal">
          Sign in to save and share breakdowns with your team
        </Typography>
        <a href={`${import.meta.env.VITE_API_BASED_URL}/auth/google`}>
          <div className="relative flex h-10 w-full cursor-pointer items-center justify-center rounded-lg border-[1px] border-[#D9D9D9]">
            <div className="absolute left-5 top-0 flex h-full w-4 items-center">
              <Avatar src="/img/google.svg" className="h-4 w-4" />
            </div>
            <Typography className="text-base font-semibold">
              Continue with Google
            </Typography>
          </div>
        </a>
        <div className="relative w-full">
          <div className="flex h-[42px] w-full items-center rounded-lg border-[1px] border-[#D9D9D9]">
            <Input
              value={email}
              onChange={handleEmailChange}
              onKeyDown={handleKeyDown}
              className="!border-none !text-base !text-black"
              placeholder="Enter email"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          {emailRequired && (
            <Typography color="red" className="text-sm font-normal">
              *This field is required
            </Typography>
          )}
        </div>
        <div className="relative w-full">
          <div className="flex h-[42px] w-full items-center rounded-lg border-[1px] border-[#D9D9D9]">
            <Input
              value={password}
              type={passwordShow ? "text" : "password"}
              onChange={handlePasswordChange}
              onKeyDown={handleKeyDown}
              className="!border-none !text-base !text-black"
              placeholder="Enter password"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {passwordShow ? (
              <EyeIcon
                className="mx-2 h-5 w-5 cursor-pointer"
                onClick={() => setPasswordShow(!passwordShow)}
              />
            ) : (
              <EyeSlashIcon
                className="mx-2 h-5 w-5 cursor-pointer"
                onClick={() => setPasswordShow(!passwordShow)}
              />
            )}
          </div>
          {passwordRequired && (
            <Typography color="red" className="text-sm font-normal">
              *This field is required
            </Typography>
          )}
        </div>
        <div
          onClick={handleSubmit}
          className="flex h-10 w-full cursor-pointer items-center justify-center rounded-lg bg-[#D31510]"
        >
          {loading && (
            <div className="flex h-8 w-8 items-center justify-center">
              <Lottie options={loadingOptions} isClickToPauseDisabled={true} />
            </div>
          )}
          <Typography className="text-base font-semibold text-white">
            Sign In
          </Typography>
        </div>
        <div className="mt-4 flex w-full flex-col items-center justify-center gap-2">
          <Typography className="text-base font-normal">
            Don’t have an account yet?
          </Typography>
          <Typography
            onClick={handleGotoSignUp}
            className="cursor-pointer border-b-[1px] border-b-[#D31510] text-base font-normal text-[#D31510]"
          >
            Sign Up
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

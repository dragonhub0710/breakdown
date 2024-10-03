import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Typography, Input } from "@material-tailwind/react";
import Lottie from "react-lottie";
import Loading_Animation from "../widgets/solid_loading.json";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { signin } from "@/actions/auth";

export function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);
  const [emailRequired, setEmailRequired] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const loadingOptions = {
    loop: true,
    autoplay: true,
    animationData: Loading_Animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
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
    setLoading(true);
    const data = { email, password };
    dispatch(signin(data))
      .then(() => {
        setLoading(false);
        navigate("/");
      })
      .catch(() => setLoading(false));
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

  return (
    <>
      <div className="container mx-auto flex h-full min-h-screen justify-center pt-28 lg:pt-36">
        <div className="flex flex-col items-center">
          <div className="w-full text-center">
            <Typography variant="h1" className="text-center font-semibold">
              Sign In
            </Typography>
          </div>
          <div className="relative mx-auto mt-4 flex w-full flex-col justify-center lg:mt-8">
            <div className="mx-auto my-2 w-80 lg:my-4">
              <div className="flex items-center rounded-full border-[1px] border-[#77777763] bg-[#eff2f6] pl-3">
                <Input
                  label=""
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleEmailChange}
                  className="!border-none !text-base !text-black"
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
            <div className="mx-auto my-2 w-80 lg:my-4">
              <div className="flex items-center rounded-full border-[1px] border-[#77777763] bg-[#eff2f6] pl-3">
                <Input
                  label=""
                  value={password}
                  placeholder="Password"
                  type={passwordShow ? "text" : "password"}
                  onChange={handlePasswordChange}
                  className="!border-none !text-base !text-black"
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
            <Button
              variant="filled"
              onClick={handleSubmit}
              className="mx-auto mt-6 flex h-[50px] w-[200px] items-center justify-center rounded-full bg-[#4728f8] normal-case shadow-none hover:shadow-none"
            >
              <div className="flex items-center justify-center">
                {loading && (
                  <div className="flex h-8 w-8 items-center justify-center">
                    <Lottie
                      options={loadingOptions}
                      isClickToPauseDisabled={true}
                    />
                  </div>
                )}
                <Typography className="ml-2 text-[16px] font-normal">
                  Sign In
                </Typography>
              </div>
            </Button>
            <div className="my-2 flex w-full justify-center">
              <Typography>
                Don't have an account?&nbsp;&nbsp;
                <a href="/signup" className="text-[#4728f8]">
                  Sign Up
                </a>
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;

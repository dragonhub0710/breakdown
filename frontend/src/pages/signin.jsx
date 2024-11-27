import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadUser } from "@/actions/auth";
import setAuthToken from "@/utils/setAuthToken";

export function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryToken = queryParams.get("token");

    if (queryToken) {
      setAuthToken(queryToken);
      dispatch(loadUser())
        .then(() => {
          navigate("/");
        })
        .catch((err) => console.log(err));
    }
  }, [location]);

  return <></>;
}

export default SignIn;

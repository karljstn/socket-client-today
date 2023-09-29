import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import s from "../styles/login.module.scss";

const Login = () => {
  const [error, setError] = useState("");
  const inputRef = useRef();
  const { push } = useRouter();

  const onKeyDown = (e) => {
    // detect when user press enter
    if (e.keyCode === 13) {
      localStorage.setItem("username", inputRef.current.value);
      inputRef.current.value = "";

      push("/");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("error") == 200) {
      console.log("error is present");

      setError("Server is down atm");
    }
  }, []);

  return (
    <div>
      <h1>Login Page</h1>
      <p>Enter username</p>
      <input
        ref={inputRef}
        type="text"
        placeholder="Zidane"
        onKeyDown={onKeyDown}
      />

      {error !== "" ? <h2>{error}</h2> : ""}
    </div>
  );
};

export default Login;

import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

const Login = () => {
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
    </div>
  );
};

export default Login;

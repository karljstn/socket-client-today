import { socket } from "@/utils/socket";
import { useRef } from "react";

import s from "./Input.module.scss";

const Input = () => {
  const inputRef = useRef();

  const onKeyDown = (e) => {
    // detect when user press enter
    if (inputRef.current.value.length !== 0 && e.keyCode === 13) {
      console.log(inputRef.current.value);

      socket.emit("message", { content: inputRef.current.value });

      inputRef.current.value = "";
    }
  };

  return (
    <input
      ref={inputRef}
      className={s.input}
      type="text"
      onKeyDown={onKeyDown}
    />
  );
};

export default Input;

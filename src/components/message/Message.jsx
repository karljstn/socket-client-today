import s from "./Message.module.scss";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";

const Message = ({ username, content, fromSelf }) => {
  const messageRef = useRef();

  useEffect(() => {
    gsap.to(messageRef.current, {
      opacity: 1,
      x: 0,
    });
  }, []);

  return (
    <div
      ref={messageRef}
      className={`${s.message} ${fromSelf ? s.message__self : ""}`}
    >
      <span className={s.username}>{username}</span>
      <span className={s.content}>{content}</span>
    </div>
  );
};

export default Message;

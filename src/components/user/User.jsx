import { useEffect, useRef } from "react";
import s from "./User.module.scss";
import { gsap } from "gsap";

const User = ({
  index,
  user,
  selectedUser,
  setSelectedUser,
  resetNotification,
}) => {
  const userRef = useRef();

  useEffect(() => {
    console.log(userRef);

    // gsap.to(userRef.current, {
    //   opacity: 1,
    //   x: 0,
    //   duration: 0.5,
    //   delay: index * 0.1,
    // });
  }, []);

  return (
    <div
      ref={userRef}
      className={`${s.user} ${
        selectedUser?.userID === user.userID ? s.user__active : ""
      }`}
      onClick={() => {
        setSelectedUser(user);
        resetNotification(user);
      }}
    >
      {user.username}

      {user.hasNewMessages === true ? (
        <span className={s.notification}></span>
      ) : null}
    </div>
  );
};

export default User;

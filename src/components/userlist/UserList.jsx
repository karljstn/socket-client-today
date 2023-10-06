import { useEffect, useRef } from "react";
import s from "./UserList.module.scss";
import { gsap } from "gsap";
import User from "../user/User";

const UserList = ({ users, setUsers, selectedUser, setSelectedUser }) => {
  const listRef = useRef();

  useEffect(() => {
    console.log("triggered a change on users", users);

    gsap.to(listRef.current.children, {
      opacity: 1,
      x: 0,
      duration: 0.5,
      stagger: 0.1,
    });
  }, [users]);

  const resetNotification = (user) => {
    const _users = [...users];

    const index = _users.findIndex((_user) => _user.userID === user.userID);

    _users[index].hasNewMessages = false;

    setUsers(_users);
  };

  return (
    <div ref={listRef} className={s.usersList}>
      <div
        className={`${s.general} ${selectedUser ? "" : s.user__active}`}
        onClick={() => setSelectedUser(null)}
      >
        Général
      </div>

      {users.map((user, index) => {
        return user.connected === true ? (
          <User
            index={index}
            key={user.userID}
            user={user}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            resetNotification={resetNotification}
          />
        ) : null;
      })}
    </div>
  );
};

export default UserList;

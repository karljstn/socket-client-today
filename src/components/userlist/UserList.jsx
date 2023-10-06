import { useEffect } from "react";
import s from "./UserList.module.scss";

const UserList = ({ users, selectedUser, setSelectedUser }) => {
  useEffect(() => {
    console.log(users);
  }, [users]);

  return (
    <div className={s.userlist}>
      {users.map((user) => {
        return user.connected === true ? (
          <div
            key={user.userID}
            className={`${s.user} ${
              selectedUser?.userID === user.userID ? s.user__active : ""
            }`}
            onClick={() => setSelectedUser(user)}
          >
            {user.username}
          </div>
        ) : null;
      })}
    </div>
  );
};

export default UserList;

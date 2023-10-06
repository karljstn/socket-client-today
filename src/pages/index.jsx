"use client";
import { useEffect, useRef, useState } from "react";
import { socket } from "@/utils/socket";
import { useRouter } from "next/router";

import UserList from "@/components/userlist/UserList";
import Input from "@/components/input/Input";
import Commands from "@/components/commands/Commands";
import s from "@/styles/index.module.scss";
import Notification from "@/components/notification/Notification";
import Message from "@/components/message/Message";
import { gsap } from "gsap";
// import video from "@/smash.mp4";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState();
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState();
  const [disconnectionSound, setDisconnectionSound] = useState();

  const [userConnected, setUserConnected] = useState("");

  const videoRef = useRef();
  const challengerRef = useRef();

  const viewerRef = useRef();
  const { push } = useRouter();

  const onSession = ({ sessionID, userID }) => {
    // attach the session ID to the next reconnection attempts
    socket.auth = { sessionID };
    // store it in the localStorage
    localStorage.setItem("sessionID", sessionID);
    // save the ID of the user
    socket.userID = userID;

    localStorage.removeItem("error");
  };

  const onMessage = (message) => {
    // ❌ la variable message n'est pas un tableau
    // setMessages(message);

    // ❌ mutation qui ne trigger pas un re-render de votre app
    // messages.push(message);

    // explication sur les mutations vs la création de nouvelles variables
    // const temporaryMessages = [...messages];
    // temporaryMessages.push(message);
    // setMessages(temporaryMessages);

    // syntaxe plus courte pour la création d'une nouvelle variable
    setMessages((oldMessages) => [...oldMessages, message]);
  };

  const getMessagesAtInit = (messagesAtInit) => {
    // get messages when you connect to the server
    setMessages(messagesAtInit);
  };

  const onUserConnect = (_user) => {
    const existingUser = users.find((user) => user.userID === _user.userID);

    if (existingUser) {
      return;
    }

    setUsers((currentUsers) => [...currentUsers, _user]);

    challengerRef.current.style.display = "block";
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setUserConnected(_user.username);

    setTimeout(() => {
      challengerRef.current.style.display = "none";
    }, 3000);
  };

  const onUserDisconnect = (_userID) => {
    const filteredArray = [...users].filter((_user) =>
      _user.userID !== _userID ? true : false
    );
    console.log(filteredArray);
    setUsers(filteredArray);

    disconnectionSound.currentTime = 0;
    disconnectionSound.play();
  };

  const onConnectionError = (err) => {
    console.log("test");
    localStorage.removeItem("username");
    localStorage.removeItem("sessionID");
    localStorage.setItem("error", 200);
    push("/login");
  };

  const getUsersAtInit = (_users) => {
    console.log("get users at init", _users);

    setUsers(_users);
  };

  const scrollToBottom = () => {
    viewerRef.current.scrollTop = viewerRef.current.scrollHeight;
  };

  const onError = ({ code, error }) => {
    console.log(code, error);

    let title = "";
    let content = "";

    switch (code) {
      // code 100, vous savez que ça correspond à du spam, donc vous pouvez changer les valeurs
      case 100:
        title = `Erreur ${code} : Spam`;
        content = "Tu spam trop chacal";
        break;

      // case 200:
      //   break;

      default:
        break;
    }

    setError({
      title,
      content,
    });
  };

  const onPrivateMessage = ({ content, from, to, username }) => {
    // check from which user the message came from
    const userMessagingIndex = users.findIndex(
      (_user) => _user.userID === from
    );

    const userMessaging = users.find((_user) => _user.userID === from);

    if (!userMessaging) return;

    userMessaging.messages.push({
      content,
      from,
      to,
      username: username,
    });

    if (userMessaging.userID !== selectedUser?.userID) {
      userMessaging.hasNewMessages = true;
    }

    const _users = [...users];
    _users[userMessagingIndex] = userMessaging;

    setUsers(_users);
  };

  useEffect(() => {
    socket.on("private message", onPrivateMessage);
    socket.on("user connected", onUserConnect);
    socket.on("user disconnected", onUserDisconnect);

    return () => {
      socket.off("private message", onPrivateMessage);
      socket.off("user connected", onUserConnect);
      socket.off("user disconnected", onUserDisconnect);
    };
  }, [users]);

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");

    setDisconnectionSound(new Audio("/assets/disconnect.mp3"));

    // session is already defined
    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();

      // first time connecting and has already visited login page
    } else if (localStorage.getItem("username")) {
      const username = localStorage.getItem("username");
      socket.auth = { username };
      socket.connect();

      //   // redirect to login page
    } else {
      push("/login");
    }

    socket.on("error", onError);
    socket.on("session", onSession);
    socket.on("message", onMessage);
    socket.on("messages", getMessagesAtInit);
    socket.on("users", getUsersAtInit);
    socket.on("disconnect", onConnectionError);
    socket.on("connect_error", onConnectionError);

    return () => {
      socket.off("error", onError);
      socket.off("session", onSession);
      socket.off("message", onMessage);
      socket.off("users", getUsersAtInit);
      socket.off("messages", getMessagesAtInit);
      socket.off("disconnect", onConnectionError);
      socket.off("connect_error", onConnectionError);
      socket.off("user connected", onUserConnect);
      socket.off("user disconnected", onUserDisconnect);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedUser]);

  return (
    <div>
      <div ref={challengerRef} className={s.challenger}>
        <video ref={videoRef} autoPlay src={"/smash.mp4"}></video>
        <h1>{userConnected}</h1>
      </div>
      <UserList
        users={users}
        setUsers={setUsers}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      {error && (
        <Notification
          title={error.title}
          content={error.content}
          onClose={() => setError(null)}
        />
      )}

      {/* rend la liste des messages */}
      <div ref={viewerRef} className={s.messages}>
        {selectedUser
          ? selectedUser.messages.map((message, key) => {
              return (
                <Message
                  key={key}
                  username={message.username}
                  content={message.content}
                  fromSelf={message.from === socket.userID}
                />
              );
            })
          : messages.map((message, key) => {
              return (
                <Message
                  key={key}
                  username={message.username}
                  content={message.content}
                  fromSelf={message.from === socket.userID}
                />
              );
            })}
      </div>

      <Input selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
      <Commands />
    </div>
  );
};

export default Home;

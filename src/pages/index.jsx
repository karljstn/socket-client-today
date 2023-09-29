"use client";
import { useEffect, useRef, useState } from "react";
import { socket } from "@/utils/socket";
import { useRouter } from "next/router";

import Input from "@/components/input/Input";
import Commands from "@/components/commands/Commands";
import s from "@/styles/index.module.scss";
import Notification from "@/components/notification/Notification";

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState();
  const viewerRef = useRef();
  const { push } = useRouter();

  const onSession = ({ sessionID, userID }) => {
    // attach the session ID to the next reconnection attempts
    socket.auth = { sessionID };
    // store it in the localStorage
    localStorage.setItem("sessionID", sessionID);
    // save the ID of the user
    socket.userID = userID;
  };

  const onMessage = (message) => {
    console.log("message received", message);
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

  const onConnectionError = (err) => {
    console.log("err", err);
    localStorage.clear("username");
    localStorage.clear("sessionID");
    localStorage.setItem("error", 200);
    push("/login");
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

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");

    console.log(sessionID);

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
    socket.on("connect_error", onConnectionError);

    return () => {
      socket.disconnect();
      socket.off("error", onError);
      socket.off("session", onSession);
      socket.off("message", onMessage);
      socket.off("messages", getMessagesAtInit);
      socket.off("connect_error", onConnectionError);
    };
  }, []);

  useEffect(() => {
    console.log("messages new value", messages);
    scrollToBottom();
  }, [messages]);

  return (
    <div>
      <h1 className="title">Hello</h1>

      {error && (
        <Notification
          title={error.title}
          content={error.content}
          onClose={() => setError(null)}
        />
      )}

      {/* rend la liste des messages */}
      <div ref={viewerRef} className={s.messages}>
        {messages.map((message, key) => {
          return (
            <div key={key}>
              {message.username} : {message.content}
            </div>
          );
        })}
      </div>

      <Input />
      <Commands />
    </div>
  );
};

export default Home;

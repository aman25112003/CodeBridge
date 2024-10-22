import React, { useState } from "react";
import logo from "../assets/codeBridgeLogoWhite.png";
import "../App.css";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("Created new room");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Room ID and username is required");
      return;
    }

    //REDIRECT
    navigate(`/editor/${roomId}`, { state: { username } });
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img className="homePageLogo" src={logo} alt="code-bridge-logo" />
        <h4 className="mainlabel">Paste invitation ROOM ID</h4>
        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            placeholder="ROOM ID"
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
            onKeyUp={handleInputEnter}
          />

          <input
            type="text"
            className="inputBox"
            placeholder="USERNAME"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            onKeyUp={handleInputEnter}
          />

          <button onClick={joinRoom} className="btn joinBtn">
            Join
          </button>
          <span className="createInfo">
            If you don't have an invite, create &nbsp;
            <a onClick={createNewRoom} href="" className="createNewBtn">
              <span className="new">New</span>
              &nbsp;
              <span className="room">Room</span>
            </a>
          </span>
        </div>
      </div>

      <footer>
        <h4>
          Made with ❤️ By &nbsp;{" "}
          <a href="">
            <span className="aman">Aman</span>{" "}
            <span className="singh">Singh</span>
          </a>{" "}
          &nbsp; @CodeBridge
        </h4>
      </footer>
    </div>
  );
};

export default Home;

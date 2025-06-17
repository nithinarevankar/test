import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/home.scss"; 


const Home = () => {
  const nav = useNavigate();

  return (
    <div className="home-container">
      <img id='photo'src={require('./assets/Banner.png')}/>
      <div className="button-row">
        <button id="but" onClick={() => nav('/Editor')}>Editor</button>
        <button id="but" onClick={() => nav('/chat')}>Chat</button>
        <button id="but" onClick={() => nav('/showcase')}>List</button>
      </div>
    </div>
  );
};

export default Home;
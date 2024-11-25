import React from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Chatbot from "./components/chatbot/ChatBot";
import botImage from "./assets/img/chatbot/bot.png";
import expandIcon from "./assets/img/chatbot/Expand.svg";
import closeIcon from "./assets/img/chatbot/Close_MD.svg";
import sendIcon from "./assets/img/chatbot/Send.svg";
import aiStarIcon from "./assets/img/chatbot/ai_star.svg";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
      <Chatbot
        bgColor='linear-gradient(165deg,rgb(32,39,73) 0%,rgba(0, 102, 255, 0.4) 95.45%'
        botName="AI Chatbot"
        botImage={botImage}
        expandIcon={expandIcon}
        closeIcon={closeIcon}
        sendIcon={sendIcon}
        aiStarIcon={aiStarIcon}
        apiUrl="https://ai-gamified-api-82go.onrender.com/chatbot"
        initialMessages={[]}
        subheading="Welcome to the Chatbot!"
        placeholderText="Question goes here..."
        inputBg="linear-gradient(180deg, rgb(32,39,73) 0%, #001d34 100%)"
        inputTextColor="#ffffff"
        fontStyle="Montserrat"
      />
    </div>
  );
}

export default App;
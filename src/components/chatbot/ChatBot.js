import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Chatbot.module.css";
import Message from "./Message";
import axios from "axios";

const Chatbot = ({
  bgColor,
  botName = "AI Chatbot",
  botImage,
  expandIcon,
  closeIcon,
  sendIcon,
  aiStarIcon,
  apiUrl,
  initialMessages = [],
  placeholderText = "Question goes here...",
  subheading,
  inputBg,
  inputTextColor,
  fontStyle // Add new prop
}) => {
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [chatHistory, setChatHistory] = useState([]);

  const isMobile = window.innerWidth <= 500;

  useEffect(() => {
    if (isMobile) {
      setIsExpanded(true);
      updateZIndex(true);
    }
  }, [isMobile]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const updateZIndex = (expanded) => {
    document.documentElement.style.setProperty(
      "--navigation-z-index",
      expanded ? "40" : "750"
    );
  };

  const toggleChatbot = () => {
    if (isChatboxOpen) {
      setIsChatboxOpen(false);
      setTimeout(() => {
        setIsInputOpen(false);
        setInputValue("");
        setMessages([]);
      }, 500);
    } else {
      setIsInputOpen(true);
      setTimeout(() => setIsChatboxOpen(true), 500);
    }
  };

  const toggleExpand = () => {
    setIsExpanded((prevState) => {
      const newState = !prevState;
      updateZIndex(newState);
      return newState;
    });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSendMessage = async (optionalValue = null) => {
    const messageText = optionalValue !== null ? optionalValue : inputValue;
    setLoading(true);
    if (messageText.trim() !== "") {
      const newMessages = [...messages, { type: "user", text: messageText }];
      setInputValue("");
      setMessages(newMessages);

      const botMessage = {
        type: "bot",
        text: null,
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);

      try {
        const payload = {
          user_message: messageText,
          chat_history: chatHistory,
        };

        const response = await axios.post(apiUrl, payload);
        const data = response.data;
        const newBotMessage = {
          type: "bot",
          text: data.response,
        };
        setChatHistory(data.chat_history);

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          if (updatedMessages.length > 0) {
            const lastMessage = updatedMessages[updatedMessages.length - 1];
            lastMessage.text = newBotMessage.text;
          }
          return updatedMessages;
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        const newBotMessage = {
          type: "bot",
          text: "Sorry, I am unable to fetch the answer at the moment.",
        };
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          if (updatedMessages.length > 0) {
            const lastMessage = updatedMessages[updatedMessages.length - 1];
            lastMessage.text = newBotMessage.text;
          }
          return updatedMessages;
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
    {isExpanded && isInputOpen && (
      <div className={styles.backgroundOverlay}></div>
    )}
    {isInputOpen && (
      <div
        className={`fixed ${
          isExpanded ? "inset-0" : "bottom-[10vh] right-8"
        } ${isInputOpen ? "z-50" : ""}`}
      >
        <div
          className={`${styles.chatbotBox} ${
            isChatboxOpen ? styles.open : ""
          } ${isExpanded ? styles.expanded : ""}`}
          style={{ background: bgColor }}
        >
        {!isMobile && (
          <div
            className="absolute top-0 left-0 p-2 cursor-pointer"
            onClick={toggleExpand}
          >
            <img src={expandIcon} alt="Expand" className="h-6 w-6" />
          </div>
        )}

        <div
          className="absolute top-0 right-0 p-2 cursor-pointer"
          onClick={toggleChatbot}
        >
          <img src={closeIcon} alt="Close" className="h-6 w-6" />
        </div>
        <div className="flex flex-col h-full" style={{ fontFamily: fontStyle }}> {/* Apply font style */}
          <div className="flex items-center pt-8 pl-3">
            <img
              src={botImage}
              alt="Bot"
              className="cursor-pointer h-[45px] w-[45px]"
            />
            <h2 className="text-[#EEDCDD] ml-3 text-lg font-semibold">
            {botName}
            </h2>
          </div>
          <div
            className={`flex-1 h-fit flex flex-col pt-2 pb-1 overflow-y-auto ${styles.customScrollbar}`}
          >
            <p className="text-[#EEDCDD] text-center text-sm font-medium mt-4">
              {subheading}
            </p>
            <div className={`mt-4 h-fit px-1 py-1 mb-[60px]`}>
              {messages.map((msg, index) => (
                <Message
                  key={index}
                  type={msg.type}
                  text={msg.text}
                  isExpanded={isExpanded}
                  loading={loading}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          </div>
          </div>
          <div
            className={`${styles.chatInputBox} ${
              isInputOpen ? styles.open : ""
            }  mb-[2px] flex items-center ${
              isExpanded ? styles.inputExpanded : "mr-1"
            }`}
            style={{ background: inputBg, color: inputTextColor, fontFamily: fontStyle }}
          >
            <div>
              <img src={aiStarIcon} alt="Logo" className="h-6 w-6" />
            </div>
            <input
              type="text"
              placeholder={placeholderText}
              value={inputValue}
              onKeyDown={handleKeyPress}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 ml-1 p-2 bg-transparent text-white outline-none text-sm leading-5 font-medium placeholder:text-sm placeholder:leading-5 placeholder:text-white placeholder:font-medium"
              style={{ color: inputTextColor }}
            />
            <div onClick={() => handleSendMessage()}>
              <img
                src={sendIcon}
                alt="Send"
                className="cursor-pointer h-[30px] w-[30px]"
              />
            </div>
          </div>
        </div>
      )}
      <div
        onClick={toggleChatbot}
        className="cursor-pointer fixed bottom-[10vh] right-8 z-50"
        style={{ display: isInputOpen ? "none" : "flex" }}
      >
        <img
          src={botImage}
          alt="Chatbot Icon"
          className="w-12 h-12 rounded-full"
        />
      </div>
    </>
  );
};

Chatbot.propTypes = {
  bgColor: PropTypes.string,
  botName: PropTypes.string,
  botImage: PropTypes.string.isRequired,
  expandIcon: PropTypes.string.isRequired,
  closeIcon: PropTypes.string.isRequired,
  sendIcon: PropTypes.string.isRequired,
  aiStarIcon: PropTypes.string.isRequired,
  apiUrl: PropTypes.string.isRequired,
  initialMessages: PropTypes.array,
  placeholderText: PropTypes.string,
  subheading: PropTypes.string,
  inputBg: PropTypes.string,
  inputTextColor: PropTypes.string,
  fontStyle: PropTypes.string, // Add new prop type
};

export default Chatbot;
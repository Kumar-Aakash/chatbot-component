import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import PropTypes from 'prop-types'
import styles from './Chatbot.module.css'
import botReply from "../../assets/img/chatbot/bot-reply.svg";

const Message = ({ type, text, isExpanded, loading }) => {
  const [showText, setShowText] = useState(type !== 'bot')

  useEffect(() => {
    if (type === 'bot') {
      const timer = setTimeout(() => {
        setShowText(true)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [type])

  const userStyle = {
    background: 'var(--user-message-bg, #202749)',
    borderRadius: '8px',
    display: 'flex',
    maxWidth: window.innerWidth < 500 ? '95%' : isExpanded ? '50%' : '356px',
    width: 'auto',
    padding: '12px',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--user-message-color, #EEDCDD)'
  }

  const botStyle = {
    background: 'var(--bot-message-bg, #202749)',
    borderRadius: '8px',
    display: 'flex',
    padding: '12px',
    alignItems: 'center',
    gap: '8px',
    alignSelf: 'stretch',
    paddingLeft: '25px',
    marginLeft: '3px',
    maxWidth: window.innerWidth < 500 ? '95%' : isExpanded ? '70%' : '356px',
    width: 'auto',
    color: 'var(--bot-message-color, #EEDCDD)'
  }

  return (
    <div
      className={`flex ${
        type === 'user' ? 'justify-end' : 'justify-start'
      } mb-4`}
    >
      <div
        className={`p-3 rounded-lg max-w-xs relative`}
        style={type === 'user' ? userStyle : botStyle}
      >
        {type !== 'user' && (
          <>
            <img
              src={botReply}
              alt='Bot Logo'
              style={{
                width: '35px',
                height: '35px',
                position: 'absolute',
                top: '0px',
                left: '5px',
                margin: '8px'
              }}
            />
          </>
        )}
        {type === 'bot' && loading && !text && (
          <div className={`${styles.loader}`}>
            <hr className={`${styles.animatedBg}`} />
            <hr className={`${styles.animatedBg}`} />
            <hr className={`${styles.animatedBg}`} />
          </div>
        )}
        {showText && (
          <div
            style={{
              marginLeft: type !== 'user' ? '32px' : '0',
              overflow: 'hidden'
            }}
          >
            {type === 'bot' ? (
              <>
                <ReactMarkdown>{text}</ReactMarkdown>
              </>
            ) : (
              <div>{text}</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

Message.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.string,
  isExpanded: PropTypes.bool,
  loading: PropTypes.bool,
};

export default Message;
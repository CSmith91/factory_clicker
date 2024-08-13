import React from "react";

const Messages = ({ messages }) => {
    return (
        <div className="messages">
          {messages.length > 0 ? (
            <ul style={{backgroundColor: "#3a3f4a"}}>
            {messages.map((message) => (
                <li key={message.id} style={{ listStyle: "none", marginBottom: "15px"}}>{message.text}</li>
            ))}
            </ul>
            ) : (
            <></>
          )}
        </div>
      );
}

export default Messages
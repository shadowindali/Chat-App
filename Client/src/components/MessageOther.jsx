import React, { useEffect, useState } from 'react';

function MessageOther(props) {
  const data = props.props;

  const createdAt = new Date(props.props.createdAt);
  const hour = createdAt.getHours();
  const minute = createdAt.getMinutes();
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12:xx AM/PM
  const formattedTime = `${formattedHour}:${
    minute < 10 ? '0' : ''
  }${minute} ${ampm}`;

  return (
    <div className="other-message-container">
      <div className="conversation-container">
        <p className="con-icon">{data.sender.name[0]}</p>
        <div className="other-text-content">
          {props.group && <p className="con-title">{data.sender.name}</p>}
          <p>{data.content}</p>
          <p className="self-timestamp">{formattedTime}</p>
        </div>
      </div>
    </div>
  );
}

export default MessageOther;

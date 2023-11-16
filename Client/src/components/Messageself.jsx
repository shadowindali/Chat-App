import React from 'react';

function Messageself(props) {
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
    <div className="self-message-container">
      <div className="messagebox">
        <p>{data.content}</p>
        <p className="self-timestamp">{formattedTime}</p>
      </div>
    </div>
  );
}

export default Messageself;

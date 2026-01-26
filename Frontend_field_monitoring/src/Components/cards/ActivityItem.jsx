import React from "react";
import "./card.css";

export default function ActivityItem({
  Icon,
  title,
  description,
  time,
  variant,
}) {
  return (
    <div className="activity-item">
      <div className={`activity-icon ${variant}`}>
        {Icon && React.createElement(Icon, { size: 22 })}
      </div>

      <div className="activity-content">
        <p className="activity-title">{title}</p>
        <span>{description}</span>
        <small>{time}</small>
      </div>
    </div>
  );
}

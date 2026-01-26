import "./card.css";
import React from "react";

export default function StatCard({ Icon, title, value, subtitle }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <div className="stat-icon">
          {Icon && React.createElement(Icon, { size: 20, color: "#457AF6" })}
        </div>
        <p className="stat-title">{title}</p>
      </div>

      <h2 className="stat-value">{value}</h2>
      <p className="stat-subtitle">{subtitle}</p>
    </div>
  );
}

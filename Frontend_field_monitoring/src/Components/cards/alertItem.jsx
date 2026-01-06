import "./card.css";

export default function AlertItem({ color, label, count }) {
  return (
    <div className={`alert-item ${color}`}>
      <p>{label}</p>
      <span className="alert-count">{count}</span>
    </div>
  );
}

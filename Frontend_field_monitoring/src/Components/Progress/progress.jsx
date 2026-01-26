import "./progress.css";

export default function Progress({ current, total }) {
  const percentage = ((current / total) * 100).toFixed(1);

  return (
    <div className="progress-wrapper">
      <div className="progress-text">
        <p>{current} / {total}</p>
        <span>({percentage}%)</span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

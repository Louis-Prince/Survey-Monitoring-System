import { FileText, AlertCircle } from "lucide-react";
import "./card.css";

export default function RecentSubmissionItem({ data }) {
  return (
    <div className={`submission-item ${data.warning ? "submission-warning" : ""}`}>
      <div className="icon">
        {data.warning ? <AlertCircle size={18} /> : <FileText size={18} color="#457af6"/>}
      </div>

      <div className="submission-info">
        <p className="title">Household #{data.id}</p>
        <span>{data.area}</span>
      </div>

      <span className="time">{data.time}</span>
    </div>
  );
}

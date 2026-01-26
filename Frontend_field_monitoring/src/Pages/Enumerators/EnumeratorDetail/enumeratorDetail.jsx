import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import "./enumeratorDetail.css";
import Progress from "../../../Components/Progress/progress";
import RecentSubmissionItem from "../../../Components/cards/RecentSubmissionItem";

export default function EnumeratorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const enumerator = {
    id: "EN001",
    name: "MUGISHA Emma",
    survey: "SAS",
    completed: 140,
    total: 165,
    avgTime: "24 min",
    phone: "0784568763",
    email: "em.mugisha@nisr.gov.rw",
    location: "Kigali, Rwanda",
    supervisor: {
      name: "Sarah UWASE",
      phone: "0784563831",
    },
    submissions: [
      { id: 1489, area: "kicukiro", time: "28 min ago" },
      { id: 1488, area: "kicukiro", time: "48 min ago" },
      { id: 1487, area: "kicukiro", time: "2 hrs ago" },
      { id: 1486, area: "kicukiro", time: "3 hrs ago", warning: true },
      { id: 1485, area: "kicukiro", time: "23 hrs ago" },
    ],
  };

  return (
    <div className="enumerator-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Back
      </button>
      <div className="detail-header">
        <div className="header-info">
          <h4>{enumerator.name}</h4>
          <p>ID: {id} &nbsp; | &nbsp; {enumerator.survey}</p>
        </div>

        <button className="message-btn">
          <Mail size={18} /> Message
        </button>
      </div>

      <div className="active-assignment-card">
        <h3>Active Assignment: {enumerator.survey} 2025</h3>

        <div className="stats-row">
          <div className="stat-box">
            <p>Household Completed</p>
            <h2>{enumerator.completed}<span>/{enumerator.total}</span></h2>
          </div>

          <div className="stat-box">
            <p>Avg Time / Household</p>
            <h2>{enumerator.avgTime}</h2>
          </div>
        </div>

        <Progress
          current={enumerator.completed}
          total={enumerator.total}
        />
      </div>

      <div className="detail-grid">
        <div className="recent-contact-supervisor">
          <h3>Recent Submissions</h3>

          {enumerator.submissions.map((item) => (
            <RecentSubmissionItem key={item.id} data={item} />
          ))}
          <p className="view-all">View all</p>
        </div>

        <div>
          <div className="recent-contact-supervisor" id="enumerator-contact">
            <h3>Contact Information</h3>
            <div className="info-row">
              <Phone size={16} /> {enumerator.phone}
            </div>
            <div className="info-row">
              <Mail size={16} /> {enumerator.email}
            </div>
            <div className="info-row">
              <MapPin size={16} /> {enumerator.location}
            </div>
          </div>

          <div className="recent-contact-supervisor">
            <h3>Supervisor</h3>
            <p className="supervisor-name">{enumerator.supervisor.name}</p>
            <p className="role">Field Supervisor</p>
  
            <div className="info-row">
              <Phone size={16} /> {enumerator.supervisor.phone}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

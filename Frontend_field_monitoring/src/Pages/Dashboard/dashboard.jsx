import { statsCards } from '../../constants/statData';
import StatCard from '../../Components/cards/StatCard';
import './dashboard.css'
import AlertItem from '../../Components/cards/alertItem';
import { CircleAlert } from 'lucide-react';
import { recentActivities } from '../../constants/activityData';
import ActivityItem from '../../Components/cards/ActivityItem';

const dashboard = () => {
  return (
    <div className="dashboard-container">
      <p>Real-time nationwide survey operations monitoring</p>
      <div className="stats-grid">
        {statsCards.map((card, index) => (
          <StatCard
            key={index}
            Icon={card.icon}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
          />
        ))}
      </div>

      <div className="alert-activity-container">
        <div className='critical-alerts-header'>
          <CircleAlert size={20} color='red'/> 
          <h3 >Critical Alerts</h3>
        </div>

        <AlertItem label="Critical Data Quality Issues" count={1} color="danger" />
        <AlertItem label="Sync Failures" count={1} color="warning" />
        <AlertItem label="Surveys Below 50% Completion" count={0} color="success" />
      </div>

      <div className="alert-activity-container">
        <h3>Recent Activity</h3>
      
        {recentActivities.map((activity, index) => (
          <ActivityItem
            key={index}
            Icon={activity.Icon}
            title={activity.title}
            description={activity.description}
            time={activity.time}
            variant={activity.variant}
          />
        ))}
      </div>
    </div>
  );
}

export default dashboard
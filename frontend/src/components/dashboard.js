import React from 'react';
import './dashboard.css';
import ActivitiesSummary from './statistics';
import ActivityFeed from './activityFeed';
import { useNavigate, Link } from 'react-router-dom';

const levelContent = {
  Beginner: "💡 Beginner tip: Rest days are just as important as workout days. Don't skip them!",
  Intermediate: "💡 Tip: Try adding one extra session this week to push your progress.",
  Advanced: "💡 Advanced tip: Track your progressive overload — are you lifting more than last month?",
};

const Dashboard = ({ currentUser }) => {
  const navigate = useNavigate();
  const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  const levelTip = levelContent[profile.level];

  return (
    <div className="dashboard-container">

      {profile.goal && (
        <div className="dashboard-goal-banner" role="status" aria-live="polite">
          <span>Your goal: <strong>{profile.goal}</strong></span>
          {profile.level && <span style={{ marginLeft: 12, opacity: 0.8 }}>· {profile.level}</span>}
        </div>
      )}

      {levelTip && (
        <div
          className="dashboard-level-tip"
          style={{
            background: '#fff8ee',
            border: '1px solid rgba(255,138,50,0.3)',
            borderRadius: 10,
            padding: '12px 16px',
            marginBottom: 24,
            fontSize: 14,
            color: '#7c4a00',
            textAlign: 'left',
          }}>
          {levelTip}
        </div>
      )}

      <div className="dashboard-summary-section">
        <ActivitiesSummary currentUser={currentUser} showSummaryOnly={true} hideSummaryTitle={true} />
      </div>
      <div className="dashboard-feed-section">
        <ActivityFeed currentUser={currentUser} />
      </div>
      <div className="dashboard-action">
        <button
          className="btn btn-primary btn-track-exercise"
          onClick={() => navigate('/trackExercise')}
        >
          + Log Activity
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
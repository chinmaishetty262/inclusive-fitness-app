import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import './dashboard.css';
import ActivitiesSummary from './statistics';
import ActivityFeed from './activityFeed';
import { useNavigate } from 'react-router-dom';

const goalContent = {
  '🔥 Lose Weight': {
    emoji: '🔥',
    tip: "Today's cardio tip",
    content: "Try a 30-min brisk walk or jog. Keeping your heart rate at 60–70% max burns fat efficiently.",
    suggested: "🏃 Go for a run  •  🚴 Cycle  •  🏊 Swim"
  },
  '💪 Build Muscle': {
    emoji: '💪',
    tip: "Today's strength tip",
    content: "Focus on compound lifts today — squats, deadlifts, or bench press. Aim for 3–4 sets of 8–12 reps.",
    suggested: "🏋️ Gym session  •  💪 Bodyweight workout"
  },
  '🏃 Improve Stamina': {
    emoji: '🏃',
    tip: "Today's endurance tip",
    content: "Try interval training: 1 min fast, 2 min easy, repeat 8 times. Great for building aerobic capacity.",
    suggested: "🏃 Run intervals  •  🚴 Cycle  •  🏊 Swim laps"
  },
  '🧘 Stay Active': {
    emoji: '🧘',
    tip: "Today's movement tip",
    content: "Even a 20-min walk counts! Consistency beats intensity — aim to move every day.",
    suggested: "🚶 Walk  •  🧘 Yoga  •  🚴 Light cycle"
  },
};

const levelContent = {
  Beginner: "💡 Beginner tip: Rest days are just as important as workout days. Don't skip them!",
  Intermediate: "💡 Tip: Try adding one extra session this week to push your progress.",
  Advanced: "💡 Advanced tip: Track your progressive overload — are you lifting more than last month?",
};

const Dashboard = ({ currentUser }) => {
  const navigate = useNavigate();
  const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  const content = goalContent[profile.goal];
  const levelTip = levelContent[profile.level];

  return (
    <div className="dashboard-container">

      {profile.goal && (
        <div className="dashboard-goal-banner" role="status" aria-live="polite">
          <span>Your goal: <strong>{profile.goal}</strong></span>
          {profile.level && <span style={{ marginLeft: 12, opacity: 0.8 }}>· {profile.level}</span>}
        </div>
      )}

      {/* Personalised tip card */}
      {content && (
        <div style={{
          background: '#eef4ff',
          border: '1px solid rgba(31,114,255,0.2)',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 24,
          textAlign: 'left',
        }}>
          <h4 style={{ marginBottom: 8 }}>{content.emoji} {content.tip}</h4>
          <p style={{ marginBottom: 8, color: '#4b5d7e' }}>{content.content}</p>
          <p style={{ fontSize: 13, color: '#1f72ff', fontWeight: 600 }}>Suggested: {content.suggested}</p>
        </div>
      )}

      {/* Level tip */}
      {levelTip && (
        <div style={{
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

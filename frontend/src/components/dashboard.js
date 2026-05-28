import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import './dashboard.css';
import ActivitiesSummary from './statistics';
import ActivityFeed from './activityFeed';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ currentUser }) => {
  const navigate = useNavigate();
  const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');

  return (
    <div className="dashboard-container">

      {profile.goal && (
        <div className="dashboard-goal-banner" role="status" aria-live="polite">
          <span>Your goal: <strong>{profile.goal}</strong></span>
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

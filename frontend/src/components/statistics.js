import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import './statistics.css';

const ActivitiesSummary = ({ currentUser }) => {
  const [aggregatedStats, setAggregatedStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const statsUrl = `http://localhost:5050/stats/${currentUser}`;
    setLoading(true);
    setError('');

    axiosInstance.get(statsUrl)
      .then((statsRes) => {
        setAggregatedStats(statsRes.data.stats || []);
      })
      .catch((err) => {
        console.error('There was an error fetching the data!', err);
        setError('Unable to load statistics right now.');
      })
      .finally(() => setLoading(false));
  }, [currentUser]);

  const currentUserData = aggregatedStats.find(item => item.username === currentUser);
  const summaryExercises = currentUserData?.exercises ?? [];
  const totalActiveMinutes = summaryExercises.reduce((sum, item) => sum + (item.totalDuration || 0), 0);
  const totalDistance = summaryExercises.reduce((sum, item) => sum + (item.totalDistance || 0), 0);
  const totalSteps = summaryExercises.reduce((sum, item) => sum + (item.totalSteps || 0), 0);

  return (
    <div className="stats-container">
      {error && <div className="stats-error">{error}</div>}
      {loading ? (
        <div className="stats-loading">Loading statistics...</div>
      ) : (
        <>
          <div className="section-summary section-panel">
            <h4>Activities Summary</h4>
            <div className="summary-bubbles">
              <div className="summary-bubble bubble-active">
                <div className="bubble-label">Active Minutes</div>
                <div className="bubble-value">{totalActiveMinutes}</div>
              </div>
              <div className="summary-bubble bubble-distance">
                <div className="bubble-label">Distance</div>
                <div className="bubble-value">{totalDistance} km</div>
              </div>
              <div className="summary-bubble bubble-steps">
                <div className="bubble-label">Steps</div>
                <div className="bubble-value">{totalSteps}</div>
              </div>
            </div>
          </div>

          <div className="section-types section-panel">
            <h4>Activity Totals</h4>
            {currentUserData && currentUserData.exercises.length > 0 ? (
              currentUserData.exercises.map((item, index) => (
                <div key={index} className="exercise-data exercise-type-item">
                  <div><strong>{item.exerciseType}</strong></div>
                  <div>Duration: {item.totalDuration ?? 0} min</div>
                  <div>Distance: {item.totalDistance ?? 0} km</div>
                  <div>Steps: {item.totalSteps ?? 0}</div>
                </div>
              ))
            ) : (
              <p>No activity type totals available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ActivitiesSummary;

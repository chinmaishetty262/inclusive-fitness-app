import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import './statistics.css';

const ActivityFeed = ({ currentUser }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const url = `http://localhost:5050/`;
    setLoading(true);
    setError('');

    axiosInstance.get(url)
      .then((response) => {
        if (!isMounted) return;
        const rawActivities = Array.isArray(response.data) ? response.data : [];
        const filteredActivities = rawActivities
          .filter(item => item.username === currentUser)
          .sort((a, b) => {
            const aDate = a.date ? new Date(a.date.$date ?? a.date) : 0;
            const bDate = b.date ? new Date(b.date.$date ?? b.date) : 0;
            return bDate - aDate;
          });

        setActivities(filteredActivities);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('There was an error fetching the activity feed!', err);
        setError('Unable to load your activity feed right now.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const formatDate = (dateValue) => {
    if (!dateValue) return '';
    if (typeof dateValue === 'string') return new Date(dateValue).toLocaleDateString();
    if (dateValue.$date) return new Date(dateValue.$date).toLocaleDateString();
    return new Date(dateValue).toLocaleDateString();
  };

  return (
    <div className="stats-container">
      <div className="section-feed section-panel">
        <h4>My Feed</h4>
        {error && <div className="stats-error">{error}</div>}
        {loading ? (
          <div className="stats-loading">Loading feed...</div>
        ) : activities.length > 0 ? (
          activities.map((item, index) => (
            <div key={index} className="activity-item">
              <div className="activity-row">
                <span className="activity-type">{item.exerciseType || 'Unknown'}</span>
                <span className="activity-date">{formatDate(item.date)}</span>
              </div>
              <div className="activity-details">
                <span>Duration: {item.duration ?? 0} min</span>
                <span>Distance: {(item.distance ?? 0).toFixed(2)} km</span>
                <span>Steps: {item.steps ?? 0}</span>
              </div>
              {item.description && <div className="activity-description"><strong>Description:</strong> {item.description}</div>}
            </div>
          ))
        ) : (
          <p>No recent activities available.</p>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
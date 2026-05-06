import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axiosInstance from './axiosInstance';
import './statistics.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

const formatDailyStats = (rawStats = []) => {
  const statsByDay = rawStats.reduce((map, item) => {
    const dateKey = moment(item.date).isValid()
      ? moment(item.date).format('YYYY-MM-DD')
      : item.date;

    map[dateKey] = {
      totalSteps: item.totalSteps ?? 0,
      totalDistance: item.totalDistance ?? 0,
      totalDuration: item.totalDuration ?? 0,
    };

    return map;
  }, {});

  const days = [];
  const today = moment().startOf('day');

  for (let i = 6; i >= 0; i -= 1) {
    const date = today.clone().subtract(i, 'days');
    const dateKey = date.format('YYYY-MM-DD');
    const dayStats = statsByDay[dateKey] || {
      totalSteps: 0,
      totalDistance: 0,
      totalDuration: 0,
    };

    days.push({
      date: dateKey,
      label: date.format('ddd'),
      ...dayStats,
    });
  }

  return days;
};

const ActivitiesSummary = ({ currentUser, showSummaryOnly = false, hideSummaryTitle = false }) => {
  const [aggregatedStats, setAggregatedStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dailyStats, setDailyStats] = useState([]);
  const [dailyLoading, setDailyLoading] = useState(true);

  useEffect(() => {
    const statsUrl = `http://localhost:5050/stats/${currentUser}`;
    const dailyStatsUrl = `http://localhost:5050/stats/daily/${currentUser}`;
    setLoading(true);
    setDailyLoading(true);
    setError('');

    // Fetch aggregated stats
    axiosInstance.get(statsUrl)
      .then((statsRes) => {
        setAggregatedStats(statsRes.data.stats || []);
      })
      .catch((err) => {
        console.error('There was an error fetching the data!', err);
        setError('Unable to load statistics right now.');
      })
      .finally(() => setLoading(false));

    // Fetch daily stats
    axiosInstance.get(dailyStatsUrl)
      .then((dailyRes) => {
        setDailyStats(formatDailyStats(dailyRes.data.stats || []));
      })
      .catch((err) => {
        console.error('There was an error fetching daily data!', err);
        setDailyStats(formatDailyStats([]));
      })
      .finally(() => setDailyLoading(false));
  }, [currentUser]);

  const currentUserData = aggregatedStats.find(item => item.username === currentUser);
  const summaryExercises = currentUserData?.exercises ?? [];
  const totalActiveMinutes = summaryExercises.reduce((sum, item) => sum + (item.totalDuration || 0), 0);
  const totalDistance = summaryExercises.reduce((sum, item) => sum + (item.totalDistance || 0), 0);
  const totalSteps = summaryExercises.reduce((sum, item) => sum + (item.totalSteps || 0), 0);

  const hasActivityOnDay = (dayStats) => {
    return dayStats.totalSteps > 0 || dayStats.totalDistance > 0 || dayStats.totalDuration > 0;
  };

  return (
    <div className="stats-container">
      {error && <div className="stats-error">{error}</div>}
      {loading ? (
        <div className="stats-loading">Loading statistics...</div>
      ) : (
        <>
          {showSummaryOnly && (
            <div className="section-summary section-panel">
              {!hideSummaryTitle && <h4>Activities Summary</h4>}
              <div className="summary-bubbles">
                <div className="summary-bubble bubble-active">
                  <div className="bubble-label">Active Minutes</div>
                  <div className="bubble-value">{totalActiveMinutes}</div>
                </div>
                <div className="summary-bubble bubble-distance">
                  <div className="bubble-label">Distance</div>
                  <div className="bubble-value">{totalDistance.toFixed(2)} km</div>
                </div>
                <div className="summary-bubble bubble-steps">
                  <div className="bubble-label">Steps</div>
                  <div className="bubble-value">{totalSteps}</div>
                </div>
              </div>
            </div>
          )}

          {!showSummaryOnly && (
            <>
              <div className="section-week-view section-panel">
                <h4>This Week</h4>
                <div className="week-view-container">
                  {dailyStats.map((dayStats, index) => (
                    <div
                      key={index}
                      className={`week-day-circle ${hasActivityOnDay(dayStats) ? 'active' : 'inactive'}`}
                      title={`${dayStats.label} - ${dayStats.totalDuration} min`}
                    >
                      {hasActivityOnDay(dayStats) && <span className="day-emoji">🏃</span>}
                      <span className="day-label">{dayStats.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section-daily section-panel">
                <h4>Daily Activity (Last 7 Days)</h4>
                {dailyLoading ? (
                  <div className="stats-loading">Loading daily statistics...</div>
                ) : (
                  <div className="charts-container">
                    <div className="chart-item chart-steps">
                      <h5>Step Count</h5>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dailyStats}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="label" />
                          <YAxis domain={[0, 10000]} tickCount={6} />
                          <Tooltip />
                          <Bar dataKey="totalSteps" fill="var(--accent)">
                            <LabelList dataKey="totalSteps" position="top" />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="chart-item chart-distance">
                      <h5>Distance (km)</h5>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dailyStats}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="label" />
                          <YAxis domain={[0, 5]} tickCount={6} />
                          <Tooltip />
                          <Bar dataKey="totalDistance" fill="var(--accent-alt)">
                            <LabelList dataKey="totalDistance" position="top" />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="chart-item chart-active">
                      <h5>Active Minutes</h5>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dailyStats}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="label" />
                          <YAxis domain={[0, 60]} tickCount={7} />
                          <Tooltip />
                          <Bar dataKey="totalDuration" fill="var(--accent-highlight)">
                            <LabelList dataKey="totalDuration" position="top" />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>

              <div className="section-types section-panel">
                <h4>Activity Totals</h4>
                {currentUserData && currentUserData.exercises.length > 0 ? (
                  currentUserData.exercises.map((item, index) => (
                    <div key={index} className="exercise-data exercise-type-item">
                      <div><strong>{item.exerciseType}</strong></div>
                      <div>Duration: {item.totalDuration ?? 0} min</div>
                      <div>Distance: {(item.totalDistance ?? 0).toFixed(2)} km</div>
                      <div>Steps: {item.totalSteps ?? 0}</div>
                    </div>
                  ))
                ) : (
                  <p>No activity type totals available.</p>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ActivitiesSummary;

import React, { useState, useEffect } from 'react';
import { getWorkoutGuides } from '../api';
import './workoutGuides.css';

const CATEGORIES = [
  { id: 'general', label: 'No / Minimal Disability', icon: '🙌' },
  { id: 'wheelchair', label: 'Wheelchair', icon: '♿' },
  { id: 'crutches', label: 'Crutches & Limited Mobility', icon: '🦯' },
  { id: 'other', label: 'Other Disabilities', icon: '💪' },
];

const WorkoutGuides = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedWorkout, setExpandedWorkout] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError('');
    setExpandedWorkout(null);
    getWorkoutGuides(activeCategory)
      .then((res) => setWorkouts(res.data.guides || []))
      .catch(() => setError('Unable to load workout guides right now. Please try again.'))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const toggleExpand = (index) => {
    setExpandedWorkout(expandedWorkout === index ? null : index);
  };

  return (
    <div className="workout-guides-container">
      <h3>Workout Ideas &amp; Guides</h3>
      <p className="workout-guides-intro">
        Find workouts tailored to your needs. Select your accessibility category below to explore exercises designed with you in mind.
      </p>

      <div className="category-tabs" role="tablist" aria-label="Accessibility categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={activeCategory === cat.id}
            className={`category-tab${activeCategory === cat.id ? ' active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <span className="category-tab-icon" aria-hidden="true">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div role="tabpanel">
        {loading && <p className="workout-guides-loading">Loading guides...</p>}
        {error && <p className="workout-guides-error">{error}</p>}
        {!loading && !error && (
          <div className="workout-grid">
            {workouts.map((workout, index) => (
              <div key={workout._id || index} className="workout-card">
                <div className="workout-card-header">
                  <h4 className="workout-name">{workout.name}</h4>
                  <div className="workout-meta">
                    <span className={`difficulty-badge difficulty-${workout.difficulty.toLowerCase()}`}>
                      {workout.difficulty}
                    </span>
                    <span className="workout-duration" aria-label={`Duration: ${workout.duration}`}>
                      &#9201; {workout.duration}
                    </span>
                  </div>
                </div>
                <p className="workout-description">{workout.description}</p>
                <button
                  className="expand-btn"
                  onClick={() => toggleExpand(index)}
                  aria-expanded={expandedWorkout === index}
                  aria-controls={`steps-${index}`}
                >
                  {expandedWorkout === index ? 'Hide steps ▲' : 'Show steps ▼'}
                </button>
                {expandedWorkout === index && (
                  <ol id={`steps-${index}`} className="workout-steps">
                    {workout.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutGuides;

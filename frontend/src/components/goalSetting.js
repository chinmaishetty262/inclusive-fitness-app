import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { addGoal, deleteGoal, getGoals, getTrackedActivities, updateGoal } from '../api';
import './goalSetting.css';

const getToday = () => {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return today.toISOString().split('T')[0];
};

const formatDate = (dateValue) => {
  if (!dateValue) return 'No date set';
  return new Date(dateValue).toLocaleDateString();
};

const parseDate = (dateValue) => {
  if (!dateValue) return null;
  const rawDate = dateValue.$date ?? dateValue;
  const parsedDate = new Date(rawDate);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const getActivityValueForGoal = (activity, goalType) => {
  switch (goalType) {
    case 'Steps':
      return Number(activity.steps) || 0;
    case 'Distance':
      return Number(activity.distance) || 0;
    case 'Active Minutes':
      return Number(activity.duration) || 0;
    default:
      return 0;
  }
};

const getGoalUnit = (goalType) => {
  switch (goalType) {
    case 'Steps':
      return 'steps';
    case 'Distance':
      return 'km';
    case 'Active Minutes':
      return 'min';
    default:
      return '';
  }
};

const formatGoalValue = (value, goalType) => {
  if (goalType === 'Distance') {
    return Number(value).toFixed(2);
  }

  return Math.round(Number(value) || 0).toString();
};

const GoalSetting = ({ currentUser, onChangePreferences }) => {
  const [profile] = useState(JSON.parse(localStorage.getItem('userProfile') || '{}'));
  const [goalType, setGoalType] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [period, setPeriod] = useState('Weekly');
  const [targetDate, setTargetDate] = useState(getToday());
  const [goals, setGoals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loadingGoals, setLoadingGoals] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingGoalId, setDeletingGoalId] = useState('');
  const [updatingGoalId, setUpdatingGoalId] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [touched, setTouched] = useState({});

  const isFormValid = () => (
    goalType !== ''
    && Number(targetValue) > 0
    && period !== ''
    && targetDate !== ''
    && targetDate >= getToday()
  );

  const loadGoals = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoadingGoals(true);
      setError('');
      const response = await getGoals(currentUser);
      setGoals(response.data.goals || []);
    } catch (err) {
      console.error('Failed to load goals:', err);
      setError('Unable to load your saved goals. Please try again.');
    } finally {
      setLoadingGoals(false);
    }
  }, [currentUser]);

  const loadActivities = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoadingActivities(true);
      const response = await getTrackedActivities();
      const trackedActivities = Array.isArray(response.data) ? response.data : [];
      setActivities(trackedActivities.filter((activity) => activity.username === currentUser));
    } catch (err) {
      console.error('Failed to load tracked activities:', err);
      setError('Goals loaded, but activity progress could not be calculated right now.');
    } finally {
      setLoadingActivities(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadGoals();
    loadActivities();
  }, [loadGoals, loadActivities]);

  const getGoalProgress = (goal) => {
    const startDate = parseDate(goal.startDate);
    const endDate = parseDate(goal.targetDate);
    const target = Number(goal.targetValue) || 0;

    const currentValue = activities.reduce((sum, activity) => {
      const activityDate = parseDate(activity.date);

      if (!activityDate) {
        return sum;
      }

      if (startDate && activityDate < startDate) {
        return sum;
      }

      if (endDate) {
        const endOfTargetDay = new Date(endDate);
        endOfTargetDay.setHours(23, 59, 59, 999);

        if (activityDate > endOfTargetDay) {
          return sum;
        }
      }

      return sum + getActivityValueForGoal(activity, goal.goalType);
    }, 0);

    const percentage = target > 0 ? Math.min((currentValue / target) * 100, 100) : 0;

    return {
      currentValue,
      percentage,
      isReached: target > 0 && currentValue >= target,
    };
  };

  const resetForm = () => {
    setGoalType('');
    setTargetValue('');
    setPeriod('Weekly');
    setTargetDate(getToday());
    setTouched({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ goalType: true, targetValue: true, targetDate: true });

    if (!isFormValid()) {
      setError('Please complete all goal fields with a future target date and a target greater than 0.');
      setSuccessMessage('');
      return;
    }

    const newGoal = {
      username: currentUser,
      goalType,
      targetValue: Number(targetValue),
      period,
      startDate: getToday(),
      targetDate,
      status: 'Active'
    };

    try {
      setSaving(true);
      setError('');
      setSuccessMessage('');
      await addGoal(newGoal);
      setSuccessMessage('Goal saved successfully!');
      resetForm();
      await loadGoals();
      await loadActivities();
    } catch (err) {
      console.error('Failed to save goal:', err);
      setError('Unable to save your goal right now. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (goalId) => {
    try {
      setDeletingGoalId(goalId);
      setError('');
      setSuccessMessage('');
      await deleteGoal(goalId);
      setGoals((currentGoals) => currentGoals.filter((goal) => goal._id !== goalId));
      setSuccessMessage('Goal deleted successfully.');
    } catch (err) {
      console.error('Failed to delete goal:', err);
      setError('Unable to delete this goal right now. Please try again.');
    } finally {
      setDeletingGoalId('');
    }
  };

  const handleStatusChange = async (goal) => {
    const nextStatus = goal.status === 'Completed' ? 'Active' : 'Completed';
    try {
      setUpdatingGoalId(goal._id);
      setError('');
      setSuccessMessage('');
      const response = await updateGoal(goal._id, { status: nextStatus });
      setGoals((currentGoals) => (
        currentGoals.map((currentGoal) => (
          currentGoal._id === goal._id ? response.data.goal : currentGoal
        ))
      ));
      setSuccessMessage(`Goal marked as ${nextStatus.toLowerCase()}.`);
    } catch (err) {
      console.error('Failed to update goal:', err);
      setError('Unable to update this goal right now. Please try again.');
    } finally {
      setUpdatingGoalId('');
    }
  };

  const getStatusButtonText = (goal) => {
    if (updatingGoalId === goal._id) return 'Updating...';
    return goal.status === 'Completed' ? 'Reopen Goal' : 'Mark Complete';
  };

  return (
    <div className="goal-setting-container">
      <h3>Set Your Fitness Goals</h3>

      {profile.goal && (
        <div style={{
          background: '#eef4ff',
          border: '1px solid rgba(31,114,255,0.2)',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 24,
          textAlign: 'left',
        }}>
          <h4 style={{ marginBottom: 8 }}>🎯 Your fitness profile</h4>
          <p style={{ margin: '4px 0', color: '#4b5d7e' }}>
            <strong>Goal:</strong> {profile.goal}
          </p>
          {profile.level && (
            <p style={{ margin: '4px 0', color: '#4b5d7e' }}>
              <strong>Activity level:</strong> {profile.level}
            </p>
          )}
          {(profile.reminders === true || profile.reminders === 'true') && profile.reminderTime && (
            <p style={{ margin: '4px 0', color: '#4b5d7e' }}>
              <strong>Reminder set for:</strong> {profile.reminderTime}
            </p>
          )}
          <button
            type="button"
            className="btn btn-secondary"
            style={{ marginTop: 12 }}
            onClick={onChangePreferences}
          >
            ✏️ Change preferences
          </button>
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        <div className="form-field-group">
          <Form.Label>Goal Type *</Form.Label>
          <Form.Control
            as="select"
            value={goalType}
            onChange={(event) => {
              setGoalType(event.target.value);
              setError('');
              setTouched(t => ({ ...t, goalType: true }));
            }}
            className={!touched.goalType ? '' : goalType ? 'is-valid' : 'is-invalid'}
          >
            <option value="">Choose a goal</option>
            <option value="Steps">Steps</option>
            <option value="Distance">Distance</option>
            <option value="Active Minutes">Active Minutes</option>
          </Form.Control>
          {touched.goalType && !goalType && (
            <div className="invalid-feedback d-block">Please select a goal type.</div>
          )}
        </div>

        <div className="form-field-group">
          <Form.Label>Target Value *</Form.Label>
          <Form.Control
            type="number"
            min="1"
            step="any"
            placeholder="e.g., 50000"
            value={targetValue}
            onWheel={(event) => event.preventDefault()}
            onChange={(event) => {
              setTargetValue(event.target.value);
              setError('');
              setTouched(t => ({ ...t, targetValue: true }));
            }}
            className={!touched.targetValue ? '' : Number(targetValue) > 0 ? 'is-valid' : 'is-invalid'}
          />
          {touched.targetValue && Number(targetValue) <= 0 && (
            <div className="invalid-feedback d-block">Please enter a target greater than 0.</div>
          )}
        </div>

        <div className="form-field-group">
          <Form.Label>Goal Period *</Form.Label>
          <Form.Control
            as="select"
            value={period}
            onChange={(event) => {
              setPeriod(event.target.value);
              setError('');
            }}
            className={period ? 'is-valid' : 'is-invalid'}
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </Form.Control>
        </div>

        <div className="form-field-group">
          <Form.Label>Target Date *</Form.Label>
          <Form.Control
            type="date"
            min={getToday()}
            value={targetDate}
            onChange={(event) => {
              setTargetDate(event.target.value);
              setError('');
              setTouched(t => ({ ...t, targetDate: true }));
            }}
            className={!touched.targetDate ? 'is-valid' : targetDate >= getToday() ? 'is-valid' : 'is-invalid'}
            style={{ paddingRight: '40px' }}
          />
          {touched.targetDate && targetDate < getToday() && (
            <div className="invalid-feedback d-block">Please choose today or a future date.</div>
          )}
        </div>

        <div className="submit-button-container">
          <Button
            variant="success"
            type="submit"
            disabled={saving}
            style={{ cursor: saving ? 'not-allowed' : 'pointer' }}
          >
            {saving ? 'Saving...' : 'Save Goal'}
          </Button>
        </div>
      </Form>

      {error && <div className="warning-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <section className="saved-goals-section">
        <h4>Saved Goals</h4>
        {loadingGoals ? (
          <div className="goal-loading">Loading goals...</div>
        ) : goals.length > 0 ? (
          <div className="goal-list">
            {goals.map((goal) => (
              <div key={goal._id} className="goal-list-item">
                <div className="goal-list-header">
                  <strong>{goal.goalType}</strong>
                  <span className="goal-status">{goal.status}</span>
                </div>
                <div className="goal-detail">Target: {goal.targetValue}</div>
                <div className="goal-detail">Period: {goal.period}</div>
                <div className="goal-detail">Target date: {formatDate(goal.targetDate)}</div>
                {(() => {
                  const progress = getGoalProgress(goal);
                  const unit = getGoalUnit(goal.goalType);

                  return (
                    <div className="goal-progress" aria-label={`${goal.goalType} progress`}>
                      <div className="goal-progress-summary">
                        <span>
                          Progress: {formatGoalValue(progress.currentValue, goal.goalType)} / {formatGoalValue(goal.targetValue, goal.goalType)} {unit}
                        </span>
                        <span>{Math.round(progress.percentage)}%</span>
                      </div>
                      <div className="goal-progress-track" aria-hidden="true">
                        <div
                          className="goal-progress-fill"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                      {loadingActivities ? (
                        <div className="goal-progress-note">Calculating progress from tracked activities...</div>
                      ) : progress.isReached ? (
                        <div className="goal-progress-note goal-progress-note--success">Target reached from tracked activities.</div>
                      ) : (
                        <div className="goal-progress-note">Progress updates when matching activities are tracked.</div>
                      )}
                    </div>
                  );
                })()}
                <div className="goal-actions">
                  <Button
                    variant={goal.status === 'Completed' ? 'primary' : 'success'}
                    onClick={() => handleStatusChange(goal)}
                    disabled={updatingGoalId === goal._id}
                  >
                    {getStatusButtonText(goal)}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleDelete(goal._id)}
                    disabled={deletingGoalId === goal._id}
                  >
                    {deletingGoalId === goal._id ? 'Deleting...' : 'Delete Goal'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-goals-message">No goals saved yet.</p>
        )}
      </section>
    </div>
  );
};

export default GoalSetting;

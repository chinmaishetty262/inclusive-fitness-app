import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { addGoal, deleteGoal, getGoals, updateGoal } from '../api';
import './goalSetting.css';

const getToday = () => {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return today.toISOString().split('T')[0];
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return 'No date set';
  }

  return new Date(dateValue).toLocaleDateString();
};

const GoalSetting = ({ currentUser }) => {
  const [goalType, setGoalType] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [period, setPeriod] = useState('Weekly');
  const [targetDate, setTargetDate] = useState(getToday());
  const [goals, setGoals] = useState([]);
  const [loadingGoals, setLoadingGoals] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingGoalId, setDeletingGoalId] = useState('');
  const [updatingGoalId, setUpdatingGoalId] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isFormValid = () => (
    goalType !== ''
    && Number(targetValue) > 0
    && period !== ''
    && targetDate !== ''
    && targetDate >= getToday()
  );

  const loadGoals = useCallback(async () => {
    if (!currentUser) {
      return;
    }

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

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const resetForm = () => {
    setGoalType('');
    setTargetValue('');
    setPeriod('Weekly');
    setTargetDate(getToday());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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
    if (updatingGoalId === goal._id) {
      return 'Updating...';
    }

    return goal.status === 'Completed' ? 'Reopen Goal' : 'Mark Complete';
  };

  return (
    <div className="goal-setting-container">
      <h3>Set Your Fitness Goals</h3>

      <Form onSubmit={handleSubmit}>
        <div className="form-field-group">
          <Form.Label>Goal Type *</Form.Label>
          <Form.Control
            as="select"
            value={goalType}
            onChange={(event) => {
              setGoalType(event.target.value);
              setError('');
            }}
            className={goalType ? 'is-valid' : 'is-invalid'}
          >
            <option value="">Choose a goal</option>
            <option value="Steps">Steps</option>
            <option value="Distance">Distance</option>
            <option value="Active Minutes">Active Minutes</option>
          </Form.Control>
          {!goalType && <div className="invalid-feedback d-block">Please select a goal type.</div>}
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
            }}
            className={Number(targetValue) > 0 ? 'is-valid' : 'is-invalid'}
          />
          {Number(targetValue) <= 0 && <div className="invalid-feedback d-block">Please enter a target greater than 0.</div>}
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
            }}
            className={targetDate && targetDate >= getToday() ? 'is-valid' : 'is-invalid'}
          />
          {targetDate < getToday() && <div className="invalid-feedback d-block">Please choose today or a future date.</div>}
        </div>

        <div className="submit-button-container">
          <Button
            variant="success"
            type="submit"
            disabled={!isFormValid() || saving}
            style={{ opacity: isFormValid() && !saving ? 1 : 0.65, cursor: isFormValid() && !saving ? 'pointer' : 'not-allowed' }}
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

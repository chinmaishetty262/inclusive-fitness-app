import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { trackExercise } from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconButton from '@material-ui/core/IconButton';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import BikeIcon from '@material-ui/icons/DirectionsBike';
import PoolIcon from '@material-ui/icons/Pool';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import OtherIcon from '@material-ui/icons/HelpOutline';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TrackExercise = ({ currentUser }) => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    exerciseType: '',
    description: '',
    duration: '',
    distance: '',
    steps: '',
    date: new Date(),
  });
  const [message, setMessage] = useState('');
  const [warning, setWarning] = useState('');
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isValidNumber = (value) => Number(value) > 0;

  const isFormValid = () => {
    if (!state.exerciseType || state.description.trim() === '' || !isValidNumber(state.duration)) {
      return false;
    }

    // Swimming doesn't require steps
    if (state.exerciseType === 'Swimming') {
      return isValidNumber(state.distance);
    }

    // Gym doesn't require distance
    if (state.exerciseType === 'Gym') {
      return isValidNumber(state.steps);
    }

    // Other exercise types require both distance and steps
    return isValidNumber(state.distance) && isValidNumber(state.steps);
  };

  const getFieldValidationClass = (fieldName, value) => {
    if (!submitted) return '';
    if (value === '' || (fieldName === 'description' && value.trim() === '')) {
      return 'is-invalid';
    }
    if (fieldName === 'exerciseType') {
      return value ? 'is-valid' : 'is-invalid';
    }
    if (['duration', 'distance', 'steps'].includes(fieldName)) {
      return isValidNumber(value) ? 'is-valid' : 'is-invalid';
    }
    return value ? 'is-valid' : 'is-invalid';
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!isFormValid()) {
      setWarning('Please select an exercise type and fill in all required fields before saving.');
      return;
    }

    const dataToSubmit = {
      username: currentUser,
      exerciseType: state.exerciseType,
      description: state.description,
      duration: Number(state.duration),
      distance: Number(state.distance),
      steps: Number(state.steps),
      date: state.date,
    };

    try {
      const response = await trackExercise(dataToSubmit);
      console.log(response.data);

      setState({
        exerciseType: '',
        description: '',
        duration: '',
        distance: '',
        steps: '',
        date: new Date(),
      });
      setSaved(true);
      setMessage('Activity logged successfully! Well done!');
      setWarning('');
      setTimeout(() => setMessage(''), 2000);

    } catch (error) {
      console.error('There was an error logging your activity!', error);
      setWarning('There was an error saving the activity. Please try again.');
    }
  };

  if (saved) {
    return (
      <div style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center', padding: '40px' }}>
        <h3>Activity Saved!</h3>
        <p>Your activity has been saved successfully.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
          <Button variant="secondary" onClick={() => { setSaved(false); setSubmitted(false); }}>
            Add another activity
          </Button>
          <Button variant="primary" onClick={() => navigate('/fitness')}>
            View Activities Summary
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="track-form-container">
      <h3>Track Your Activity</h3>
      <Form onSubmit={onSubmit}>
        <fieldset className="form-field-group">
          <legend className="form-label">Activity Type *</legend>
          <div className="exercise-type-selection">
            <IconButton
              aria-label="Select Running as activity type"
              aria-pressed={state.exerciseType === 'Running'}
              color={state.exerciseType === 'Running' ? "primary" : "default"}
              className={state.exerciseType === 'Running' ? 'selected' : ''}
              onClick={() => { setState({ ...state, exerciseType: 'Running' }); setWarning(''); }}
              title="Running"
            >
              <DirectionsRunIcon fontSize="large" />
            </IconButton>
            <IconButton
              aria-label="Select Cycling as activity type"
              aria-pressed={state.exerciseType === 'Cycling'}
              color={state.exerciseType === 'Cycling' ? "primary" : "default"}
              className={state.exerciseType === 'Cycling' ? 'selected' : ''}
              onClick={() => { setState({ ...state, exerciseType: 'Cycling' }); setWarning(''); }}
              title="Cycling"
            >
              <BikeIcon fontSize="large" />
            </IconButton>
            <IconButton
              aria-label="Select Swimming as activity type"
              aria-pressed={state.exerciseType === 'Swimming'}
              color={state.exerciseType === 'Swimming' ? "primary" : "default"}
              className={state.exerciseType === 'Swimming' ? 'selected' : ''}
              onClick={() => { setState({ ...state, exerciseType: 'Swimming' }); setWarning(''); }}
              title="Swimming"
            >
              <PoolIcon fontSize="large" />
            </IconButton>
            <IconButton
              aria-label="Select Gym as activity type"
              aria-pressed={state.exerciseType === 'Gym'}
              color={state.exerciseType === 'Gym' ? "primary" : "default"}
              className={state.exerciseType === 'Gym' ? 'selected' : ''}
              onClick={() => { setState({ ...state, exerciseType: 'Gym' }); setWarning(''); }}
              title="Gym"
            >
              <FitnessCenterIcon fontSize="large" />
            </IconButton>
            <IconButton
              aria-label="Select Other as activity type"
              aria-pressed={state.exerciseType === 'Other'}
              color={state.exerciseType === 'Other' ? "primary" : "default"}
              className={state.exerciseType === 'Other' ? 'selected' : ''}
              onClick={() => { setState({ ...state, exerciseType: 'Other' }); setWarning(''); }}
              title="Other"
            >
              <OtherIcon fontSize="large" />
            </IconButton>
          </div>
          {submitted && !state.exerciseType && <div className="invalid-feedback d-block">Please select an activity type.</div>}
        </fieldset>


        <div className="form-field-group">
          <Form.Label>Description *</Form.Label>
          <Form.Control
            id="description"
            aria-label="Activity description"
            aria-required="true"
            as="textarea"
            rows={3}
            placeholder="Describe your activity (e.g., 'Morning run in the park')"
            value={state.description}
            onChange={(e) => { setState({ ...state, description: e.target.value }); setWarning(''); }}
            className={getFieldValidationClass('description', state.description)}
          />
          {submitted && state.description.trim() === '' && <div className="invalid-feedback d-block">Please provide a description of your activity.</div>}
        </div>

        <div className="form-field-group">
          <Form.Label>Duration (minutes) *</Form.Label>
          <Form.Control
            id="duration"
            aria-label="Duration in minutes"
            aria-required="true"
            type="number"
            min="1"
            placeholder="e.g., 30"
            value={state.duration}
            onWheel={(e) => e.preventDefault()}
            onChange={(e) => { setState({ ...state, duration: e.target.value }); setWarning(''); }}
            className={getFieldValidationClass('duration', state.duration)}
          />
          {submitted && !isValidNumber(state.duration) && <div className="invalid-feedback d-block">Please enter a valid duration greater than 0.</div>}
        </div>

        {state.exerciseType !== 'Gym' && (
          <div className="form-field-group">
            <Form.Label>Distance (km) {state.exerciseType !== 'Gym' ? '*' : ''}</Form.Label>
            <Form.Control
              id="distance"
              aria-label="Distance in kilometres"
              type="number"
              min="0.01"
              step="any"
              placeholder="e.g., 5.2"
              value={state.distance}
              onWheel={(e) => e.preventDefault()}
              onChange={(e) => { setState({ ...state, distance: e.target.value }); setWarning(''); }}
              className={getFieldValidationClass('distance', state.distance)}
            />
            {submitted && !isValidNumber(state.distance) && <div className="invalid-feedback d-block">Please enter a valid distance greater than 0.</div>}
          </div>
        )}

        {state.exerciseType !== 'Swimming' && (
          <div className="form-field-group">
            <Form.Label>Steps {state.exerciseType !== 'Swimming' ? '*' : ''}</Form.Label>
            <Form.Control
              id="steps"
              aria-label="Number of steps"
              type="number"
              min="1"
              placeholder="e.g., 6000"
              value={state.steps}
              onWheel={(e) => e.preventDefault()}
              onChange={(e) => { setState({ ...state, steps: e.target.value }); setWarning(''); }}
              className={getFieldValidationClass('steps', state.steps)}
            />
            {submitted && !isValidNumber(state.steps) && <div className="invalid-feedback d-block">Please enter a valid number of steps greater than 0.</div>}
          </div>
        )}

        <div className="form-field-group">
          <Form.Label>Date</Form.Label>
          <DatePicker
            selected={state.date}
            onChange={(date) => setState({ ...state, date })}
            dateFormat="yyyy/MM/dd"
            className="form-control"
          />
        </div>

        <div className="submit-button-container">
          <Button
            variant="success"
            type="submit"
          >
            Save Activity
          </Button>
        </div>
      </Form>
      {warning && <div className="warning-message">{warning}</div>}
      {message && <div className="success-message">{message}</div>}
    </div >
  );
};

export default TrackExercise;

import React, { useState } from 'react';
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

  const isValidNumber = (value) => Number(value) > 0;
  const isFormValid = state.exerciseType &&
    state.description.trim() !== '' &&
    isValidNumber(state.duration) &&
    isValidNumber(state.distance) &&
    isValidNumber(state.steps);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setWarning('Please select an exercise type and fill in all fields before saving.');
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
          <Button variant="secondary" onClick={() => setSaved(false)}>
            Add another activity
          </Button>
          <Button variant="primary" onClick={() => navigate('/statistics')}>
            View Activities Summary
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3>Track exercise</h3>
      <Form onSubmit={onSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>

        <Form.Group controlId="formDate" className="form-margin">
          <Form.Label>Date:</Form.Label>
          <DatePicker
            selected={state.date}
            onChange={(date) => setState({ ...state, date })}
            dateFormat="yyyy/MM/dd"
          />
        </Form.Group>
        <div style={{ marginBottom: '20px' }}>
          <IconButton color={state.exerciseType === 'Running' ? "primary" : "default"} onClick={() => { setState({ ...state, exerciseType: 'Running' }); setWarning(''); }}>
            <DirectionsRunIcon fontSize="large" />
          </IconButton>
          <IconButton color={state.exerciseType === 'Cycling' ? "primary" : "default"} onClick={() => { setState({ ...state, exerciseType: 'Cycling' }); setWarning(''); }}>
            <BikeIcon fontSize="large" />
          </IconButton>
          <IconButton color={state.exerciseType === 'Swimming' ? "primary" : "default"} onClick={() => { setState({ ...state, exerciseType: 'Swimming' }); setWarning(''); }}>
            <PoolIcon fontSize="large" />
          </IconButton>
          <IconButton color={state.exerciseType === 'Gym' ? "primary" : "default"} onClick={() => { setState({ ...state, exerciseType: 'Gym' }); setWarning(''); }}>
            <FitnessCenterIcon fontSize="large" />
          </IconButton>
          <IconButton color={state.exerciseType === 'Other' ? "primary" : "default"} onClick={() => { setState({ ...state, exerciseType: 'Other' }); setWarning(''); }}>
            <OtherIcon fontSize="large" />
          </IconButton>
        </div>
        <Form.Group controlId="description" style={{ marginBottom: '20px' }}>
          <Form.Label>Description:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            required
            value={state.description}
            onChange={(e) => { setState({ ...state, description: e.target.value }); setWarning(''); }}
          />
        </Form.Group>
        <Form.Group controlId="duration" style={{ marginBottom: '20px' }}>
          <Form.Label>Duration (in minutes):</Form.Label>
          <Form.Control
            type="number"
            min="1"
            required
            value={state.duration}
            onChange={(e) => { setState({ ...state, duration: e.target.value }); setWarning(''); }}
          />
        </Form.Group>
        <Form.Group controlId="distance" style={{ marginBottom: '20px' }}>
          <Form.Label>Distance (in km):</Form.Label>
          <Form.Control
            type="number"
            min="1"
            required
            value={state.distance}
            onChange={(e) => { setState({ ...state, distance: e.target.value }); setWarning(''); }}
          />
        </Form.Group>
        <Form.Group controlId="steps" style={{ marginBottom: '40px' }}>
          <Form.Label>Steps:</Form.Label>
          <Form.Control
            type="number"
            min="1"
            required
            value={state.steps}
            onChange={(e) => { setState({ ...state, steps: e.target.value }); setWarning(''); }}
          />
        </Form.Group>
        <Button
          variant="success"
          type="submit"
          disabled={!isFormValid}
          style={{ opacity: isFormValid ? 1 : 0.65, cursor: isFormValid ? 'pointer' : 'not-allowed' }}
        >
          Save activity
        </Button>
      </Form>
      {warning && <p style={{ color: 'red', marginTop: '16px' }}>{warning}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
};

export default TrackExercise;

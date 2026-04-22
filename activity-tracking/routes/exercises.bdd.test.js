const express = require('express');
const request = require('supertest');
const { defineFeature, loadFeature } = require('jest-cucumber');

jest.mock('../models/exercise.model', () => {
  const Exercise = jest.fn();
  Exercise.find = jest.fn();
  Exercise.findById = jest.fn();
  Exercise.findByIdAndDelete = jest.fn();
  return Exercise;
});

const Exercise = require('../models/exercise.model');
const router = require('./exercises');

const feature = loadFeature('./features/exercises.feature');

defineFeature(feature, test => {
  let app;
  let response;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use('/exercises', router);
    response = undefined;
  });

  test('Creating an exercise converts numeric fields', ({ given, when, then, and }) => {
    const payload = {
      username: 'alex',
      exerciseType: 'Running',
      description: 'Tempo run',
      duration: '45',
      date: '2026-03-01',
      steps: '7000',
      distance: '8.5'
    };
    const save = jest.fn().mockResolvedValueOnce();

    given('a valid exercise payload with numeric values as strings', () => {
      Exercise.mockImplementationOnce(function Exercise(doc) {
        Object.assign(this, doc);
        this.save = save;
      });
    });

    when('the client creates the exercise', async () => {
      response = await request(app).post('/exercises/add').send(payload);
    });

    then('the API stores the numeric fields as numbers', () => {
      expect(Exercise).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 45,
          steps: 7000,
          distance: 8.5,
          date: expect.any(Number)
        })
      );
    });

    and('the API returns a success message', () => {
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Exercise added!' });
      expect(save).toHaveBeenCalledTimes(1);
    });
  });

  test('Updating an exercise with missing required fields', ({ given, when, then }) => {
    given('an incomplete update payload', () => {});

    when('the client updates an exercise', async () => {
      response = await request(app)
        .put('/exercises/update/ex1')
        .send({
          username: 'alex',
          exerciseType: 'Running',
          description: 'Tempo run'
        });
    });

    then('the API responds that all fields are required', () => {
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'All fields are required' });
      expect(Exercise.findById).not.toHaveBeenCalled();
    });
  });

  test('Deleting an exercise that does not exist', ({ given, when, then }) => {
    given('the requested exercise does not exist', () => {
      Exercise.findByIdAndDelete.mockResolvedValueOnce(null);
    });

    when('the client deletes the exercise', async () => {
      response = await request(app).delete('/exercises/missing-id');
    });

    then('the API responds that the exercise was not found', () => {
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Exercise not found' });
    });
  });
});

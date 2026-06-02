const express = require('express');
const request = require('supertest');
const { defineFeature, loadFeature } = require('jest-cucumber');

jest.mock('../models/workoutGuide.model', () => ({
  find: jest.fn()
}));

const WorkoutGuide = require('../models/workoutGuide.model');
const router = require('./workoutGuides');

const feature = loadFeature('./features/workoutGuides.feature');

const makeGuide = (overrides = {}) => ({
  _id: 'guide-1',
  name: 'Seated Arm Circles',
  category: 'wheelchair',
  difficulty: 'Beginner',
  duration: '5–10 min',
  description: 'Gentle shoulder warm-up.',
  steps: ['Sit upright.', 'Extend arms to sides.'],
  ...overrides,
});

defineFeature(feature, test => {
  let app;
  let response;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use('/workout-guides', router);
    response = undefined;
  });

  test('Fetching all workout guides', ({ given, when, then }) => {
    const allGuides = [
      makeGuide({ _id: 'g1', category: 'wheelchair' }),
      makeGuide({ _id: 'g2', name: 'Bodyweight Circuit', category: 'general' }),
    ];

    given('the database contains workout guides across multiple categories', () => {
      WorkoutGuide.find.mockReturnValueOnce({
        sort: jest.fn().mockResolvedValueOnce(allGuides)
      });
    });

    when('the client requests all workout guides', async () => {
      response = await request(app).get('/workout-guides');
    });

    then('the API returns all guides', () => {
      expect(response.status).toBe(200);
      expect(response.body.guides).toHaveLength(2);
      expect(WorkoutGuide.find).toHaveBeenCalledWith({});
    });
  });

  test('Fetching workout guides filtered by category', ({ given, when, then }) => {
    const wheelchairGuides = [
      makeGuide({ _id: 'g1' }),
      makeGuide({ _id: 'g2', name: 'Resistance Band Pull-Aparts' }),
    ];

    given('the database contains workout guides across multiple categories', () => {
      WorkoutGuide.find.mockReturnValueOnce({
        sort: jest.fn().mockResolvedValueOnce(wheelchairGuides)
      });
    });

    when('the client requests guides for the wheelchair category', async () => {
      response = await request(app).get('/workout-guides?category=wheelchair');
    });

    then('the API returns only wheelchair guides', () => {
      expect(response.status).toBe(200);
      expect(response.body.guides).toHaveLength(2);
      expect(WorkoutGuide.find).toHaveBeenCalledWith({ category: 'wheelchair' });
    });
  });

  test('Fetching guides when none match the requested category', ({ given, when, then }) => {
    given('the database contains no guides for the requested category', () => {
      WorkoutGuide.find.mockReturnValueOnce({
        sort: jest.fn().mockResolvedValueOnce([])
      });
    });

    when('the client requests guides for the wheelchair category', async () => {
      response = await request(app).get('/workout-guides?category=wheelchair');
    });

    then('the API returns an empty list', () => {
      expect(response.status).toBe(200);
      expect(response.body.guides).toEqual([]);
    });
  });

  test('Handling a database error when fetching guides', ({ given, when, then }) => {
    given('the database throws an error when queried', () => {
      WorkoutGuide.find.mockReturnValueOnce({
        sort: jest.fn().mockRejectedValueOnce(new Error('DB connection lost'))
      });
    });

    when('the client requests all workout guides', async () => {
      response = await request(app).get('/workout-guides');
    });

    then('the API responds with a server error', () => {
      expect(response.status).toBe(500);
      expect(response.body.error).toMatch(/DB connection lost/);
    });
  });
});

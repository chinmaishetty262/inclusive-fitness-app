const { defineFeature, loadFeature } = require('jest-cucumber');
const Exercise = require('./exercise.model');

const feature = loadFeature('./features/exercise-model.feature');

defineFeature(feature, test => {
  let exercise;
  let error;

  beforeEach(() => {
    exercise = undefined;
    error = undefined;
  });

  test('Accepting a valid exercise with optional metrics', ({ given, when, then }) => {
    given('a valid exercise document with distance and steps', () => {
      exercise = new Exercise({
        username: 'alex',
        exerciseType: 'Running',
        description: 'Morning run',
        duration: 30,
        date: new Date('2026-03-01'),
        steps: 4500,
        distance: 5.2
      });
    });

    when('the exercise document is validated', () => {
      error = exercise.validateSync();
    });

    then('the document is accepted', () => {
      expect(error).toBeUndefined();
    });
  });

  test('Rejecting an exercise with non-integer steps', ({ given, when, then }) => {
    given('an exercise document with decimal steps', () => {
      exercise = new Exercise({
        username: 'alex',
        exerciseType: 'Walking',
        duration: 30,
        date: new Date('2026-03-01'),
        steps: 1234.5
      });
    });

    when('the exercise document is validated', () => {
      error = exercise.validateSync();
    });

    then('the document reports that steps must be an integer', () => {
      expect(error.errors.steps.message).toBe('Steps should be an integer.');
    });
  });

  test('Rejecting an exercise with an unsupported type', ({ given, when, then }) => {
    given('an exercise document with an unsupported exercise type', () => {
      exercise = new Exercise({
        username: 'alex',
        exerciseType: 'Rowing',
        duration: 30,
        date: new Date('2026-03-01')
      });
    });

    when('the exercise document is validated', () => {
      error = exercise.validateSync();
    });

    then('the document reports that the exercise type is invalid', () => {
      expect(error.errors.exerciseType.message).toContain('`Rowing` is not a valid enum value');
    });
  });

  test('Rejecting an exercise with a non-positive duration', ({ given, when, then }) => {
    given('an exercise document with a non-positive duration', () => {
      exercise = new Exercise({
        username: 'alex',
        exerciseType: 'Gym',
        duration: 0,
        date: new Date('2026-03-01')
      });
    });

    when('the exercise document is validated', () => {
      error = exercise.validateSync();
    });

    then('the document reports that the duration must be positive', () => {
      expect(error.errors.duration.message).toBe('Duration should be positive.');
    });
  });
});

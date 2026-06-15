jest.mock('../api', () => ({
  getWorkoutGuides: jest.fn()
}));

import React, { act } from 'react';
import { render, screen, waitFor, fireEvent, cleanup } from '@testing-library/react';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { getWorkoutGuides } from '../api';
import WorkoutGuides from './workoutGuides';

const feature = loadFeature('./src/components/features/workoutGuides.feature');

const makeGuide = (overrides = {}) => ({
  _id: 'guide-1',
  name: 'Bodyweight Strength Circuit',
  difficulty: 'Beginner',
  duration: '30 min',
  description: 'A foundational strength workout using only your bodyweight.',
  steps: ['Squats: 3 sets of 15 reps.', 'Push-ups: 3 sets of 10 reps.'],
  category: 'general',
  ...overrides,
});

defineFeature(feature, test => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test('Showing guides for the default category on load', ({ given, when, then }) => {
    given('the workout guides service returns guides for the general category', () => {
      getWorkoutGuides.mockResolvedValueOnce({
        data: { guides: [makeGuide()] }
      });
    });

    when('the workout guides page is opened', async () => {
      await act(async () => {
        render(<WorkoutGuides />);
      });
    });

    then('the guides for the general category are displayed', async () => {
      expect(await screen.findByText('Bodyweight Strength Circuit')).toBeInTheDocument();
      expect(screen.getByText('A foundational strength workout using only your bodyweight.')).toBeInTheDocument();
      expect(screen.getByText('Beginner')).toBeInTheDocument();
      expect(getWorkoutGuides).toHaveBeenCalledWith('general');
    });
  });

  test('Switching to a different accessibility category', ({ given, and, when, then }) => {
    given('the workout guides service returns guides for the general category', () => {
      getWorkoutGuides.mockResolvedValueOnce({
        data: { guides: [makeGuide()] }
      });
    });

    and('the workout guides service returns guides for the wheelchair category', () => {
      getWorkoutGuides.mockResolvedValueOnce({
        data: {
          guides: [
            makeGuide({
              _id: 'guide-2',
              name: 'Seated Arm Circles',
              description: 'Gentle shoulder warm-up.',
              category: 'wheelchair',
            })
          ]
        }
      });
    });

    when('the workout guides page is opened', async () => {
      await act(async () => {
        render(<WorkoutGuides />);
      });
      await screen.findByText('Bodyweight Strength Circuit');
    });

    and('the user selects the wheelchair category', async () => {
      await act(async () => {
        fireEvent.click(screen.getByRole('tab', { name: /wheelchair/i }));
      });
    });

    then('the guides for the wheelchair category are displayed', async () => {
      expect(await screen.findByText('Seated Arm Circles')).toBeInTheDocument();
      expect(getWorkoutGuides).toHaveBeenCalledWith('wheelchair');
    });
  });

  test('Expanding a workout card to see its steps', ({ given, when, and, then }) => {
    given('the workout guides service returns a guide with steps', () => {
      getWorkoutGuides.mockResolvedValueOnce({
        data: { guides: [makeGuide()] }
      });
    });

    when('the workout guides page is opened', async () => {
      await act(async () => {
        render(<WorkoutGuides />);
      });
      await screen.findByText('Bodyweight Strength Circuit');
    });

    and('the user expands the first workout card', async () => {
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /show steps/i }));
      });
    });

    then('the workout steps are shown', () => {
      expect(screen.getByText('Squats: 3 sets of 15 reps.')).toBeInTheDocument();
      expect(screen.getByText('Push-ups: 3 sets of 10 reps.')).toBeInTheDocument();
    });
  });

  test('Showing an error when guides cannot be loaded', ({ given, when, then }) => {
    given('the workout guides service request fails', () => {
      getWorkoutGuides.mockRejectedValueOnce(new Error('Network error'));
    });

    when('the workout guides page is opened', async () => {
      await act(async () => {
        render(<WorkoutGuides />);
      });
    });

    then('the workout guides page shows a load error', async () => {
      expect(
        await screen.findByText(/Unable to load workout guides right now/i)
      ).toBeInTheDocument();
    });
  });
});

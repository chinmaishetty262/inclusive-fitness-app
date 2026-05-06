import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { defineFeature, loadFeature } from 'jest-cucumber';
import axiosInstance from '../components/axiosInstance';
import Dashboard from './dashboard';

jest.mock('../components/axiosInstance');
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const feature = loadFeature('./src/components/features/dashboard.feature');

defineFeature(feature, test => {
  let currentUser;

  beforeEach(() => {
    jest.clearAllMocks();
    currentUser = 'testuser';
  });

  test('Showing the dashboard summary and action button', ({ given, when, then, and }) => {
    given('the statistics service returns totals for the current user', () => {
      axiosInstance.get
        .mockResolvedValueOnce({
          data: {
            stats: [
              {
                username: 'testuser',
                exercises: [
                  { exerciseType: 'Running', totalDuration: 30, totalDistance: 5, totalSteps: 6000 }
                ]
              }
            ]
          }
        })
        .mockResolvedValueOnce({ data: { stats: [] } });
    });

    and('the activity service returns recent activities for the current user', () => {
      axiosInstance.get.mockResolvedValueOnce({
        data: [
          {
            username: 'testuser',
            exerciseType: 'Running',
            date: { $date: new Date('2024-01-01').toISOString() },
            duration: 30,
            distance: 5,
            steps: 6000,
            description: 'Morning run'
          }
        ]
      });
    });

    when('the dashboard is opened for that user', () => {
      render(<Dashboard currentUser={currentUser} />);
    });

    then('the dashboard shows activity summary bubbles', async () => {
      expect(await screen.findByText('Active Minutes')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
      expect(screen.getByText('5.00 km')).toBeInTheDocument();
    });

    and('the dashboard shows the track activity button', () => {
      expect(screen.getByRole('button', { name: /\+ Log Activity/i })).toBeInTheDocument();
    });
  });

  test('Navigating to the track exercise page from the dashboard', ({ given, when, then }) => {
    given('the statistics and activity services are available for the current user', () => {
      axiosInstance.get
        .mockResolvedValueOnce({
          data: {
            stats: [
              {
                username: 'testuser',
                exercises: [ { exerciseType: 'Walking', totalDuration: 20, totalDistance: 2, totalSteps: 3000 } ]
              }
            ]
          }
        })
        .mockResolvedValueOnce({ data: { stats: [] } })
        .mockResolvedValueOnce({ data: [] });
    });

    when('the user clicks the track activity button', async () => {
      render(<Dashboard currentUser={currentUser} />);
      await screen.findByText('Active Minutes');
      fireEvent.click(screen.getByRole('button', { name: /\+ Log Activity/i }));
    });

    then('navigation to the track exercise page occurs', () => {
      expect(mockNavigate).toHaveBeenCalledWith('/trackExercise');
    });
  });
});

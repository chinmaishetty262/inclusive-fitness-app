import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { defineFeature, loadFeature } from 'jest-cucumber';
import axiosInstance from '../components/axiosInstance';
import ActivityFeed from './activityFeed';

jest.mock('../components/axiosInstance');

const feature = loadFeature('./src/components/features/activityFeed.feature');

defineFeature(feature, test => {
  let currentUser;

  beforeEach(() => {
    jest.clearAllMocks();
    currentUser = 'testuser';
  });

  test('Showing the current user\'s recent activities', ({ given, when, then }) => {
    given('the activity service returns recent activities for the current user', () => {
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
          },
          {
            username: 'testuser',
            exerciseType: 'Walking',
            date: { $date: new Date('2024-01-02').toISOString() },
            duration: 20,
            distance: 2,
            steps: 3000
          }
        ]
      });
    });

    when('the activity feed is opened for that user', async () => {
      await act(async () => {
        render(<ActivityFeed currentUser={currentUser} />);
      });
    });

    then('the feed lists the user\'s activity details', async () => {
      expect(await screen.findByText('Running')).toBeInTheDocument();
      expect(screen.getByText('Walking')).toBeInTheDocument();
      expect(screen.getByText('Duration: 30 min')).toBeInTheDocument();
      expect(screen.getByText('Distance: 5.00 km')).toBeInTheDocument();
      expect(screen.getByText('Steps: 6000')).toBeInTheDocument();
      expect(screen.getByText('Morning run')).toBeInTheDocument();
    });
  });

  test('Showing an error when the feed cannot be loaded', ({ given, when, then }) => {
    given('the activity service request fails', () => {
      axiosInstance.get.mockRejectedValueOnce(new Error('Network error'));
    });

    when('the activity feed is opened for that user', async () => {
      await act(async () => {
        render(<ActivityFeed currentUser={currentUser} />);
      });
    });

    then('the feed shows an activity load error', async () => {
      await waitFor(() => expect(screen.getByText(/Unable to load your activity feed/i)).toBeInTheDocument());
    });
  });

  test('Showing an empty feed when the user has no activities', ({ given, when, then }) => {
    given('the activity service returns no activities for the current user', () => {
      axiosInstance.get.mockResolvedValueOnce({ data: [] });
    });

    when('the activity feed is opened for that user', async () => {
      await act(async () => {
        render(<ActivityFeed currentUser={currentUser} />);
      });
    });

    then('the feed shows that no recent activities are available', async () => {
      await waitFor(() => expect(screen.getByText(/No recent activities available/i)).toBeInTheDocument());
    });
  });
});

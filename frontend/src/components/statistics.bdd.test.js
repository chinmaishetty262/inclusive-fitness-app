import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { defineFeature, loadFeature } from 'jest-cucumber';
import axiosInstance from '../components/axiosInstance';
import ActivitiesSummary from './statistics';

jest.mock('../components/axiosInstance');

const feature = loadFeature('./src/components/features/statistics.feature');

defineFeature(feature, test => {
  let currentUser;

  beforeEach(() => {
    jest.clearAllMocks();
    currentUser = 'testuser';
  });

  test('Showing summary totals for the current user', ({ given, when, then, and }) => {
    given('the statistics service returns totals for the current user', () => {
      axiosInstance.get.mockResolvedValueOnce({
        data: {
          stats: [
            {
              username: 'testuser',
              exercises: [
                { exerciseType: 'Running', totalDuration: 30, totalDistance: 5, totalSteps: 6000 },
                { exerciseType: 'Walking', totalDuration: 20, totalDistance: 2, totalSteps: 3000 }
              ]
            }
          ]
        }
      });
    });

    when('the statistics summary is opened for that user', () => {
      render(<ActivitiesSummary currentUser={currentUser} />);
    });

    then('the summary bubbles show the combined totals', async () => {
      await screen.findByText('Running');
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('7 km')).toBeInTheDocument();
      expect(screen.getByText('9000')).toBeInTheDocument();
    });

    and('the activity totals section shows each exercise type', () => {
      expect(screen.getByText('Running')).toBeInTheDocument();
      expect(screen.getByText('Walking')).toBeInTheDocument();
    });
  });

  test('Showing fallback totals for missing values', ({ given, when, then }) => {
    given('the statistics service returns activity totals with missing distance or steps values', () => {
      axiosInstance.get.mockResolvedValueOnce({
        data: {
          stats: [
            {
              username: 'testuser',
              exercises: [
                { exerciseType: 'Cycling', totalDuration: 45, totalDistance: 12 },
                { exerciseType: 'Other', totalDuration: 10, totalSteps: 800 }
              ]
            }
          ]
        }
      });
    });

    when('the statistics summary is opened for that user', () => {
      render(<ActivitiesSummary currentUser={currentUser} />);
    });

    then('missing activity totals are shown as zero', async () => {
      await screen.findByText('Cycling');
      expect(screen.getByText('Steps: 0')).toBeInTheDocument();
      expect(screen.getByText('Distance: 0 km')).toBeInTheDocument();
    });
  });

  test('Showing an error when statistics cannot be loaded', ({ given, when, then }) => {
    given('the statistics service request fails', () => {
      axiosInstance.get.mockRejectedValueOnce(new Error('Network error'));
    });

    when('the statistics summary is opened for that user', () => {
      render(<ActivitiesSummary currentUser={currentUser} />);
    });

    then('the statistics view shows a load error', async () => {
      await waitFor(() => expect(screen.getByText(/Unable to load statistics right now/i)).toBeInTheDocument());
    });
  });

  test('Showing no activity totals when none exist', ({ given, when, then }) => {
    given('the statistics service returns no exercise totals for the current user', () => {
      axiosInstance.get.mockResolvedValueOnce({
        data: {
          stats: [
            {
              username: 'testuser',
              exercises: []
            }
          ]
        }
      });
    });

    when('the statistics summary is opened for that user', () => {
      render(<ActivitiesSummary currentUser={currentUser} />);
    });

    then('the statistics view shows that no activity type totals are available', async () => {
      await waitFor(() => expect(screen.getByText(/No activity type totals available/i)).toBeInTheDocument());
    });
  });
});

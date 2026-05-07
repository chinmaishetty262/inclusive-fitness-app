import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
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

  afterEach(() => {
    cleanup();
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
      await screen.findByText(/running/i);

      // totals: duration 50, distance 7, steps 9000
      await waitFor(() => {
        expect(screen.getByText(/50/)).toBeInTheDocument();
        expect(screen.getByText(/7(\.00)?\s*km/i)).toBeInTheDocument();
        expect(screen.getByText(/9000/)).toBeInTheDocument();
      });
    });

    and('the activity totals section shows each exercise type', async () => {
      expect(await screen.findByText(/running/i)).toBeInTheDocument();
      expect(await screen.findByText(/walking/i)).toBeInTheDocument();
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
      expect(await screen.findByText(/cycling/i)).toBeInTheDocument();

      expect(screen.getByText(/steps:\s*0/i)).toBeInTheDocument();
      expect(screen.getByText(/distance:\s*0/i)).toBeInTheDocument();
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
      expect(
        await screen.findByText(/Unable to load statistics right now/i)
      ).toBeInTheDocument();
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
      expect(
        await screen.findByText(/No activity type totals available/i)
      ).toBeInTheDocument();
    });
  });

  test('Updating statistics when the selected user changes', ({ given, when, then }) => {
    given('the statistics service returns totals for the first user and then for a second user', () => {
      axiosInstance.get
        .mockResolvedValueOnce({
          data: {
            stats: [
              {
                username: 'testuser',
                exercises: [
                  { exerciseType: 'Running', totalDuration: 25, totalDistance: 4, totalSteps: 4000 }
                ]
              }
            ]
          }
        })
        .mockResolvedValueOnce({ data: { stats: [] } })
        .mockResolvedValueOnce({
          data: {
            stats: [
              {
                username: 'seconduser',
                exercises: [
                  { exerciseType: 'Cycling', totalDuration: 40, totalDistance: 12, totalSteps: 0 }
                ]
              }
            ]
          }
        })
        .mockResolvedValueOnce({ data: { stats: [] } });
    });

    when('the statistics summary is opened for the first user and then updated for the second user', async () => {
      const { rerender } = render(<ActivitiesSummary currentUser={currentUser} />);
      await screen.findByText(/running/i);

      rerender(<ActivitiesSummary currentUser="seconduser" />);
    });

    then("the summary bubbles update to reflect the second user's totals", async () => {
      expect(await screen.findByText(/cycling/i)).toBeInTheDocument();

      expect(screen.getByText(/40/)).toBeInTheDocument();
      expect(screen.getByText(/12(\.00)?\s*km/i)).toBeInTheDocument();
    });
  });
});
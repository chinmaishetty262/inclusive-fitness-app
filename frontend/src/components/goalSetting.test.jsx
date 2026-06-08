import { render, screen, waitFor } from '@testing-library/react';
import GoalSetting from './goalSetting';
import { getGoals, getTrackedActivities } from '../api';

jest.mock('../api', () => ({
  addGoal: jest.fn(),
  deleteGoal: jest.fn(),
  getGoals: jest.fn(),
  getTrackedActivities: jest.fn(),
  updateGoal: jest.fn(),
}));

describe('GoalSetting progress from tracked activities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('shows goal progress calculated from matching tracked activities', async () => {
    getGoals.mockResolvedValue({
      data: {
        goals: [
          {
            _id: 'goal-1',
            username: 'alex@example.com',
            goalType: 'Steps',
            targetValue: 10000,
            period: 'Weekly',
            startDate: '2026-06-01T00:00:00.000Z',
            targetDate: '2026-06-08T00:00:00.000Z',
            status: 'Active',
          },
        ],
      },
    });

    getTrackedActivities.mockResolvedValue({
      data: [
        {
          username: 'alex@example.com',
          exerciseType: 'Running',
          steps: 4000,
          distance: 4,
          duration: 30,
          date: '2026-06-03T10:00:00.000Z',
        },
        {
          username: 'alex@example.com',
          exerciseType: 'Gym',
          steps: 2500,
          distance: 0,
          duration: 45,
          date: '2026-06-06T10:00:00.000Z',
        },
        {
          username: 'other@example.com',
          exerciseType: 'Running',
          steps: 9000,
          distance: 7,
          duration: 60,
          date: '2026-06-06T10:00:00.000Z',
        },
      ],
    });

    render(<GoalSetting currentUser="alex@example.com" onChangePreferences={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(/Progress: 6500 \/ 10000 steps/i)).toBeInTheDocument();
      expect(screen.getByText('65%')).toBeInTheDocument();
    });
  });
});

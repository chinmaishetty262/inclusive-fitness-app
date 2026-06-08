import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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
          {
            _id: 'goal-2',
            username: 'alex@example.com',
            goalType: 'Reps',
            targetValue: 5000,
            period: 'Weekly',
            startDate: '2026-06-01T00:00:00.000Z',
            targetDate: '2026-06-08T00:00:00.000Z',
            status: 'Active',
          },
          {
            _id: 'goal-3',
            username: 'alex@example.com',
            goalType: 'Laps',
            targetValue: 20,
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
          username: 'alex@example.com',
          exerciseType: 'Cycling',
          steps: 12,
          distance: 8,
          duration: 40,
          date: '2026-06-07T10:00:00.000Z',
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

    render(
      <MemoryRouter>
        <GoalSetting currentUser="alex@example.com" onChangePreferences={jest.fn()} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Progress: 4000 \/ 10000 steps/i)).toBeInTheDocument();
      expect(screen.getByText(/Progress: 2500 \/ 5000 reps/i)).toBeInTheDocument();
      expect(screen.getByText(/Progress: 12 \/ 20 laps/i)).toBeInTheDocument();
      expect(screen.getByText('40%')).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument();
      expect(screen.getByText('60%')).toBeInTheDocument();
    });
  });

  test('hides the create goal form unless create mode is requested', async () => {
    getGoals.mockResolvedValue({ data: { goals: [] } });
    getTrackedActivities.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <GoalSetting currentUser="alex@example.com" onChangePreferences={jest.fn()} />
      </MemoryRouter>
    );

    await screen.findByText(/No goals saved yet/i);

    expect(screen.queryByText(/Goal Type \*/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Save Goal/i })).not.toBeInTheDocument();
  });

  test('shows the create goal form in create mode', async () => {
    getGoals.mockResolvedValue({ data: { goals: [] } });
    getTrackedActivities.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter initialEntries={['/goals?goalAction=create']}>
        <GoalSetting currentUser="alex@example.com" onChangePreferences={jest.fn()} />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Goal Type \*/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Goal/i })).toBeInTheDocument();
  });

  test('marks only the selected goal when the latest activity matches multiple goals', async () => {
    const latestCyclingActivity = {
      username: 'alex@example.com',
      exerciseType: 'Cycling',
      steps: 6,
      distance: 12,
      duration: 35,
      date: '2026-06-07T10:00:00.000Z',
    };

    getGoals.mockResolvedValue({
      data: {
        goals: [
          {
            _id: 'goal-active-minutes',
            username: 'alex@example.com',
            goalType: 'Active Minutes',
            targetValue: 300,
            period: 'Weekly',
            startDate: '2026-06-01T00:00:00.000Z',
            targetDate: '2026-06-08T00:00:00.000Z',
            status: 'Active',
          },
          {
            _id: 'goal-distance',
            username: 'alex@example.com',
            goalType: 'Distance',
            targetValue: 100,
            period: 'Weekly',
            startDate: '2026-06-01T00:00:00.000Z',
            targetDate: '2026-06-08T00:00:00.000Z',
            status: 'Active',
          },
          {
            _id: 'goal-laps',
            username: 'alex@example.com',
            goalType: 'Laps',
            targetValue: 20,
            period: 'Weekly',
            startDate: '2026-06-01T00:00:00.000Z',
            targetDate: '2026-06-08T00:00:00.000Z',
            status: 'Active',
          },
          {
            _id: 'goal-reps',
            username: 'alex@example.com',
            goalType: 'Reps',
            targetValue: 500,
            period: 'Weekly',
            startDate: '2026-06-01T00:00:00.000Z',
            targetDate: '2026-06-08T00:00:00.000Z',
            status: 'Active',
          },
        ],
      },
    });
    getTrackedActivities.mockResolvedValue({ data: [latestCyclingActivity] });

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/goals',
            search: '?goalAction=update',
            state: { trackedActivity: latestCyclingActivity },
          },
        ]}
      >
        <GoalSetting currentUser="alex@example.com" onChangePreferences={jest.fn()} />
      </MemoryRouter>
    );

    expect(await screen.findByRole('group', { name: /Choose the goal updated by this activity/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Active Minutes - 35 min/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Distance - 12.00 km/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Laps - 6 laps/i })).toBeInTheDocument();

    expect(screen.queryByLabelText(/Active Minutes updated from latest activity/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Distance updated from latest activity/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Laps updated from latest activity/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Laps - 6 laps/i }));

    expect(screen.getByLabelText(/Laps updated from latest activity/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Active Minutes updated from latest activity/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Distance updated from latest activity/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Reps updated from latest activity/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Latest activity added 6 laps/i)).toBeInTheDocument();
  });
});

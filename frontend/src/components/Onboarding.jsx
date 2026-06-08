import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const goals = [
    { id: 'lose-weight', label: '🔥 Lose Weight' },
    { id: 'build-muscle', label: '💪 Build Muscle' },
    { id: 'improve-stamina', label: '🏃 Improve Stamina' },
    { id: 'stay-active', label: '🧘 Stay Active' },
];

const levels = ['Beginner', 'Intermediate', 'Advanced'];

const levelDescriptions = {
    Beginner: "🌱 Beginner — I'm just getting started",
    Intermediate: '⚡ Intermediate — I exercise a few times a week',
    Advanced: '🏆 Advanced — I train regularly and intensely',
};

const canUseNotifications = () => (
    typeof window !== 'undefined'
    && 'Notification' in window
    && typeof window.Notification.requestPermission === 'function'
);

const Onboarding = ({ onComplete }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [done, setDone] = useState(false);
    const [goal, setGoal] = useState('');
    const [level, setLevel] = useState('');
    const [reminders, setReminders] = useState(false);
    const [reminderTime, setReminderTime] = useState('08:00');

    const scheduleReminder = (time) => {
        if (canUseNotifications() && window.Notification.permission === 'granted') {
            const [hours, minutes] = time.split(':').map(Number);
            const now = new Date();
            const reminder = new Date();
            reminder.setHours(hours, minutes, 0, 0);
            if (reminder <= now) reminder.setDate(reminder.getDate() + 1);
            const delay = reminder - now;
            setTimeout(() => {
                new window.Notification('Inclusive Fitness', {
                    body: `Time to move! Your goal: ${goal}`,
                    icon: '/logo192.png'
                });
            }, delay);
        }
    };

    const finish = () => {
        const profile = { goal, level, reminders, reminderTime };
        localStorage.setItem('userProfile', JSON.stringify(profile));
        if (reminders && canUseNotifications()) {
            window.Notification.requestPermission().then(permission => {
                if (permission === 'granted') scheduleReminder(reminderTime);
            });
        }
        setDone(true);
    };

    const goToGoals = () => {
        onComplete();
        navigate('/goals');
    };

    const skip = () => {
        onComplete();
    };

    if (done) {
        return (
            <div style={{ textAlign: 'center', padding: 32, maxWidth: 500, margin: 'auto' }}>
                <h2>🎉 You're all set!</h2>
                <p style={{ color: '#4b5d7e', marginBottom: 24, marginTop: 16 }}>
                    Your goal has been saved. Head to the <strong>Goals</strong> page to set targets and track your progress.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <button className="btn btn-secondary" onClick={onComplete} aria-label="Go to Dashboard">
                        Go to Dashboard
                    </button>
                    <button className="btn btn-primary" onClick={goToGoals} aria-label="Go to Goals page">
                        Go to Goals page →
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 500, margin: 'auto', padding: 32 }}>

            {step === 0 && (
                <>
                    <h2>What's your fitness goal?</h2>
                    <p style={{ color: '#666', marginBottom: 24 }}>We'll personalise your dashboard based on this.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        {goals.map(g => (
                            <button
                                key={g.id}
                                role="switch"
                                aria-checked={goal === g.label}
                                aria-label={goal === g.label ? `${g.label}, selected` : `${g.label}, not selected`}
                                onClick={() => setGoal(g.label)}
                                className={`onboarding-btn${goal === g.label ? ' onboarding-selected' : ''}`}
                            >
                                {g.label}
                            </button>
                        ))}
                    </div>
                    <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between' }}>
                        <button className="btn btn-secondary" onClick={skip} aria-label="Skip onboarding">Skip</button>
                        <button
                            className="btn btn-primary"
                            disabled={!goal}
                            onClick={() => setStep(1)}
                            aria-label={!goal ? 'Select a goal to continue' : 'Next step'}
                        >
                            Next →
                        </button>
                    </div>
                </>
            )}

            {step === 1 && (
                <>
                    <h2>How active are you right now?</h2>
                    <p style={{ color: '#666', marginBottom: 24 }}>Choose your intensity.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {levels.map(l => (
                            <button
                                key={l}
                                role="switch"
                                aria-checked={level === l}
                                aria-label={level === l ? `${l}, selected` : `${l}, not selected`}
                                onClick={() => setLevel(l)}
                                className={`onboarding-btn onboarding-btn--level${level === l ? ' onboarding-selected' : ''}`}
                            >
                                {levelDescriptions[l]}
                            </button>
                        ))}
                    </div>
                    <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between' }}>
                        <button className="btn btn-secondary" onClick={() => setStep(0)} aria-label="Back to goal selection">← Back</button>
                        <button
                            className="btn btn-primary"
                            disabled={!level}
                            onClick={() => setStep(2)}
                            aria-label={!level ? 'Select an activity level to continue' : 'Next step'}
                        >
                            Next →
                        </button>
                    </div>
                </>
            )}

            {step === 2 && (
                <>
                    <h2>Stay on track 🔔</h2>
                    <p style={{ color: '#666', marginBottom: 24 }}>Want a daily nudge to keep you moving?</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                        <label htmlFor="reminders-checkbox" style={{ fontWeight: 600 }}>
                            Send me motivation reminders
                        </label>
                        <input
                            id="reminders-checkbox"
                            type="checkbox"
                            checked={reminders}
                            onChange={e => setReminders(e.target.checked)}
                            aria-label={reminders ? 'Disable motivation reminders' : 'Enable motivation reminders'}
                            style={{ width: 20, height: 20, cursor: 'pointer' }}
                        />
                    </div>
                    {reminders && (
                        <div style={{ marginBottom: 24 }}>
                            <label htmlFor="reminder-time" style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>
                                Reminder time
                            </label>
                            <input
                                id="reminder-time"
                                type="time"
                                value={reminderTime}
                                onChange={e => setReminderTime(e.target.value)}
                                className="form-control"
                                aria-label="Set daily reminder time"
                                style={{ width: 160 }}
                            />
                        </div>
                    )}
                    <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between' }}>
                        <button className="btn btn-secondary" onClick={() => setStep(1)} aria-label="Back to activity level selection">← Back</button>
                        <button className="btn btn-success" onClick={finish} aria-label="Finish setup and save profile">Finish 🎉</button>
                    </div>
                </>
            )}

            <div
                aria-label={`Step ${step + 1} of 3`}
                style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}
            >
                {[0, 1, 2].map(i => (
                    <div key={i} aria-hidden="true" style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: step === i ? '#1f72ff' : '#ddd'
                    }} />
                ))}
            </div>
        </div>
    );
};

export default Onboarding;

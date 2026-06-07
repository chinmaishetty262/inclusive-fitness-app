import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const goals = [
    { id: 'lose-weight', label: '🔥 Lose Weight' },
    { id: 'build-muscle', label: '💪 Build Muscle' },
    { id: 'improve-stamina', label: '🏃 Improve Stamina' },
    { id: 'stay-active', label: '🧘 Stay Active' },
];

const levels = ['Beginner', 'Intermediate', 'Advanced'];

const Onboarding = ({ onComplete }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [done, setDone] = useState(false);
    const [goal, setGoal] = useState('');
    const [level, setLevel] = useState('');
    const [reminders, setReminders] = useState(false);
    const [reminderTime, setReminderTime] = useState('08:00');

    const scheduleReminder = (time) => {
        if (Notification.permission === 'granted') {
            const [hours, minutes] = time.split(':').map(Number);
            const now = new Date();
            const reminder = new Date();
            reminder.setHours(hours, minutes, 0, 0);
            if (reminder <= now) reminder.setDate(reminder.getDate() + 1);
            const delay = reminder - now;
            setTimeout(() => {
                new Notification('Inclusive Fitness 💪', {
                    body: `Time to move! Your goal: ${goal}`,
                    icon: '/logo192.png'
                });
            }, delay);
        }
    };

    const finish = () => {
        const profile = { goal, level, reminders, reminderTime };
        localStorage.setItem('userProfile', JSON.stringify(profile));
        if (reminders) {
            Notification.requestPermission().then(permission => {
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
                    <button className="btn btn-secondary" onClick={onComplete}>
                        Go to Dashboard
                    </button>
                    <button className="btn btn-primary" onClick={goToGoals}>
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
                                onClick={() => setGoal(g.label)}
                                className={`onboarding-btn${goal === g.label ? ' onboarding-selected' : ''}`}
                            >
                                {g.label}
                            </button>
                        ))}
                    </div>
                    <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between' }}>
                        <button className="btn btn-secondary" onClick={skip}>Skip</button>
                        <button className="btn btn-primary" disabled={!goal} onClick={() => setStep(1)}>Next →</button>
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
                                onClick={() => setLevel(l)}
                                className={`onboarding-btn onboarding-btn--level${level === l ? ' onboarding-selected' : ''}`}
                            >
                                {l === 'Beginner' && "🌱 Beginner — I'm just getting started"}
                                {l === 'Intermediate' && '⚡ Intermediate — I exercise a few times a week'}
                                {l === 'Advanced' && '🏆 Advanced — I train regularly and intensely'}
                            </button>
                        ))}
                    </div>
                    <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between' }}>
                        <button className="btn btn-secondary" onClick={() => setStep(0)}>← Back</button>
                        <button className="btn btn-primary" disabled={!level} onClick={() => setStep(2)}>Next →</button>
                    </div>
                </>
            )}

            {step === 2 && (
                <>
                    <h2>Stay on track 🔔</h2>
                    <p style={{ color: '#666', marginBottom: 24 }}>Want a daily nudge to keep you moving?</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                        <label style={{ fontWeight: 600 }}>Send me motivation reminders</label>
                        <input
                            type="checkbox"
                            checked={reminders}
                            onChange={e => setReminders(e.target.checked)}
                            style={{ width: 20, height: 20, cursor: 'pointer' }}
                        />
                    </div>
                    {reminders && (
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>Reminder time</label>
                            <input
                                type="time"
                                value={reminderTime}
                                onChange={e => setReminderTime(e.target.value)}
                                className="form-control"
                                style={{ width: 160 }}
                            />
                        </div>
                    )}
                    <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between' }}>
                        <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
                        <button className="btn btn-success" onClick={finish}>Finish 🎉</button>
                    </div>
                </>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
                {[0, 1, 2].map(i => (
                    <div key={i} style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: step === i ? '#1f72ff' : '#ddd'
                    }} />
                ))}
            </div>
        </div>
    );
};

export default Onboarding;
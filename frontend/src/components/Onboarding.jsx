import React, { useState } from 'react';

const goals = [
    { id: 'lose-weight', label: '🔥 Lose Weight', tip: 'Focus on cardio and a calorie deficit.' },
    { id: 'build-muscle', label: '💪 Build Muscle', tip: 'Prioritise strength training and protein intake.' },
    { id: 'improve-stamina', label: '🏃 Improve Stamina', tip: 'Mix running, cycling and interval training.' },
    { id: 'stay-active', label: '🧘 Stay Active', tip: 'Aim for 30 minutes of movement every day.' },
];

const levels = ['Beginner', 'Intermediate', 'Advanced'];

const Onboarding = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [goal, setGoal] = useState('');
    const [level, setLevel] = useState('');
    const [reminders, setReminders] = useState(false);
    const [reminderTime, setReminderTime] = useState('08:00');

    const finish = () => {
        const profile = { goal, level, reminders, reminderTime };
        localStorage.setItem('userProfile', JSON.stringify(profile));
        onComplete();
    };

    return (
        <div className="onboarding-container" style={{ maxWidth: 500, margin: 'auto', padding: 32 }}>

            {/* STEP 1 - Goal */}
            {step === 0 && (
                <>
                    <h2>What's your fitness goal?</h2>
                    <p style={{ color: '#666', marginBottom: 24 }}>We'll personalise your dashboard based on this.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        {goals.map(g => (
                            <button
                                key={g.id}
                                onClick={() => setGoal(g.label)}
                                style={{
                                    padding: '20px 12px',
                                    borderRadius: 12,
                                    border: goal === g.label ? '3px solid #1f72ff' : '2px solid #ddd',
                                    background: goal === g.label ? '#eef4ff' : '#fff',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: 15,
                                }}
                            >
                                {g.label}
                            </button>
                        ))}
                    </div>
                    <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between' }}>
                        <button className="btn btn-secondary" onClick={finish}>Skip</button>
                        <button className="btn btn-primary" disabled={!goal} onClick={() => setStep(1)}>Next →</button>
                    </div>
                </>
            )}

            {/* STEP 2 - Level */}
            {step === 1 && (
                <>
                    <h2>How active are you right now?</h2>
                    <p style={{ color: '#666', marginBottom: 24 }}>Be honest — we'll suggest the right intensity.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {levels.map(l => (
                            <button
                                key={l}
                                onClick={() => setLevel(l)}
                                style={{
                                    padding: '16px 20px',
                                    borderRadius: 12,
                                    border: level === l ? '3px solid #1f72ff' : '2px solid #ddd',
                                    background: level === l ? '#eef4ff' : '#fff',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: 15,
                                    textAlign: 'left',
                                }}
                            >
                                {l === 'Beginner' && '🌱 Beginner — I\'m just getting started'}
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

            {/* STEP 3 - Reminders */}
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

            {/* Progress dots */}
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
import React, { useState } from 'react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const EditModal = ({ activities, onClose, onAdd, onUpdate, onRemove }) => {
    const [activeKid, setActiveKid] = useState('Ryan');
    const [newActivity, setNewActivity] = useState('');
    const [newActivityDays, setNewActivityDays] = useState([0, 1, 2, 3, 4, 5, 6]); // All days by default

    const kidActivities = activities.filter(a => a.kid === activeKid);

    const handleDayToggle = (activity, dayIndex) => {
        let newDays;
        if (activity.days.includes(dayIndex)) {
            newDays = activity.days.filter(d => d !== dayIndex);
        } else {
            newDays = [...activity.days, dayIndex].sort();
        }
        onUpdate({ ...activity, days: newDays });
    };

    const handleNewDayToggle = (dayIndex) => {
        if (newActivityDays.includes(dayIndex)) {
            setNewActivityDays(prev => prev.filter(d => d !== dayIndex));
        } else {
            setNewActivityDays(prev => [...prev, dayIndex].sort());
        }
    };

    const onSubmitNew = () => {
        if (!newActivity.trim()) return;
        onAdd({
            kid: activeKid,
            name: newActivity,
            days: newActivityDays,
        });
        setNewActivity('');
        setNewActivityDays([0, 1, 2, 3, 4, 5, 6]);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
        }}>
            <div className="card" style={{
                width: '100%',
                maxWidth: '500px',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--bg-secondary)',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2>Edit Activities</h2>
                    <button onClick={onClose} style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>&times;</button>
                </div>

                {/* Tab Switcher */}
                <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                        style={{
                            flex: 1,
                            padding: '16px',
                            borderBottom: activeKid === 'Ryan' ? '2px solid var(--accent-ryan)' : 'none',
                            color: activeKid === 'Ryan' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: activeKid === 'Ryan' ? '600' : '400'
                        }}
                        onClick={() => setActiveKid('Ryan')}
                    >
                        Ryan
                    </button>
                    <button
                        style={{
                            flex: 1,
                            padding: '16px',
                            borderBottom: activeKid === 'Anya' ? '2px solid var(--accent-anya)' : 'none',
                            color: activeKid === 'Anya' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: activeKid === 'Anya' ? '600' : '400'
                        }}
                        onClick={() => setActiveKid('Anya')}
                    >
                        Anya
                    </button>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

                    {/* List existing */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {kidActivities.map(act => (
                            <div key={act.id} style={{
                                background: 'rgba(255,255,255,0.03)',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontWeight: '500' }}>{act.name}</span>
                                    <button
                                        onClick={() => onRemove(act.id)}
                                        style={{ color: 'var(--danger)', fontSize: '0.8rem' }}
                                    >
                                        Delete
                                    </button>
                                </div>

                                {/* Day selector for existing */}
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                    {DAYS.map((day, idx) => {
                                        const isSelected = act.days.includes(idx);
                                        return (
                                            <button
                                                key={day}
                                                onClick={() => handleDayToggle(act, idx)}
                                                style={{
                                                    fontSize: '0.7rem',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    background: isSelected ? (activeKid === 'Ryan' ? 'var(--accent-ryan)' : 'var(--accent-anya)') : 'rgba(255,255,255,0.1)',
                                                    color: isSelected ? '#fff' : 'var(--text-secondary)'
                                                }}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add New */}
                    <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <h4 style={{ marginBottom: '12px' }}>Add New Activity</h4>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                            <input
                                type="text"
                                value={newActivity}
                                onChange={(e) => setNewActivity(e.target.value)}
                                placeholder="E.g. Math homework"
                                style={{
                                    flex: 1,
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    color: 'white'
                                }}
                            />
                            <button
                                className="btn-primary"
                                onClick={onSubmitNew}
                                disabled={!newActivity.trim()}
                                style={{ opacity: !newActivity.trim() ? 0.5 : 1 }}
                            >
                                Add
                            </button>
                        </div>
                        {/* Day selector for new */}
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginRight: '8px', alignSelf: 'center' }}>Days:</span>
                            {DAYS.map((day, idx) => {
                                const isSelected = newActivityDays.includes(idx);
                                return (
                                    <button
                                        key={day}
                                        onClick={() => handleNewDayToggle(idx)}
                                        style={{
                                            fontSize: '0.7rem',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            background: isSelected ? (activeKid === 'Ryan' ? 'var(--accent-ryan)' : 'var(--accent-anya)') : 'rgba(255,255,255,0.1)',
                                            color: isSelected ? '#fff' : 'var(--text-secondary)'
                                        }}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditModal;

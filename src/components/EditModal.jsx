import React, { useState } from 'react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const EditModal = ({ activities, onClose, onAdd, onUpdate, onRemove }) => {
    const [activeKid, setActiveKid] = useState('Ryan');

    // New Activity State
    const [newActivity, setNewActivity] = useState('');
    const [newTime, setNewTime] = useState('');
    const [newActivityDays, setNewActivityDays] = useState([0, 1, 2, 3, 4, 5, 6]);

    // Editing State
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editTime, setEditTime] = useState('');

    const kidActivities = activities.filter(a => a.kid === activeKid);

    const startEditing = (act) => {
        setEditingId(act.id);
        setEditName(act.name);
        setEditTime(act.time || '');
    };

    const saveEdit = (act) => {
        if (editName.trim()) {
            onUpdate({ ...act, name: editName, time: editTime });
        }
        setEditingId(null);
        setEditName('');
        setEditTime('');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName('');
        setEditTime('');
    };

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
            time: newTime,
            days: newActivityDays,
        });
        setNewActivity('');
        setNewTime('');
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
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '8px' }}>
                                    {editingId === act.id ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '8px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <input
                                                    value={editName}
                                                    onChange={e => setEditName(e.target.value)}
                                                    placeholder="Activity Name"
                                                    style={{
                                                        flex: 1,
                                                        background: 'rgba(0,0,0,0.2)',
                                                        border: '1px solid var(--accent-ryan)',
                                                        borderRadius: '4px',
                                                        padding: '6px',
                                                        color: 'white',
                                                        fontSize: '0.9rem'
                                                    }}
                                                    autoFocus
                                                />
                                                <input
                                                    value={editTime}
                                                    onChange={e => setEditTime(e.target.value)}
                                                    placeholder="Time (e.g. 6pm)"
                                                    style={{
                                                        width: '100px',
                                                        background: 'rgba(0,0,0,0.2)',
                                                        border: '1px solid var(--accent-ryan)',
                                                        borderRadius: '4px',
                                                        padding: '6px',
                                                        color: 'white',
                                                        fontSize: '0.9rem'
                                                    }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button onClick={() => saveEdit(act)} style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 'bold' }}>Save</button>
                                                <button onClick={cancelEdit} style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: '500' }}>{act.name}</span>
                                                {act.time && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{act.time}</span>}
                                            </div>
                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                <button
                                                    onClick={() => startEditing(act)}
                                                    style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => onRemove(act.id)}
                                                    style={{ color: 'var(--danger)', fontSize: '0.8rem' }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Day selector for existing */}
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    value={newActivity}
                                    onChange={(e) => setNewActivity(e.target.value)}
                                    placeholder="Activity Name (e.g. Math)"
                                    style={{
                                        flex: 2,
                                        background: 'rgba(0,0,0,0.2)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        color: 'white'
                                    }}
                                />
                                <input
                                    type="text"
                                    value={newTime}
                                    onChange={(e) => setNewTime(e.target.value)}
                                    placeholder="Time"
                                    style={{
                                        flex: 1,
                                        background: 'rgba(0,0,0,0.2)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        color: 'white'
                                    }}
                                />
                            </div>
                            <button
                                className="btn-primary"
                                onClick={onSubmitNew}
                                disabled={!newActivity.trim()}
                                style={{ opacity: !newActivity.trim() ? 0.5 : 1, width: '100%' }}
                            >
                                Add Activity
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

import React from 'react';
import { startOfToday, format } from 'date-fns';

const ActivityItem = ({ activity, dateStr, onToggle, color }) => {
    const isCompleted = activity.history && activity.history[dateStr] === true;

    return (
        <div
            className="activity-item"
            onClick={onToggle}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: isCompleted ? `color-mix(in srgb, ${color}, transparent 90%)` : 'var(--bg-secondary)',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid',
                borderColor: isCompleted ? color : 'transparent'
            }}
        >
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {activity.time && (
                    <span style={{
                        fontSize: '0.8rem',
                        color: isCompleted ? 'var(--text-secondary)' : color,
                        fontWeight: '600',
                        marginBottom: '2px'
                    }}>
                        {activity.time}
                    </span>
                )}
                <span style={{
                    textDecoration: isCompleted ? 'line-through' : 'none',
                    color: isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)',
                    fontWeight: isCompleted ? '400' : '500'
                }}>
                    {activity.name}
                </span>
            </div>
            <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '8px',
                border: `2px solid ${isCompleted ? color : 'var(--text-secondary)'}`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: isCompleted ? color : 'transparent'
            }}>
                {isCompleted && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                )}
            </div>
        </div>
    );
};

export default ActivityItem;

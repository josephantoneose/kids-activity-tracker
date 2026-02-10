import React, { useMemo } from 'react';
import { startOfToday, format } from 'date-fns';
import ActivityItem from './ActivityItem';

const KidSection = ({ name, color, activities, onToggle, selectedDate }) => {
    const dayOfWeek = selectedDate.getDay();
    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    // Filter activities for this day
    const dailyActivities = activities.filter(act => act.days.includes(dayOfWeek));

    return (
        <div className="kid-section" style={{
            paddingLeft: '4px',
            paddingRight: '4px'
        }}>
            <div className="activity-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {dailyActivities.length === 0 ? (
                    <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', padding: '20px', textAlign: 'center' }}>
                        No activities scheduled for this day.
                    </div>
                ) : (
                    dailyActivities.map(act => (
                        <ActivityItem
                            key={act.id}
                            activity={act}
                            dateStr={dateStr}
                            onToggle={() => onToggle(act.id, dateStr)}
                            color={color}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default KidSection;

import React, { useRef, useEffect } from 'react';
import { format, subDays, isSameDay, startOfToday } from 'date-fns';

const DateSelector = ({ selectedDate, onSelectDate }) => {
    const scrollRef = useRef(null);
    const today = startOfToday();

    // Generate last 7 days
    const days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));

    useEffect(() => {
        // Scroll to end (today) on mount
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, []);

    return (
        <div
            ref={scrollRef}
            style={{
                display: 'flex',
                gap: '12px',
                overflowX: 'auto',
                padding: '10px 0',
                marginBottom: '10px',
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE/Edge
            }}
            className="date-selector"
        >
            <style>
                {`
          .date-selector::-webkit-scrollbar {
            display: none;
          }
        `}
            </style>
            {days.map((date) => {
                const isSelected = isSameDay(date, selectedDate);
                const isToday = isSameDay(date, today);

                return (
                    <button
                        key={date.toString()}
                        onClick={() => onSelectDate(date)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minWidth: '60px',
                            padding: '12px 8px',
                            borderRadius: '16px',
                            background: isSelected ? 'var(--text-primary)' : 'var(--bg-secondary)',
                            color: isSelected ? 'var(--bg-primary)' : 'var(--text-secondary)',
                            border: '1px solid',
                            borderColor: isSelected ? 'transparent' : (isToday ? 'var(--accent-ryan)' : 'transparent'),
                            transition: 'all 0.2s ease',
                            flexShrink: 0
                        }}
                    >
                        <span style={{ fontSize: '0.8rem', fontWeight: '500', opacity: 0.8 }}>
                            {format(date, 'EEE')}
                        </span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                            {format(date, 'd')}
                        </span>
                        {isToday && !isSelected && (
                            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-ryan)', marginTop: '4px' }}></div>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default DateSelector;

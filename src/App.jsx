import React, { useState, useEffect, useMemo } from 'react';
import './index.css';
import EditModal from './components/EditModal';
import KidSection from './components/KidSection';
import DateSelector from './components/DateSelector';
import { calculateAdherence } from './utils';
import { startOfToday } from 'date-fns';

// Initial dummy data
const DEFAULT_ACTIVITIES = [
  { id: '1', kid: 'Ryan', name: 'Study (30 mins)', days: [0, 1, 2, 3, 4, 5, 6], history: {} },
  { id: '2', kid: 'Ryan', name: 'Music - Breathing', days: [0, 1, 2, 3, 4, 5, 6], history: {} },
  { id: '3', kid: 'Ryan', name: 'Music - Practice', days: [0, 1, 2, 3, 4, 5, 6], history: {} },
  { id: '4', kid: 'Anya', name: 'Study (30 mins)', days: [0, 1, 2, 3, 4, 5, 6], history: {} },
  { id: '5', kid: 'Anya', name: 'Reading', days: [0, 1, 2, 3, 4, 5, 6], history: {} },
  { id: '6', kid: 'Anya', name: 'Piano Practice', days: [0, 1, 2, 3, 4, 5, 6], history: {} },
];

function App() {
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('activities');
    return saved ? JSON.parse(saved) : DEFAULT_ACTIVITIES;
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('Ryan');
  const [selectedDate, setSelectedDate] = useState(startOfToday());

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  const toggleActivity = (id, dateStr) => {
    setActivities(prev => prev.map(act => {
      if (act.id === id) {
        const newHistory = { ...act.history };
        const currentStatus = newHistory[dateStr] || false;
        newHistory[dateStr] = !currentStatus;
        return { ...act, history: newHistory };
      }
      return act;
    }));
  };

  const addActivity = (newActivity) => {
    setActivities(prev => [...prev, { ...newActivity, id: Date.now().toString(), history: {} }]);
  };

  const updateActivity = (updatedActivity) => {
    setActivities(prev => prev.map(act => act.id === updatedActivity.id ? updatedActivity : act));
  };

  const removeActivity = (id) => {
    setActivities(prev => prev.filter(act => act.id !== id));
  };

  const ryanActivities = useMemo(() => activities.filter(a => a.kid === 'Ryan'), [activities]);
  const anyaActivities = useMemo(() => activities.filter(a => a.kid === 'Anya'), [activities]);

  const ryanAdherence = useMemo(() => calculateAdherence(ryanActivities), [ryanActivities]);
  const anyaAdherence = useMemo(() => calculateAdherence(anyaActivities), [anyaActivities]);

  return (
    <div className="app-container" style={{ padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Kids Tracker</h1>
        <button
          onClick={() => setIsEditMode(true)}
          className="btn-primary"
          style={{ fontSize: '0.9rem' }}
        >
          Edit Activities
        </button>
      </header>

      <DateSelector selectedDate={selectedDate} onSelectDate={setSelectedDate} />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <button
          onClick={() => setActiveTab('Ryan')}
          style={{
            flex: 1,
            padding: '16px',
            borderRadius: '12px',
            background: activeTab === 'Ryan' ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(56, 189, 248, 0.1))' : 'var(--bg-secondary)',
            border: activeTab === 'Ryan' ? '2px solid var(--accent-ryan)' : '2px solid transparent',
            color: activeTab === 'Ryan' ? 'var(--accent-ryan)' : 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Ryan</span>
          <span style={{ fontSize: '0.9rem', marginTop: '4px' }}>{ryanAdherence}% Adherence</span>
        </button>
        <button
          onClick={() => setActiveTab('Anya')}
          style={{
            flex: 1,
            padding: '16px',
            borderRadius: '12px',
            background: activeTab === 'Anya' ? 'linear-gradient(135deg, rgba(244, 114, 182, 0.2), rgba(244, 114, 182, 0.1))' : 'var(--bg-secondary)',
            border: activeTab === 'Anya' ? '2px solid var(--accent-anya)' : '2px solid transparent',
            color: activeTab === 'Anya' ? 'var(--accent-anya)' : 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Anya</span>
          <span style={{ fontSize: '0.9rem', marginTop: '4px' }}>{anyaAdherence}% Adherence</span>
        </button>
      </div>

      <div style={{ flex: 1 }}>
        {activeTab === 'Ryan' ? (
          <KidSection
            name="Ryan"
            color="var(--accent-ryan)"
            activities={ryanActivities}
            onToggle={toggleActivity}
            selectedDate={selectedDate}
          />
        ) : (
          <KidSection
            name="Anya"
            color="var(--accent-anya)"
            activities={anyaActivities}
            onToggle={toggleActivity}
            selectedDate={selectedDate}
          />
        )}
      </div>

      {isEditMode && (
        <EditModal
          activities={activities}
          onClose={() => setIsEditMode(false)}
          onAdd={addActivity}
          onUpdate={updateActivity}
          onRemove={removeActivity}
        />
      )}
    </div>
  );
}

export default App;

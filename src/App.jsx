import React, { useState, useEffect, useMemo } from 'react';
import './index.css';
import EditModal from './components/EditModal';
import KidSection from './components/KidSection';
import DateSelector from './components/DateSelector';
import { calculateAdherence } from './utils';
import { startOfToday } from 'date-fns';
import { db } from './firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
  query
} from 'firebase/firestore';

// Initial dummy data as fallback
const DEFAULT_ACTIVITIES = [
  { kid: 'Ryan', name: 'Study (30 mins)', days: [0, 1, 2, 3, 4, 5, 6], history: {} },
  { kid: 'Ryan', name: 'Music - Breathing', days: [0, 1, 2, 3, 4, 5, 6], history: {} },
  { kid: 'Ryan', name: 'Music - Practice', days: [0, 1, 2, 3, 4, 5, 6], history: {} },
  { kid: 'Anya', name: 'Study (30 mins)', days: [0, 1, 2, 3, 4, 5, 6], history: {} },
  { kid: 'Anya', name: 'Reading', days: [0, 1, 2, 3, 4, 5, 6], history: {} },
  { kid: 'Anya', name: 'Piano Practice', days: [0, 1, 2, 3, 4, 5, 6], history: {} },
];

function App() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('Ryan');
  const [selectedDate, setSelectedDate] = useState(startOfToday());

  // Subscribe to changes
  useEffect(() => {
    const q = query(collection(db, 'activities'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      // Initial Seed if Empty
      if (data.length === 0 && !snapshot.metadata.fromCache) {
        // Double check loading state to prevent redundant writes
        // If empty, let's write defaults
        console.log("Seeding default data...");
        const batch = writeBatch(db);
        DEFAULT_ACTIVITIES.forEach(act => {
          const newRef = doc(collection(db, 'activities'));
          batch.set(newRef, act);
        });
        await batch.commit();
        // The listener will fire again with the new data
      } else {
        setActivities(data);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleActivity = async (id, dateStr) => {
    const activity = activities.find(a => a.id === id);
    if (!activity) return;

    // We can infer the new status based on current local state for immediate feedback
    // But for the DB update, we just toggle what we see.
    // Ideally we use Firestore transactions for atomic toggles, but simple reading is OK here.
    const currentStatus = activity.history?.[dateStr] || false;
    const newStatus = !currentStatus;

    try {
      await updateDoc(doc(db, 'activities', id), {
        [`history.${dateStr}`]: newStatus
      });
    } catch (e) {
      console.error("Error toggling activity: ", e);
    }
  };

  const addActivity = async (newActivity) => {
    try {
      await addDoc(collection(db, 'activities'), {
        ...newActivity,
        history: {}
      });
    } catch (e) {
      console.error("Error adding activity: ", e);
    }
  };

  const updateActivity = async (updatedActivity) => {
    try {
      // Destructure to separate id from data
      const { id, ...data } = updatedActivity;
      await updateDoc(doc(db, 'activities', id), data);
    } catch (e) {
      console.error("Error updating activity: ", e);
    }
  };

  const removeActivity = async (id) => {
    try {
      await deleteDoc(doc(db, 'activities', id));
    } catch (e) {
      console.error("Error removing activity: ", e);
    }
  };

  const ryanActivities = useMemo(() => activities.filter(a => a.kid === 'Ryan'), [activities]);
  const anyaActivities = useMemo(() => activities.filter(a => a.kid === 'Anya'), [activities]);

  const ryanAdherence = useMemo(() => calculateAdherence(ryanActivities), [ryanActivities]);
  const anyaAdherence = useMemo(() => calculateAdherence(anyaActivities), [anyaActivities]);

  if (loading && activities.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)', color: 'white' }}>
        Loading...
      </div>
    );
  }

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
      <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.7rem', paddingBottom: '10px' }}>
        v1.2 - Time Support Added
      </div>
    </div>
  );
}

export default App;

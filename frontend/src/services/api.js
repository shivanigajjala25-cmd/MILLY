const BASE_URL = '/api';

export const api = {
  // Chat
  sendMessage: async (message, sessionId = 'default-session', allowWellnessContext = true) => {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId, allowWellnessContext })
    });
    if (!res.ok) throw new Error('Failed to get chat response');
    return res.json();
  },

  getModelMetrics: async () => {
    const res = await fetch(`${BASE_URL}/chat/metrics`);
    if (!res.ok) throw new Error('Failed to fetch model metrics');
    return res.json();
  },

  getKnowledgeBase: async () => {
    const res = await fetch(`${BASE_URL}/knowledge`);
    if (!res.ok) throw new Error('Failed to fetch knowledge base');
    return res.json();
  },

  // Checkins
  createCheckin: async (data) => {
    const res = await fetch(`${BASE_URL}/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to submit check-in');
    return res.json();
  },

  getCheckins: async () => {
    const res = await fetch(`${BASE_URL}/checkins`);
    if (!res.ok) throw new Error('Failed to fetch check-ins');
    return res.json();
  },

  // Dashboard
  getDashboard: async () => {
    const res = await fetch(`${BASE_URL}/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard data');
    return res.json();
  },

  // Coping Sessions
  recordGrounding: async (exerciseType, durationSeconds) => {
    const res = await fetch(`${BASE_URL}/grounding/completed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exerciseType, durationSeconds })
    });
    if (!res.ok) throw new Error('Failed to record grounding');
    return res.json();
  },

  getGroundingStats: async () => {
    const res = await fetch(`${BASE_URL}/grounding/stats`);
    if (!res.ok) throw new Error('Failed to fetch grounding stats');
    return res.json();
  },

  // Journal (STRICTLY PRIVATE - Never passed to Chat/AI)
  verifyJournalPin: async (pin) => {
    const res = await fetch(`${BASE_URL}/journal/verify-pin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    });
    return res.json();
  },

  setJournalPin: async (pin) => {
    const res = await fetch(`${BASE_URL}/journal/set-pin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    });
    return res.json();
  },

  getJournalEntries: async () => {
    const res = await fetch(`${BASE_URL}/journal`);
    if (!res.ok) throw new Error('Failed to fetch journal entries');
    return res.json();
  },

  createJournalEntry: async (entry) => {
    const res = await fetch(`${BASE_URL}/journal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    if (!res.ok) throw new Error('Failed to save journal entry');
    return res.json();
  },

  updateJournalEntry: async (id, entry) => {
    const res = await fetch(`${BASE_URL}/journal/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    if (!res.ok) throw new Error('Failed to update journal entry');
    return res.json();
  },

  deleteJournalEntry: async (id) => {
    const res = await fetch(`${BASE_URL}/journal/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete journal entry');
    return res.json();
  }
};

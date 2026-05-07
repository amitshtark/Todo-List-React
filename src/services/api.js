// Mock data helpers — replace with real API calls once backend is wired

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

// Projects API
export const projectsApi = {
  async getAll(userId) {
    await delay();
    const stored = localStorage.getItem(`projects_${userId}`);
    return stored ? JSON.parse(stored) : [];
  },

  async create(userId, data) {
    await delay();
    const project = {
      id: generateId(),
      ...data,
      ownerId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      memberCount: 1,
    };
    const all = await projectsApi.getAll(userId);
    const updated = [project, ...all];
    localStorage.setItem(`projects_${userId}`, JSON.stringify(updated));
    return project;
  },

  async update(userId, id, data) {
    await delay();
    const all = await projectsApi.getAll(userId);
    const updated = all.map(p => p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p);
    localStorage.setItem(`projects_${userId}`, JSON.stringify(updated));
    return updated.find(p => p.id === id);
  },

  async delete(userId, id) {
    await delay();
    const all = await projectsApi.getAll(userId);
    const updated = all.filter(p => p.id !== id);
    localStorage.setItem(`projects_${userId}`, JSON.stringify(updated));
  },
};

// Tasks API
export const tasksApi = {
  async getAll(projectId) {
    await delay();
    const stored = localStorage.getItem(`tasks_${projectId}`);
    return stored ? JSON.parse(stored) : [];
  },

  async create(projectId, data) {
    await delay();
    const task = {
      id: generateId(),
      ...data,
      projectId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    };
    const all = await tasksApi.getAll(projectId);
    const updated = [task, ...all];
    localStorage.setItem(`tasks_${projectId}`, JSON.stringify(updated));
    return task;
  },

  async update(projectId, id, data) {
    await delay();
    const all = await tasksApi.getAll(projectId);
    const updated = all.map(t => t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t);
    localStorage.setItem(`tasks_${projectId}`, JSON.stringify(updated));
    return updated.find(t => t.id === id);
  },

  async delete(projectId, id) {
    await delay();
    const all = await tasksApi.getAll(projectId);
    const updated = all.filter(t => t.id !== id);
    localStorage.setItem(`tasks_${projectId}`, JSON.stringify(updated));
  },

  async addComment(projectId, taskId, comment) {
    await delay();
    const all = await tasksApi.getAll(projectId);
    const updated = all.map(t => {
      if (t.id === taskId) {
        return { ...t, comments: [...(t.comments || []), { id: generateId(), ...comment, createdAt: new Date().toISOString() }] };
      }
      return t;
    });
    localStorage.setItem(`tasks_${projectId}`, JSON.stringify(updated));
    return updated.find(t => t.id === taskId);
  },
};

// User profile API
export const profileApi = {
  async get(userId) {
    await delay(100);
    const stored = localStorage.getItem(`profile_${userId}`);
    return stored ? JSON.parse(stored) : null;
  },

  async update(userId, data) {
    await delay();
    const existing = await profileApi.get(userId) || {};
    const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
    localStorage.setItem(`profile_${userId}`, JSON.stringify(updated));
    return updated;
  },
};

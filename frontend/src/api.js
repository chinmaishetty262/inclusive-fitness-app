import axiosInstance from './components/axiosInstance';

function getUrl() {
    if (process.env.CODESPACES === "true") {
        return `https://${process.env.CODESPACE_NAME}-5300.app.github.dev`;
    } else {
        return `http://localhost:5300`;
    }
}

const baseURL = getUrl();

const api = axiosInstance.create({
    baseURL
});

export const trackExercise = payload => api.post(`/exercises/add`, payload);
export const getGoals = username => api.get(`/goals/${username}`);
export const addGoal = newGoal => api.post('/goals/add', newGoal);
export const updateGoal = (id, updatedGoal) => api.put(`/goals/update/${id}`, updatedGoal);
export const deleteGoal = id => api.delete(`/goals/${id}`);

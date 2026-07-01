import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { taskAPI } from '../services/api';

const initialFilters = {
  status: '',
  priority: '',
  category: '',
  due: '',
  search: '',
  sort: 'newest',
};

export const useTasks = (defaults = {}) => {
  const [tasks, setTasks] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ ...initialFilters, ...defaults });

  const query = useMemo(() => filters, [filters]);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getAll(query);
      setTasks(response.data);
      setMeta({
        total: response.total,
        page: response.page,
        pages: response.pages,
      });
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const refresh = () => fetchTasks();
    window.addEventListener('tasks:changed', refresh);
    return () => window.removeEventListener('tasks:changed', refresh);
  }, [fetchTasks]);

  const createTask = async (data) => {
    setIsMutating(true);
    try {
      const response = await taskAPI.create(data);
      setTasks((prev) => [response.data, ...prev]);
      toast.success('Task created');
      window.dispatchEvent(new Event('tasks:changed'));
      return response.data;
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  const updateTask = async (id, data) => {
    setIsMutating(true);
    try {
      const response = await taskAPI.update(id, data);
      setTasks((prev) => prev.map((task) => (task._id === id ? response.data : task)));
      toast.success('Task updated');
      window.dispatchEvent(new Event('tasks:changed'));
      return response.data;
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  const deleteTask = async (id) => {
    setIsMutating(true);
    try {
      await taskAPI.delete(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      toast.success('Task deleted');
      window.dispatchEvent(new Event('tasks:changed'));
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  const toggleComplete = async (id, completed) => {
    return updateTask(id, {
      completed: !completed,
      status: !completed ? 'Completed' : 'Pending',
    });
  };

  const clearFilters = () => setFilters(initialFilters);

  return {
    tasks,
    meta,
    loading,
    isMutating,
    error,
    filters,
    setFilters,
    clearFilters,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
  };
};

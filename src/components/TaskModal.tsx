import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority, Member } from '../types';
import { MEMBERS } from '../data';
import { X, Calendar, User, Tag, ToggleLeft, Sparkles, Trash2, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface TaskModalProps {
  task?: Task | null; // If null/undefined, we are in CREATE mode. Else EDIT mode.
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt'> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  initialStatus?: TaskStatus;
}

const CATEGORIES = ['Security', 'Design', 'Backend', 'Integrations', 'QA', 'Infrastructure', 'Marketing'];

const TAG_PRESETS = ['Firestore', 'RBAC', 'Figma', 'Colors', 'WebSockets', 'Go', 'OAuth', 'E2E', 'Cypress', 'Docker', 'Vite'];

export default function TaskModal({ task, onClose, onSave, onDelete, initialStatus = 'todo' }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState('Design');
  const [dueDate, setDueDate] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');

  // Prepopulate form if editing
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
      setCategory(task.category);
      setDueDate(task.dueDate);
      setAssigneeId(task.assigneeId);
      setTags(task.tags);
    } else {
      setTitle('');
      setDescription('');
      setStatus(initialStatus);
      setPriority('medium');
      setCategory(CATEGORIES[0]);
      setDueDate(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]); // Default 3 days out
      setAssigneeId(MEMBERS[0].id);
      setTags([]);
    }
  }, [task, initialStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: task?.id,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      category,
      dueDate,
      assigneeId,
      tags
    });
  };

  const addTag = (tagStr: string) => {
    const cleanTag = tagStr.trim().replace(/[^a-zA-Z0-9_\-]/g, '');
    if (cleanTag && !tags.includes(cleanTag) && tags.length < 5) {
      setTags([...tags, cleanTag]);
    }
    setNewTagInput('');
  };

  const handleKeyDownTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(newTagInput);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-950/20"
      >
        {/* Modal Header */}
        <div className="relative border-b border-slate-800/80 px-6 py-4 bg-slate-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <h2 className="text-sm sm:text-base font-bold text-zinc-100 tracking-wider font-mono">
              {task ? 'EDIT TASK INSTANCE' : 'SPAWN NEURAL TASK'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-1.5 rounded-lg border border-slate-800 hover:border-slate-750 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-mono">
          
          {/* Title input */}
          <div className="space-y-1.5">
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest">
              Task Descriptor Label *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Optimize Redis payload caches"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-slate-650 focus:outline-none focus:border-cyan-500/80 transition-all font-sans text-xs"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest">
              Action Scope / Guidelines
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline specific objectives and edge cases to consider during development..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-slate-650 focus:outline-none focus:border-cyan-500/80 transition-all font-sans text-xs resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {/* Status Selector */}
            <div className="space-y-1.5">
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest">
                Segment Column
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-cyan-500/80 cursor-pointer text-xs"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Priority Selector */}
            <div className="space-y-1.5">
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest">
                Execution Severity
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-cyan-500/80 cursor-pointer text-xs"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {/* Assignee Selection */}
            <div className="space-y-1.5">
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <User className="w-3 h-3 text-slate-500" />
                <span>Node Assignee</span>
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-cyan-500/80 cursor-pointer text-xs"
              >
                {MEMBERS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* Category selection */}
            <div className="space-y-1.5">
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest">
                Cluster Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-cyan-500/80 cursor-pointer text-xs"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {/* Due Date */}
            <div className="space-y-1.5">
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                <span>Target Epoch Date</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-cyan-500/80 cursor-pointer text-xs"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="block text-[10px] text-slate-400 font-mono uppercase tracking-widest flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-500" />
              <span>Diagnostic Tags (Max 5)</span>
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-950 border border-slate-850 rounded-xl min-h-[40px] items-center">
              {tags.map(t => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/50 text-cyan-400 border border-cyan-800/20"
                >
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    className="hover:text-red-400 select-none text-[8px] font-bold cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
              {tags.length < 5 && (
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={handleKeyDownTag}
                  placeholder="+ New tag (press enter)"
                  className="bg-transparent border-none text-zinc-250 placeholder-slate-600 focus:outline-none text-[10px] ml-1.5 flex-1 min-w-[120px]"
                />
              )}
            </div>

            {/* Preset Tags Suggestion */}
            {tagSuggestions().length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1 pb-1">
                <span className="text-[9px] text-slate-600 mt-0.5 select-none font-mono">Suggestions:</span>
                {tagSuggestions().map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => addTag(preset)}
                    className="px-1.5 py-0.5 text-[9px] font-mono text-slate-500 hover:text-cyan-450 hover:bg-slate-950 border border-transparent hover:border-cyan-800/30 rounded cursor-pointer transition-all"
                  >
                    +{preset}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 mt-6">
            <div>
              {task && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you wire-certain you want to purge this task vector from database?')) {
                      onDelete(task.id);
                    }
                  }}
                  className="flex items-center gap-1.5 text-rose-500 hover:text-rose-400 hover:bg-rose-950/20 font-mono text-[10px] px-3 py-2 rounded-xl border border-transparent hover:border-rose-900/40 cursor-pointer transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5 animate-pulse" />
                  <span>DESTRUCT VEC</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-[10px] text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 rounded-xl transition-all font-mono hover:bg-slate-900 cursor-pointer"
              >
                ABORT
              </button>
              
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold rounded-xl transition-all hover:from-cyan-400 hover:to-teal-400 shadow-md shadow-cyan-950/20 hover:shadow-cyan-400/20 cursor-pointer flex items-center gap-1 tracking-wider text-[10px]"
              >
                <CheckCircle className="w-3.5 h-3.5 text-slate-950" />
                <span>{task ? 'COMMIT SYNC' : 'ALLOCATE LINK'}</span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );

  function tagSuggestions() {
    return TAG_PRESETS.filter(t => !tags.includes(t)).slice(0, 5);
  }
}

import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority, Member, ActivityLog } from '../types';
import { MEMBERS } from '../data';
import { 
  Plus, Search, Filter, Calendar, Tag, AlertTriangle, ArrowRight, 
  CheckCircle, Clock, CheckSquare, Edit, Trash, LayoutGrid, ListFilter,
  CheckCircle2, ArrowLeftRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DesktopDashboardProps {
  tasks: Task[];
  loggedInMember: Member | null;
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onMoveTask: (id: string, newStatus: TaskStatus) => void;
  onDeleteTask: (id: string) => void;
}

const COLUMNS: { id: TaskStatus; label: string; bg: string; text: string; glow: string }[] = [
  { id: 'todo', label: 'BACKLOG', bg: 'bg-slate-900/40', text: 'text-zinc-450 border-slate-850', glow: 'shadow-cyan-950/5' },
  { id: 'in-progress', label: 'IN DEVELOPMENT', bg: 'bg-slate-900/40', text: 'text-cyan-400 border-cyan-950/20', glow: 'shadow-cyan-500/5' },
  { id: 'review', label: 'CODE REVIEW', bg: 'bg-slate-900/40', text: 'text-purple-400 border-purple-950/20', glow: 'shadow-purple-500/5' },
  { id: 'done', label: 'PROD DEPLOYED', bg: 'bg-slate-900/40', text: 'text-emerald-450 border-emerald-950/20', glow: 'shadow-emerald-500/5' }
];

export default function DesktopDashboard({
  tasks,
  loggedInMember,
  onAddTask,
  onEditTask,
  onMoveTask,
  onDeleteTask
}: DesktopDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Statistics
  const urgentCount = tasks.filter(t => t.priority === 'urgent' && t.status !== 'done').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const doneRatio = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  // Filter Tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
    const matchesPriority = selectedPriority === 'All' || task.priority === selectedPriority;

    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Task Categories for filter dropdown
  const categories = ['All', ...Array.from(new Set(tasks.map(t => t.category)))];

  // Drag and Drop
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      onMoveTask(taskId, status);
    }
    setDraggedTaskId(null);
  };

  const getPriorityBadgeColor = (p: TaskPriority) => {
    switch (p) {
      case 'urgent': return 'bg-rose-950/50 text-rose-400 border-rose-800/40 text-glow-red';
      case 'high': return 'bg-amber-950/50 text-amber-400 border-amber-800/40';
      case 'medium': return 'bg-cyan-950/50 text-cyan-400 border-cyan-850/40';
      case 'low': return 'bg-slate-950 text-slate-400 border-slate-850';
    }
  };

  const getAssigneeAvatar = (assigneeId: string) => {
    const member = MEMBERS.find(m => m.id === assigneeId);
    return member?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120';
  };

  const getAssigneeName = (assigneeId: string) => {
    const member = MEMBERS.find(m => m.id === assigneeId);
    return member?.name || 'Aether Engineer';
  };

  return (
    <div className="flex flex-col h-full bg-[#090C15] text-zinc-100 p-6 overflow-y-auto">
      
      {/* Upper Dashboard Metrics Header */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {/* Total Tasks Node */}
        <div className="bg-slate-900/40 border border-slate-905 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-500 uppercase">Task Vectors</div>
            <div className="text-2xl font-bold font-mono text-zinc-100">{tasks.length}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-950/80 border border-slate-850 flex items-center justify-center text-cyan-400">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        {/* Development Speed Node */}
        <div className="bg-slate-900/40 border border-slate-905 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-500 uppercase">Active R&D</div>
            <div className="text-2xl font-bold font-mono text-cyan-450">{inProgressCount}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-950/80 border border-slate-850 flex items-center justify-center text-cyan-450">
            <Clock className="w-5 h-5 animate-spin-slow" />
          </div>
        </div>

        {/* Sync Rate Node */}
        <div className="bg-slate-900/40 border border-slate-905 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-500 uppercase">Synchronized Rate</div>
            <div className="text-2xl font-bold font-mono text-emerald-450">{doneRatio}%</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-950/80 border border-slate-850 flex items-center justify-center text-emerald-450">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Alerts / Blockers Node */}
        <div className="bg-slate-900/40 border border-slate-905 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-500 uppercase">Urgent Lockers</div>
            <div className="text-2xl font-bold font-mono text-rose-500">{urgentCount}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-950/80 border border-slate-850 flex items-center justify-center text-rose-500">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Interactive Filter & Search Block */}
      <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-3.5 items-center justify-between font-mono text-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-505" />
          <input
            type="text"
            placeholder="Search task vectors, tags, labels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-850 rounded-lg py-2 pl-9 pr-3 text-zinc-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500/80 font-sans text-xs transition-all"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap gap-2.5 w-full md:w-auto md:justify-end">
          {/* Category SELECT */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/40 border border-slate-850 text-slate-400">
            <Filter className="w-3.5 h-3.5 text-slate-550" />
            <span className="text-[10px] uppercase">Cluster:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-zinc-300 focus:outline-none cursor-pointer text-xs"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Priority SELECT */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/40 border border-slate-850 text-slate-400">
            <ListFilter className="w-3.5 h-3.5 text-slate-550" />
            <span className="text-[10px] uppercase">Severity:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-transparent text-zinc-300 focus:outline-none cursor-pointer text-xs"
            >
              <option value="All">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Stage Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 items-start h-[525px] overflow-y-auto pr-1">
        {COLUMNS.map((column) => {
          const columnTasks = filteredTasks.filter(t => t.status === column.id);

          return (
            <div
              key={column.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`flex flex-col h-full rounded-2xl p-3 border border-slate-870/40 min-h-[400px] lg:min-h-0 ${column.bg}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-1.5 pb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    column.id === 'todo' ? 'bg-zinc-400' :
                    column.id === 'in-progress' ? 'bg-cyan-400 shadow-md shadow-cyan-400/50' :
                    column.id === 'review' ? 'bg-purple-400 shadow-md shadow-purple-400/50' :
                    'bg-emerald-400 shadow-md shadow-emerald-400/50'
                  }`} />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                    {column.label}
                  </span>
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-slate-950/80 text-slate-500 border border-slate-900">
                    {columnTasks.length}
                  </span>
                </div>
                
                {/* Spawn Button */}
                <button
                  onClick={() => onAddTask(column.id)}
                  className="p-1 rounded-md text-slate-500 hover:text-cyan-400 transition-colors bg-slate-950/20 border border-transparent hover:border-slate-800 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Column Tasks Container */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[460px] pb-4">
                <AnimatePresence>
                  {columnTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      layoutId={`item-${task.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`group relative bg-[#0C101B]/80 hover:bg-[#121828]/90 border border-slate-850 hover:border-slate-800 rounded-xl p-3.5 shadow-md ${column.glow} transition-all cursor-grab active:cursor-grabbing`}
                    >
                      {/* Priority Tag & Category */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[8px] font-mono px-2 py-0.5 rounded border border-slate-800 text-slate-500 uppercase tracking-widest bg-slate-950/50">
                          {task.category}
                        </span>
                        
                        <span className={`text-[8px] font-mono px-1.5 py-0.5 border rounded uppercase tracking-wider ${getPriorityBadgeColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>

                      {/* Header Title */}
                      <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-cyan-350 transition-colors tracking-wide leading-snug">
                        {task.title}
                      </h4>

                      {/* Description scope */}
                      <p className="text-[10px] text-slate-500 mt-1 lines-clamp bg-transparent select-none leading-relaxed">
                        {task.description}
                      </p>

                      {/* Sub-bar tags */}
                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {task.tags.map(t => (
                            <span key={t} className="px-1.5 py-0.5 text-[8.5px] font-mono text-cyan-450 bg-slate-955/60 border border-slate-880 rounded-sm">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Divider */}
                      <div className="border-t border-slate-900/60 my-3" />

                      {/* Footer Actions / Assignee */}
                      <div className="flex items-center justify-between">
                        {/* Assignee */}
                        <div className="flex items-center gap-2">
                          <img
                            src={getAssigneeAvatar(task.assigneeId)}
                            className="w-5 h-5 rounded-full border border-slate-800 object-cover"
                            title={getAssigneeName(task.assigneeId)}
                            alt={getAssigneeName(task.assigneeId)}
                          />
                          <span className="text-[9px] font-mono text-slate-550 truncate max-w-[80px]">
                            {getAssigneeName(task.assigneeId).split(' ')[0]}
                          </span>
                        </div>

                        {/* Calendar target date */}
                        <div className="flex items-center gap-1 text-[8.5px] font-mono text-slate-550 border border-transparent group-hover:border-slate-900/10 rounded-md px-1.5 py-0.5">
                          <Calendar className="w-2.5 h-2.5" />
                          <span>{task.dueDate.split('-')[1]}/{task.dueDate.split('-')[2]}</span>
                        </div>

                        {/* Fast column shift + Manual Edit tool */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEditTask(task)}
                            className="p-1 rounded bg-slate-950 text-slate-400 hover:text-cyan-400 border border-slate-850 cursor-pointer"
                            title="Edit task parameters"
                          >
                            <Edit className="w-2.5 h-2.5" />
                          </button>
                          
                          {/* Destruct vector directly */}
                          <button
                            onClick={() => {
                              if (confirm('Delete this task vector from Kanban column?')) {
                                onDeleteTask(task.id);
                              }
                            }}
                            className="p-1 rounded bg-slate-950 text-slate-400 hover:text-rose-400 border border-slate-855 cursor-pointer"
                            title="Purge task vector"
                          >
                            <Trash className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>

                      {/* Bottom Fast Action Shifts for visual ease */}
                      <div className="flex justify-end gap-1 mt-2.5 pt-2 border-t border-slate-950 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[7.5px] font-mono text-slate-600 mt-1 uppercase mr-auto flex items-center gap-1">
                          <ArrowLeftRight className="w-2.5 h-2.5" />
                          <span>Status SHIFT</span>
                        </span>
                        {COLUMNS.map(col => {
                          if (col.id === task.status) return null;
                          return (
                            <button
                              key={col.id}
                              onClick={() => onMoveTask(task.id, col.id)}
                              className="px-1 py-0.5 rounded bg-slate-950/80 border border-slate-900 text-[8.5px] text-slate-500 hover:text-cyan-400 hover:border-slate-750 transition-all font-mono cursor-pointer uppercase"
                            >
                              {col.id.split('-')[0]}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {columnTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-6 py-12 rounded-xl border border-dashed border-slate-900/60 text-center text-slate-600 font-mono text-[10px]">
                    <CheckCircle className="w-5 h-5 mb-1.5 opacity-20" />
                    <span>COLUMN CLEAR</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

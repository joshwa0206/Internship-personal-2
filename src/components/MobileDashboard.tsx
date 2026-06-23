import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority, Member, ActivityLog } from '../types';
import { MEMBERS } from '../data';
import { 
  Plus, Calendar, Shield, Cpu, Clock, CheckCircle2, AlertTriangle, 
  ChevronRight, ArrowRight, Settings, Command, Edit2, Trash2, 
  Smartphone, Wifi, Battery, ToggleLeft, UserCheck, MessageSquareCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MobileDashboardProps {
  tasks: Task[];
  loggedInMember: Member | null;
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onMoveTask: (id: string, newStatus: TaskStatus) => void;
  onDeleteTask: (id: string) => void;
  logs: ActivityLog[];
}

const TABS: { id: TaskStatus; label: string; short: string; color: string }[] = [
  { id: 'todo', label: 'Backlog', short: 'TODO', color: 'bg-zinc-400' },
  { id: 'in-progress', label: 'Developing', short: 'DEV', color: 'bg-cyan-500' },
  { id: 'review', label: 'Review', short: 'REV', color: 'bg-purple-500' },
  { id: 'done', label: 'Deployed', short: 'PROD', color: 'bg-emerald-500' }
];

export default function MobileDashboard({
  tasks,
  loggedInMember,
  onAddTask,
  onEditTask,
  onMoveTask,
  onDeleteTask,
  logs
}: MobileDashboardProps) {
  const [activeTab, setActiveTab] = useState<TaskStatus>('todo');
  const [activeView, setActiveView] = useState<'board' | 'logs' | 'auth'>('board');

  const columnTasks = tasks.filter(t => t.status === activeTab);

  const getPriorityColor = (p: TaskPriority) => {
    switch (p) {
      case 'urgent': return 'text-rose-400 border-rose-955 bg-rose-950/20';
      case 'high': return 'text-amber-400 border-amber-955 bg-amber-955/20';
      case 'medium': return 'text-cyan-400 border-cyan-955 bg-cyan-955/20';
      case 'low': return 'text-slate-400 border-slate-900 bg-slate-900/30';
    }
  };

  const getAssignee = (id: string) => {
    return MEMBERS.find(m => m.id === id);
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMinutes = Math.floor(diffMs / 60000);
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return 'now';
    }
  };

  return (
    <div className="w-[335px] h-[645px] mx-auto bg-slate-950 border-[6px] border-slate-900 rounded-[36px] overflow-hidden shadow-2xl relative flex flex-col font-sans select-none text-zinc-200">
      
      {/* 1. Mobile Status Bar Chrome */}
      <div className="bg-slate-950 px-5 pt-3 pb-1 flex items-center justify-between text-[10px] font-mono text-zinc-550 select-none z-25">
        <span className="font-semibold text-zinc-400">09:41</span>
        
        {/* Speaker Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-900 rounded-full border border-slate-950 flex items-center justify-center p-[1px]">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-800 absolute right-3" />
        </div>

        <div className="flex items-center gap-1.5 text-zinc-450">
          <Wifi className="w-3 h-3 text-cyan-400" />
          <svg className="w-4 h-4 text-emerald-400 fill-current" viewBox="0 0 24 24">
            <path d="M2 17h2v2H2zm4-4h2v6H6zm4-4h2v10h-2zm4-4h2v14h-2zm4-4h2v18h-2z" />
          </svg>
          <div className="flex items-center gap-0.5 border border-zinc-700 rounded-xs px-0.5 py-[1px]">
            <div className="w-2.5 h-1.5 bg-cyan-400" />
          </div>
        </div>
      </div>

      {/* 2. Custom App Bar */}
      <div className="bg-slate-950 border-b border-slate-900 px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 p-[1px]">
            <div className="w-full h-full bg-slate-900 rounded-[7px] flex items-center justify-center">
              <Cpu className="w-2.5 h-2.5 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-[11px] font-bold tracking-wider uppercase bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              AetherEngine
            </h1>
            <div className="text-[7.5px] font-mono text-slate-500 uppercase tracking-widest leading-none">NODE // {loggedInMember ? 'AUTHED' : 'VISITOR'}</div>
          </div>
        </div>

        {loggedInMember && (
          <div className="flex items-center gap-1.5">
            <img
              src={loggedInMember.avatar}
              className="w-5.5 h-5.5 rounded-full object-cover border border-slate-800"
              alt="logged avatar"
            />
          </div>
        )}
      </div>

      {/* 3. Primary Workspace Area */}
      <div className="flex-1 overflow-y-auto px-3.5 pt-3 pb-2 bg-[#090C15]/95">
        <AnimatePresence mode="wait">
          
          {/* VIEW Option A: Kanban Mobile Board */}
          {activeView === 'board' && (
            <motion.div
              key="board"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3.5"
            >
              {/* Column Selection Tabs */}
              <div className="flex bg-slate-950 border border-slate-900 rounded-xl p-0.5 justify-between">
                {TABS.map(tab => {
                  const isActive = activeTab === tab.id;
                  const count = tasks.filter(t => t.status === tab.id).length;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-1.5 text-center rounded-lg font-mono text-[9px] font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                        isActive 
                        ? 'bg-slate-900 border border-slate-800/80 text-cyan-400 font-extrabold shadow-sm' 
                        : 'text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span className={`w-1 h-3 rounded-full ${tab.color}`} />
                        <span>{tab.short}</span>
                      </div>
                      <span className="text-[8px] font-normal text-slate-650">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Add Vector Action */}
              <div className="flex items-center justify-between">
                <span className="text-[8.5px] font-mono text-slate-500 uppercase tracking-widest">
                  SEGMENT: <span className="text-zinc-300 font-bold">{TABS.find(t=>t.id===activeTab)?.label}</span>
                </span>
                
                <button
                  onClick={() => onAddTask(activeTab)}
                  className="flex items-center gap-1 px-2 py-1 text-[8.5px] font-mono bg-cyan-950/40 hover:bg-cyan-900/35 border border-cyan-800/30 text-cyan-400 rounded-lg transition-all cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>ADD VECTOR</span>
                </button>
              </div>

              {/* Tasks List */}
              <div className="space-y-2.5 overflow-y-auto max-h-[385px] pr-0.5 pb-8">
                {columnTasks.map(task => {
                  const assignee = getAssignee(task.assigneeId);
                  return (
                    <div
                      key={task.id}
                      className="bg-[#0C101B] border border-slate-900 hover:border-slate-800 rounded-xl p-3 shadow-md relative"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[7.5px] font-mono px-1.5 py-0.5 rounded border border-slate-850 text-slate-500 uppercase tracking-widest bg-slate-950/50">
                          {task.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[7px] font-mono px-1 border rounded uppercase ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-[11px] font-semibold text-zinc-200 tracking-wide leading-snug">{task.title}</h3>
                      
                      {/* Sub-description */}
                      <p className="text-[9.5px] text-slate-500 mt-1 line-clamp-2 select-none leading-relaxed">
                        {task.description}
                      </p>

                      {/* Footer Info */}
                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-950">
                        {/* Assignee Avatar */}
                        <div className="flex items-center gap-1.5">
                          <img
                            src={assignee?.avatar}
                            className="w-4.5 h-4.5 rounded-full object-cover border border-slate-900"
                            alt="assignee placeholder"
                          />
                          <span className="text-[8px] font-mono text-slate-500 truncate max-w-[60px]">
                            {assignee?.name.split(' ')[0]}
                          </span>
                        </div>

                        {/* Calendar */}
                        <div className="flex items-center gap-1 text-[8px] font-mono text-slate-600">
                          <Calendar className="w-2.5 h-2.5" />
                          <span>{task.dueDate.substring(5)}</span>
                        </div>

                        {/* Fast Actions inside small dots */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEditTask(task)}
                            className="p-1 rounded bg-slate-950 border border-slate-900 hover:border-cyan-500/40 text-slate-500 hover:text-cyan-400 cursor-pointer"
                          >
                            <Settings className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>

                      {/* Quick task status advancement */}
                      <div className="mt-2.5 pt-2 border-t border-slate-950/80 flex justify-end gap-1 font-mono text-[7px]">
                        <span className="mr-auto text-slate-600 text-[6.5px] mt-0.5 uppercase">Move:</span>
                        {TABS.map(t => {
                          if (t.id === task.status) return null;
                          return (
                            <button
                              key={t.id}
                              onClick={() => onMoveTask(task.id, t.id)}
                              className="px-1 py-0.5 rounded bg-slate-950 border border-slate-900 text-slate-500 hover:text-cyan-450 cursor-pointer"
                            >
                              {t.short}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {columnTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 px-4 rounded-xl border border-dashed border-slate-900/80 text-center text-slate-605 text-[9px] font-mono">
                    <CheckCircle2 className="w-4 h-4 mb-1 text-slate-700 opacity-30 animate-pulse" />
                    <span>COLUMN CLEAR</span>
                    <span className="text-[7.5px] text-slate-800 mt-0.5">No matching vector nodes found</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* VIEW Option B: Realtime Activity Logs */}
          {activeView === 'logs' && (
            <motion.div
              key="logs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 mb-1 border-b border-slate-900 pb-2">
                <MessageSquareCode className="w-3.5 h-3.5 text-cyan-450" />
                <h3 className="text-[10px] font-mono tracking-wider font-bold">REAL-TIME TELEMETRY</h3>
              </div>

              {/* Sync Scroll Logs list */}
              <div className="space-y-2 max-h-[430px] overflow-y-auto pr-0.5 pb-8 font-mono text-[9px] select-none">
                {logs.map(log => (
                  <div 
                    key={log.id} 
                    className="p-2 border border-slate-900/60 bg-[#0C101B]/80 rounded-lg flex items-start gap-2 relative hover:bg-slate-900/30 transition-colors"
                  >
                    <img 
                      src={log.userAvatar} 
                      className="w-4 h-4 rounded-full border border-slate-800 object-cover mt-[1px]" 
                      alt="avatar" 
                    />
                    <div className="flex-1 min-w-0 pr-0.5">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-bold text-zinc-300 text-[8.5px] truncate">{log.userName.split(' ')[0]}</span>
                        <span className="text-[7.5px] text-slate-655 uppercase font-normal">{formatRelativeTime(log.timestamp)}</span>
                      </div>
                      <div className="text-slate-400 text-[8.5px] leading-tight">
                        <span className="text-cyan-450">{log.action}</span>
                        {log.taskTitle && (
                          <div className="mt-0.5 px-1 py-[1px] bg-slate-950 border border-slate-900 text-[7px] inline-block max-w-full truncate rounded text-slate-300">
                            {log.taskTitle}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* VIEW Option C: Auth Profiles */}
          {activeView === 'auth' && (
            <motion.div
              key="auth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 mb-1 border-b border-slate-900 pb-2">
                <UserCheck className="w-3.5 h-3.5 text-cyan-450" />
                <h3 className="text-[10px] font-mono tracking-wider font-bold">AUTHENTICATED IDENTITY</h3>
              </div>

              {loggedInMember ? (
                <div className="bg-slate-950/80 border border-slate-900 rounded-xl p-4 text-center space-y-3 shadow-lg">
                  <div className="relative inline-block mx-auto">
                    <img
                      src={loggedInMember.avatar}
                      className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-cyan-400"
                      alt="auth profile"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-950 border border-cyan-500/35 flex items-center justify-center">
                      <Shield className="w-3 h-3 text-emerald-450" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xs font-bold text-zinc-150">{loggedInMember.name}</h2>
                    <p className="text-[9px] font-mono text-cyan-405">{loggedInMember.role}</p>
                    <p className="text-[8.5px] font-mono text-slate-550 mt-1">{loggedInMember.email}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-900 text-left font-mono text-[8px] text-slate-500 space-y-1.5 leading-snug select-none">
                    <div>CIPHER SCHEME: SHA-256_RSA</div>
                    <div>CLUSTER TOKEN: aeth_tk_8c552574</div>
                    <div className="text-emerald-450">INTEGRITY HANDSHAKE verified</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 space-y-3 font-mono text-[9px]">
                  <AlertTriangle className="w-6 h-6 mx-auto text-rose-500 animate-pulse" />
                  <div>No terminal identity verified</div>
                  <div className="text-[8px] text-slate-600">Handshake is idle</div>
                </div>
              )}
              
              <div className="text-center pt-2">
                <span className="text-[7.5px] font-mono text-slate-600 block uppercase leading-snug">
                  Designed by Sarah Cooper // Aether UI System
                </span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* 4. Beautiful smartphone bottom home-bar */}
      <div className="bg-slate-950 border-t border-slate-900/90 py-2.5 px-4 flex items-center justify-around z-20">
        
        {/* Navigation buttons */}
        <button
          onClick={() => { setActiveView('board'); }}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
            activeView === 'board' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-350'
          }`}
        >
          <Command className="w-4.5 h-4.5" />
          <span className="text-[7.5px] font-mono uppercase tracking-wider font-extrabold">Board</span>
        </button>

        <button
          onClick={() => { setActiveView('logs'); }}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
            activeView === 'logs' ? 'text-teal-400' : 'text-slate-500 hover:text-slate-350'
          }`}
        >
          <div className="relative">
            <span className="absolute -top-0.5 -right-1 w-1.5 h-1.5 rounded-full bg-cyan-455 animate-ping" />
            <MessageSquareCode className="w-4.5 h-4.5" />
          </div>
          <span className="text-[7.5px] font-mono uppercase tracking-wider font-extrabold">Logs</span>
        </button>

        <button
          onClick={() => { setActiveView('auth'); }}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
            activeView === 'auth' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-350'
          }`}
        >
          <UserCheck className="w-4.5 h-4.5" />
          <span className="text-[7.5px] font-mono uppercase tracking-wider font-extrabold">Identity</span>
        </button>
      </div>

      {/* Simulated physical capsule bar */}
      <div className="bg-slate-950 pb-2 flex items-center justify-center select-none z-25">
        <div className="w-24 h-1 bg-zinc-800 rounded-full cursor-grab" />
      </div>

    </div>
  );
}

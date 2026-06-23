import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, Member, ActivityLog } from './types';
import { MEMBERS, INITIAL_TASKS, INITIAL_LOGS, MOCK_ACTIVITY_TEMPLATES } from './data';
import AuthScreen from './components/AuthScreen';
import ActivityFeed from './components/ActivityFeed';
import DesktopDashboard from './components/DesktopDashboard';
import MobileDashboard from './components/MobileDashboard';
import TaskModal from './components/TaskModal';

import { 
  Laptop, Smartphone, ArrowRightLeft, ShieldAlert, Cpu, 
  Terminal, GitBranch, RefreshCw, Layers, Sparkles, LogOut,
  Settings, HelpCircle, HardDriveDownload, Wifi
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Sync state initially with mock or standard LocalStorage
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('aether_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('aether_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [loggedInMember, setLoggedInMember] = useState<Member | null>(() => {
    // Start with Sarah Cooper by default so the user immediately gets to experience the dashboard
    return MEMBERS[0];
  });

  const [presentationView, setPresentationView] = useState<'side-by-side' | 'desktop-only' | 'mobile-only'>('side-by-side');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTask, setModalTask] = useState<Task | null>(null);
  const [modalInitialStatus, setModalInitialStatus] = useState<TaskStatus>('todo');

  // Trigger LocalStorage save whenever data updates
  useEffect(() => {
    localStorage.setItem('aether_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('aether_logs', JSON.stringify(logs));
  }, [logs]);

  // Simulated WebSocket Live events tick
  useEffect(() => {
    const interval = setInterval(() => {
      // Rotate events automatically to keep the real-time activity feed alive!
      if (loggedInMember) {
        injectRandomActivityEvent();
      }
    }, 45000); // Trigger a realistic event every 45s

    return () => clearInterval(interval);
  }, [loggedInMember, tasks]);

  // Auth trigger handlers
  const handleLogin = (memberId: string) => {
    const foundMember = MEMBERS.find(m => m.id === memberId) || MEMBERS[0];
    setLoggedInMember(foundMember);

    // Create session handshake activity log
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      userId: foundMember.id,
      userName: foundMember.name,
      userAvatar: foundMember.avatar,
      action: 'initiated secure cryptographic handshake session',
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleLogout = () => {
    if (!loggedInMember) return;
    
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      userId: loggedInMember.id,
      userName: loggedInMember.name,
      userAvatar: loggedInMember.avatar,
      action: 'terminated terminal console session (locked terminal)',
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [newLog, ...prev]);
    setLoggedInMember(null);
  };

  // Helper is called when injecting manual/simulated events
  const injectRandomActivityEvent = () => {
    const template = MOCK_ACTIVITY_TEMPLATES[Math.floor(Math.random() * MOCK_ACTIVITY_TEMPLATES.length)];
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
    
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      taskId: randomTask?.id,
      taskTitle: randomTask?.title,
      userId: template.userId,
      userName: template.userName,
      userAvatar: template.userAvatar,
      action: template.action,
      timestamp: new Date().toISOString()
    };
    
    setLogs(prev => [newLog, ...prev]);
  };

  // Task CRUD operations
  const handleOpenAddTask = (status: TaskStatus) => {
    setModalTask(null);
    setModalInitialStatus(status);
    setIsModalOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setModalTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'> & { id?: string }) => {
    const activeUser = loggedInMember || MEMBERS[0];
    
    if (taskData.id) {
      // EDIT MODE
      setTasks(prev => prev.map(t => {
        if (t.id === taskData.id) {
          const updated = { ...t, ...taskData } as Task;
          return updated;
        }
        return t;
      }));

      // Log update action
      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        taskId: taskData.id,
        taskTitle: taskData.title,
        userId: activeUser.id,
        userName: activeUser.name,
        userAvatar: activeUser.avatar,
        action: 'updated task state & parameters',
        timestamp: new Date().toISOString()
      };
      setLogs(prev => [newLog, ...prev]);
    } else {
      // CREATE MODE
      const newId = `task-${Date.now()}`;
      const newTask: Task = {
        id: newId,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        category: taskData.category,
        dueDate: taskData.dueDate,
        assigneeId: taskData.assigneeId,
        tags: taskData.tags,
        createdAt: new Date().toISOString()
      };

      setTasks(prev => [newTask, ...prev]);

      // Log creation action
      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        taskId: newId,
        taskTitle: newTask.title,
        userId: activeUser.id,
        userName: activeUser.name,
        userAvatar: activeUser.avatar,
        action: `spawned new task vector in [${newTask.status.toUpperCase()}]`,
        timestamp: new Date().toISOString()
      };
      setLogs(prev => [newLog, ...prev]);
    }

    setIsModalOpen(false);
  };

  const handleMoveTask = (id: string, newStatus: TaskStatus) => {
    const activeUser = loggedInMember || MEMBERS[0];
    let taskName = '';

    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        taskName = t.title;
        return { ...t, status: newStatus };
      }
      return t;
    }));

    // Log move
    const statusLabels: Record<TaskStatus, string> = {
      'todo': 'Backlog',
      'in-progress': 'In Development',
      'review': 'Code Review',
      'done': 'Prod Deployed'
    };

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      taskId: id,
      taskTitle: taskName,
      userId: activeUser.id,
      userName: activeUser.name,
      userAvatar: activeUser.avatar,
      action: `relocated task status to: ${statusLabels[newStatus]}`,
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleDeleteTask = (id: string) => {
    const activeUser = loggedInMember || MEMBERS[0];
    const taskToDelete = tasks.find(t => t.id === id);
    if (!taskToDelete) return;

    setTasks(prev => prev.filter(t => t.id !== id));

    // Log deletion
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      userId: activeUser.id,
      userName: activeUser.name,
      userAvatar: activeUser.avatar,
      action: `purged task vector: "${taskToDelete.title}"`,
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [newLog, ...prev]);
    setIsModalOpen(false);
  };

  const resetPresetDatabase = () => {
    if (confirm('Verify: Reset local storage database to pristine enterprise template?')) {
      localStorage.removeItem('aether_tasks');
      localStorage.removeItem('aether_logs');
      setTasks(INITIAL_TASKS);
      setLogs(INITIAL_LOGS);
    }
  };

  const clearLogOutput = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-[#06080F] text-zinc-100 bg-grid-glow relative flex flex-col font-sans">
      
      {/* 1. Global High Performance Presenter Deck header */}
      <header className="relative z-10 border-b border-slate-900 bg-[#070A12]/90 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Brand logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 p-[1px] shadow-lg shadow-cyan-950/20">
            <div className="w-full h-full bg-[#090C15] rounded-[15px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-widest text-zinc-100 uppercase">
                Aether<span className="text-cyan-400 font-extrabold">Engine</span>
              </h1>
              <span className="text-[9px] font-mono font-bold bg-cyan-950/60 text-cyan-400 border border-cyan-800/30 px-2 py-0.5 rounded-full select-none">
                BUILD CONSOLE v3.8
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono tracking-wide mt-0.5 uppercase">
              Parallel Presentation Screen (Responsive Synchronization Pipeline)
            </p>
          </div>
        </div>

        {/* Presentation controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Preset switch controls */}
          <div className="flex bg-slate-950 border border-slate-900 rounded-xl p-1 items-center gap-0.5 font-mono text-[10px] text-slate-400 select-none">
            
            <button
              onClick={() => setPresentationView('side-by-side')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                presentationView === 'side-by-side' 
                ? 'bg-slate-900 border border-slate-800/80 text-cyan-400 font-bold shadow' 
                : 'hover:text-slate-200'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>SIDE-BY-SIDE PRESENTATION</span>
            </button>

            <button
              onClick={() => setPresentationView('desktop-only')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                presentationView === 'desktop-only' 
                ? 'bg-slate-900 border border-slate-800/80 text-cyan-400 font-bold shadow' 
                : 'hover:text-slate-200'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>DESKTOP VIEW</span>
            </button>

            <button
              onClick={() => setPresentationView('mobile-only')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                presentationView === 'mobile-only' 
                ? 'bg-slate-900 border border-slate-800/80 text-cyan-400 font-bold shadow' 
                : 'hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>MOBILE ENGINE</span>
            </button>
          </div>

          {/* Database Reset */}
          <button
            onClick={resetPresetDatabase}
            title="Reset storage database"
            className="p-2 border border-slate-900 bg-slate-950 hover:bg-slate-900/60 rounded-xl text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <HardDriveDownload className="w-4 h-4" />
          </button>

          {/* Access lock / logout button */}
          {loggedInMember ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-mono tracking-widest bg-rose-950/30 hover:bg-rose-900/30 border border-rose-900/30 hover:border-rose-800/50 text-rose-450 hover:text-rose-400 cursor-pointer transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>LOCK TERMINAL</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-mono bg-amber-950/20 border border-amber-900/20 text-amber-500 animate-pulse select-none">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>TERMINAL SECURED</span>
            </div>
          )}
        </div>

      </header>

      {/* 2. Primary Layout Presenter Canvas */}
      <main className="flex-1 p-6 relative flex flex-col justify-center">

        {/* Ambient background designs */}
        <div className="absolute top-[10%] left-[20%] w-[450px] h-[450px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[25%] w-[450px] h-[450px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
          
          <AnimatePresence mode="wait">
            {presentationView === 'side-by-side' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start"
              >
                
                {/* A. LEFT PANE: Large Desktop Dashboard container (xl:col-span-8) */}
                <div className="xl:col-span-8 flex flex-col space-y-4">
                  {/* Web Browser Frame decoration */}
                  <div className="bg-slate-900/60 border border-slate-905 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col h-[700px]">
                    {/* Browser Toolbar / Window control decoration */}
                    <div className="bg-slate-950 px-4 py-3 border-b border-slate-900 flex items-center justify-between font-mono text-[10px]">
                      {/* Left side window spheres */}
                      <div className="flex items-center gap-1.5 select-none text-slate-500">
                        <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/40" />
                        <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/40" />
                        <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/40" />
                        <span className="ml-2.5 font-sans font-semibold tracking-wide text-xs text-zinc-400">
                          AetherEngine Core Board Integration
                        </span>
                      </div>

                      {/* address bar */}
                      <div className="bg-[#0C101B] px-4 py-1 rounded-lg border border-slate-900 w-96 text-center text-slate-500 font-mono scale-95 select-all hover:border-slate-800 transition-colors">
                        https://aetherengine.io/terminal/dashboard
                      </div>

                      <div className="text-right text-[9px] text-cyan-405 font-mono select-none">
                        NODE_SYNC: <span className="text-emerald-450 font-bold animate-pulse">TRUE</span>
                      </div>
                    </div>

                    {/* Window content */}
                    <div className="flex-1 overflow-hidden relative">
                      {loggedInMember ? (
                        <DesktopDashboard
                          tasks={tasks}
                          loggedInMember={loggedInMember}
                          onAddTask={handleOpenAddTask}
                          onEditTask={handleOpenEditTask}
                          onMoveTask={handleMoveTask}
                          onDeleteTask={handleDeleteTask}
                        />
                      ) : (
                        <AuthScreen viewType="desktop" onLogin={handleLogin} />
                      )}
                    </div>
                  </div>

                  {/* Synchronized Terminal Log feed beneath the Desktop View */}
                  <div className="h-[210px]">
                    <ActivityFeed 
                      logs={logs} 
                      onClearLogs={clearLogOutput}
                      onInjectSimulatedEvent={injectRandomActivityEvent}
                    />
                  </div>
                </div>

                {/* B. RIGHT PANE: Companion smartphone layout (xl:col-span-4) */}
                <div className="xl:col-span-4 flex flex-col items-center justify-center space-y-4">
                  
                  {/* Presentation info header for mobile phone sync container */}
                  <div className="w-full bg-slate-900/30 border border-slate-900/90 rounded-2xl p-4 font-mono text-[11px] leading-relaxed relative overflow-hidden backdrop-blur-md">
                    <div className="flex items-center gap-2 text-cyan-400 mb-2 font-bold uppercase tracking-wider">
                      <Smartphone className="w-4 h-4 animate-bounce" />
                      <span>SIMULATED COMPANION</span>
                    </div>
                    <p className="text-slate-500 select-none text-[10px] sm:text-[11px]">
                      This smartphone viewport simulates the companion native application. 
                      Adding or changing a task vector in either device synchronously flashes 
                      across the pipeline bus dynamically in real-time.
                    </p>
                    <div className="absolute right-3 top-3 w-16 h-16 bg-cyan-400/5 rounded-full blur-xl animate-pulse" />
                  </div>

                  {/* Interactive Mobile Device Frame */}
                  <div className="relative">
                    {loggedInMember ? (
                      <MobileDashboard
                        tasks={tasks}
                        loggedInMember={loggedInMember}
                        onAddTask={handleOpenAddTask}
                        onEditTask={handleOpenEditTask}
                        onMoveTask={handleMoveTask}
                        onDeleteTask={handleDeleteTask}
                        logs={logs}
                      />
                    ) : (
                      <div className="w-[335px] h-[645px] mx-auto bg-slate-950 border-[6px] border-slate-900 rounded-[36px] overflow-hidden shadow-2xl relative flex flex-col font-sans select-none justify-between">
                        {/* Status bar */}
                        <div className="bg-slate-950 px-5 pt-3 pb-1 flex items-center justify-between text-[10px] font-mono text-zinc-500 z-25">
                          <span className="font-semibold text-zinc-400">09:41</span>
                          <div className="w-20 h-4 bg-slate-900 rounded-full border border-slate-950 flex items-center justify-center p-[1px] absolute top-2.5 left-1/2 -translate-x-1/2" />
                          <div className="flex items-center gap-1"><Wifi className="w-3 h-3 text-cyan-400" /></div>
                        </div>

                        {/* Content: Auth panel inside phone */}
                        <div className="flex-1 overflow-hidden relative">
                          <AuthScreen viewType="mobile" onLogin={handleLogin} />
                        </div>

                        {/* Home indicator bar mock */}
                        <div className="bg-slate-950 pb-2.5 flex items-center justify-center">
                          <div className="w-24 h-1 bg-zinc-805 rounded-full" />
                        </div>
                      </div>
                    )}
                  </div>

                </div>

              </motion.div>
            )}

            {presentationView === 'desktop-only' && (
              <motion.div
                key="desktop-mode"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-4"
              >
                {/* Desktop view only */}
                <div className="bg-slate-900/60 border border-slate-905 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col h-[755px]">
                  {/* Browser Toolbar */}
                  <div className="bg-slate-950 px-4 py-3 border-b border-slate-900 flex items-center justify-between font-mono text-[10px] select-none">
                    <div className="flex items-center gap-1.5 text-slate-550">
                      <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/40" />
                      <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/40" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/40" />
                      <span className="ml-2.5 font-sans font-semibold tracking-wide text-xs text-zinc-450">
                        AetherEngine Task Terminal Suite
                      </span>
                    </div>

                    <div className="bg-[#0C101B] px-4 py-1 rounded-lg border border-slate-900 w-96 text-center text-slate-505 select-all">
                      https://aetherengine.io/terminal/dashboard
                    </div>

                    <div>NODE_REF: <span className="text-cyan-455 font-bold">SHA-DESK_404</span></div>
                  </div>

                  {/* Main core content viewport */}
                  <div className="flex-1 overflow-hidden relative">
                    {loggedInMember ? (
                      <DesktopDashboard
                        tasks={tasks}
                        loggedInMember={loggedInMember}
                        onAddTask={handleOpenAddTask}
                        onEditTask={handleOpenEditTask}
                        onMoveTask={handleMoveTask}
                        onDeleteTask={handleDeleteTask}
                      />
                    ) : (
                      <AuthScreen viewType="desktop" onLogin={handleLogin} />
                    )}
                  </div>
                </div>

                {/* Logs feed panel */}
                <div className="h-[210px]">
                  <ActivityFeed 
                    logs={logs} 
                    onClearLogs={clearLogOutput}
                    onInjectSimulatedEvent={injectRandomActivityEvent}
                  />
                </div>
              </motion.div>
            )}

            {presentationView === 'mobile-only' && (
              <motion.div
                key="mobile-mode"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-col items-center justify-center min-h-[660px] py-4"
              >
                {/* Mobile view only */}
                <div className="relative">
                  {loggedInMember ? (
                    <MobileDashboard
                      tasks={tasks}
                      loggedInMember={loggedInMember}
                      onAddTask={handleOpenAddTask}
                      onEditTask={handleOpenEditTask}
                      onMoveTask={handleMoveTask}
                      onDeleteTask={handleDeleteTask}
                      logs={logs}
                    />
                  ) : (
                    <div className="w-[335px] h-[645px] mx-auto bg-slate-950 border-[6px] border-slate-900 rounded-[36px] overflow-hidden shadow-2xl relative flex flex-col font-sans select-none justify-between">
                      {/* Status bar */}
                      <div className="bg-slate-950 px-5 pt-3 pb-1 flex items-center justify-between text-[10px] font-mono text-zinc-500 z-25">
                        <span className="font-semibold text-zinc-400">09:41</span>
                        <div className="w-20 h-4 bg-slate-900 rounded-full border border-slate-950 flex items-center justify-center p-[1px] absolute top-2.5 left-1/2 -translate-x-1/2" />
                        <div className="flex items-center gap-1"><Wifi className="w-3 h-3 text-cyan-455" /></div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 overflow-hidden relative">
                        <AuthScreen viewType="mobile" onLogin={handleLogin} />
                      </div>

                      {/* Home indicator bar mock */}
                      <div className="bg-slate-950 pb-2.5 flex items-center justify-center">
                        <div className="w-24 h-1 bg-zinc-805 rounded-full" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </main>

      {/* 3. Global Footer Details */}
      <footer className="relative z-10 border-t border-slate-900 bg-[#06080F] py-5 px-6 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-slate-500">
        <div>AETHERENGINE STACK INTEGRATED PLATFORM © 2026</div>
        <div>
          DESIGN COMPLIANCE: <span className="text-cyan-405 font-bold uppercase">Modern High-Glow Theme System</span>
        </div>
      </footer>

      {/* 4. CRUD Edit/Create Stateful Overlay modal popups */}
      <AnimatePresence>
        {isModalOpen && (
          <TaskModal
            task={modalTask}
            initialStatus={modalInitialStatus}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveTask}
            onDelete={modalTask ? handleDeleteTask : undefined}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

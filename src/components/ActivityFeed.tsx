import { ActivityLog } from '../types';
import { Terminal, ShieldAlert, Sparkles, User, RefreshCw, Trash2, GitBranch } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ActivityFeedProps {
  logs: ActivityLog[];
  onClearLogs?: () => void;
  onInjectSimulatedEvent?: () => void;
}

export default function ActivityFeed({ logs, onClearLogs, onInjectSimulatedEvent }: ActivityFeedProps) {
  
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      // If it is today, show relative time or hours/minutes
      const diffMs = Date.now() - date.getTime();
      const diffMinutes = Math.floor(diffMs / 60000);
      
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Recent';
    }
  };

  const getLogIcon = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('created') || act.includes('added')) {
      return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
    }
    if (act.includes('delete') || act.includes('removed')) {
      return <ShieldAlert className="w-3.5 h-3.5 text-rose-500 animate-pulse" />;
    }
    if (act.includes('moved') || act.includes('status') || act.includes('marked')) {
      return <RefreshCw className="w-3.5 h-3.5 text-teal-400" />;
    }
    return <Terminal className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/40 border border-slate-900 rounded-2xl overflow-hidden backdrop-blur-md">
      {/* Feed Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-900 bg-slate-900/10">
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="flex h-1.5 w-1.5 absolute top-0 right-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
            </span>
            <Terminal className="w-4 h-4 text-cyan-450" />
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-zinc-200">ACTIVE LOG STREAM</h3>
            <p className="text-[9px] font-mono text-slate-500 uppercase">Synchronized Operations</p>
          </div>
        </div>
        
        {/* Actions bar */}
        <div className="flex items-center gap-1.5">
          {onInjectSimulatedEvent && (
            <button
              onClick={onInjectSimulatedEvent}
              title="Inject Background Event"
              className="flex items-center gap-1 px-2 py-1 text-[9px] font-mono rounded bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-800/30 text-cyan-400 transition-all cursor-pointer"
            >
              <GitBranch className="w-2.5 h-2.5 animate-bounce" />
              <span>INJECT</span>
            </button>
          )}
          {onClearLogs && (
            <button
              onClick={onClearLogs}
              title="Clear Terminal Outlog"
              className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer rounded hover:bg-slate-900/60"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Feed Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 font-mono text-[11px] h-[340px]">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8 text-slate-600">
            <Terminal className="w-6 h-6 mb-2 text-slate-700 animate-pulse" />
            <div>No activity registered on bus</div>
            <div className="text-[9px] mt-1 text-slate-800">Cluster stream empty</div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10, y: -5 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="group relative flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/20 border border-slate-950 hover:bg-slate-900/45 hover:border-slate-850 transition-all"
              >
                {/* Node Line connecting dots */}
                <div className="absolute top-8 left-5 bottom-0 w-[1px] bg-slate-900 group-last:hidden" />

                {/* Avatar Icon */}
                <div className="relative flex-none mt-0.5">
                  {log.userAvatar ? (
                    <img
                      src={log.userAvatar}
                      className="w-5 h-5 rounded-full object-cover border border-slate-800"
                      alt={log.userName}
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <User className="w-3 h-3 text-slate-400" />
                    </div>
                  )}
                  {/* Action Accent Dot indicator */}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-slate-950 flex items-center justify-center border border-slate-900">
                    {getLogIcon(log.action)}
                  </div>
                </div>

                {/* Log Line text */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-baseline justify-between gap-2.5 mb-0.5">
                    <span className="font-semibold text-zinc-350 text-[10px] sm:text-xs">
                      {log.userName}
                    </span>
                    <span className="text-[9px] text-slate-500 whitespace-nowrap">
                      {formatTime(log.timestamp)}
                    </span>
                  </div>
                  
                  <div className="text-slate-400 leading-normal break-words text-[10px] sm:text-[11px]">
                    <span className="text-teal-400">{log.action}</span>
                    {log.taskTitle && (
                      <span className="text-zinc-200 ml-1.5 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-850 inline-block max-w-full truncate text-[9.5px]">
                        {log.taskTitle}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer Metrics */}
      <div className="px-4 py-2 border-t border-slate-900 bg-slate-900/20 flex items-center justify-between text-[8px] font-mono text-slate-600">
        <div>STREAM REF: SH_CLUSTER_BUS_001</div>
        <div className="text-cyan-400/70">SYNC STATUS: LIVE_CONN</div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap,
  RefreshCcw,
  ShieldCheck,
  Globe,
  Server,
  Database,
  Layers,
  Activity,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

// --- Types ---

type Phase = 'BLUE_ACTIVE' | 'SHIFTING' | 'GREEN_ACTIVE';

interface Particle {
  id: number;
  delay: number;
  duration: number;
}

// --- Constants ---

const PHASES: Phase[] = ['BLUE_ACTIVE', 'SHIFTING', 'GREEN_ACTIVE'];

const PHASE_CONFIG = {
  BLUE_ACTIVE: {
    title: 'BLUE ENVIRONMENT LIVE',
    description: '100% of production traffic is routed to the Blue cluster. Green is idle or being prepared.',
    blueTraffic: 100,
    greenTraffic: 0,
    status: 'STABLE',
    color: 'text-blue-400',
    accent: 'bg-blue-500',
    borderColor: 'border-blue-500/30'
  },
  SHIFTING: {
    title: 'TRAFFIC SHIFTING',
    description: 'Canary deployment in progress. 10% of traffic is routed to Green to validate the new release.',
    blueTraffic: 90,
    greenTraffic: 10,
    status: 'VALIDATING',
    color: 'text-orange-400',
    accent: 'bg-orange-500',
    borderColor: 'border-orange-500/30'
  },
  GREEN_ACTIVE: {
    title: 'GREEN ENVIRONMENT LIVE',
    description: 'Deployment successful. 100% of traffic is now on Green. Blue is kept as a warm standby.',
    blueTraffic: 0,
    greenTraffic: 100,
    status: 'SUCCESS',
    color: 'text-green-400',
    accent: 'bg-green-500',
    borderColor: 'border-green-500/30'
  }
};

// --- Components ---

const ParticleFlow = ({ 
  count, 
  color, 
  targetX, 
  targetY, 
  active 
}: { 
  count: number; 
  color: string; 
  targetX: number; 
  targetY: number;
  active: boolean;
}) => {
  const particles = useMemo(() => 
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      delay: Math.random() * 2,
      duration: 1.5 + Math.random() * 1
    })), [count]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: "50%", y: "50%", opacity: 0, scale: 0 }}
          animate={{ 
            x: [`50%`, `${targetX}%`], 
            y: [`50%`, `${targetY}%`],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
          }}
          className={`absolute w-1 h-1 rounded-full blur-[1px] ${color} shadow-[0_0_8px_rgba(255,255,255,0.5)]`}
        />
      ))}
    </div>
  );
};

const ClusterNode = ({ 
  type, 
  active, 
  traffic, 
  phase 
}: { 
  type: 'BLUE' | 'GREEN'; 
  active: boolean; 
  traffic: number;
  phase: Phase;
}) => {
  const isBlue = type === 'BLUE';
  const color = isBlue ? 'blue' : 'green';
  const accentColor = isBlue ? 'bg-blue-500' : 'bg-green-500';
  const textColor = isBlue ? 'text-blue-400' : 'text-green-400';
  const borderColor = isBlue ? 'border-blue-500/20' : 'border-green-500/20';

  return (
    <motion.div 
      layout
      className={`relative w-64 h-64 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-700 ${borderColor} ${active ? 'bg-white/[0.02]' : 'opacity-20 grayscale'}`}
    >
      {/* Glow Effect */}
      {active && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute inset-0 rounded-full blur-3xl ${accentColor}/20`}
        />
      )}

      {/* Internal Activity Particles */}
      {active && (
        <div className="absolute inset-4 rounded-full overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                x: [Math.random() * 200, Math.random() * 200],
                y: [Math.random() * 200, Math.random() * 200],
                opacity: [0, 0.3, 0]
              }}
              transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
              className={`absolute w-1 h-1 rounded-full ${accentColor}`}
            />
          ))}
        </div>
      )}

      <div className="z-10 text-center">
        <motion.h3 
          layout
          className={`text-lg font-black tracking-widest mb-1 ${textColor}`}
        >
          {type}
        </motion.h3>
        <div className="flex items-center justify-center gap-1 mb-2">
          <div className={`w-1.5 h-1.5 rounded-full ${active ? accentColor : 'bg-gray-600'}`} />
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">
            {active ? 'Active' : 'Standby'}
          </span>
        </div>
        <div className="text-2xl font-mono font-bold text-white">
          {traffic}%
        </div>
        <div className="text-[9px] text-gray-600 uppercase tracking-widest mt-1">Traffic</div>
      </div>

      {/* Infrastructure Icons */}
      <div className="absolute -bottom-4 flex gap-2">
        {[Layers, Database, Server].map((Icon, i) => (
          <div key={i} className={`p-2 rounded-lg border ${borderColor} bg-black/80 backdrop-blur-sm`}>
            <Icon size={12} className={active ? textColor : 'text-gray-700'} />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const LoadBalancer = ({ phase }: { phase: Phase }) => {
  return (
    <div className="relative z-20">
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 1],
          boxShadow: [
            "0 0 20px rgba(255,255,255,0.1)",
            "0 0 40px rgba(255,255,255,0.2)",
            "0 0 20px rgba(255,255,255,0.1)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-20 h-20 rounded-2xl bg-white/5 border border-white/20 backdrop-blur-md flex items-center justify-center"
      >
        <Globe className="text-white/80" size={32} />
      </motion.div>
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase">Load Balancer</span>
      </div>
    </div>
  );
};

export default function App() {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0; // Loop for demo purposes
        return prev + 1;
      });
    }, 150); // Adjust speed of deployment

    return () => clearInterval(interval);
  }, [isPaused]);

  const greenTraffic = useMemo(() => {
    if (progress < 10) return 0;
    return progress;
  }, [progress]);

  const blueTraffic = 100 - greenTraffic;

  const currentPhase = useMemo((): Phase => {
    if (greenTraffic === 0) return 'BLUE_ACTIVE';
    if (greenTraffic === 100) return 'GREEN_ACTIVE';
    return 'SHIFTING';
  }, [greenTraffic]);

  const config = PHASE_CONFIG[currentPhase];

  return (
    <div className="min-h-screen bg-[#020202] text-gray-400 font-sans overflow-hidden selection:bg-white/10">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative max-w-7xl mx-auto h-screen flex flex-col p-8">
        
        {/* Header */}
        <header className="flex justify-between items-start z-30">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/5 border border-white/10 rounded flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">MotionFlow</h1>
            </div>
            <p className="text-[10px] font-mono tracking-[0.4em] text-gray-600 uppercase">Automated Blue-Green Deployment</p>
          </div>

          <div className="flex flex-col items-end gap-4">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentPhase}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-right"
              >
                <div className={`text-[10px] font-bold tracking-widest uppercase mb-1 ${config.color}`}>
                  {config.status} {currentPhase === 'SHIFTING' && `(${progress}%)`}
                </div>
                <h2 className="text-xl font-black text-white tracking-tight uppercase italic">{config.title}</h2>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setProgress(0)}
                className="group flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all"
              >
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 group-hover:text-white">Restart</span>
                <RefreshCcw size={14} className="text-gray-500 group-hover:text-white group-hover:rotate-180 transition-all duration-500" />
              </button>
              <button 
                onClick={() => setIsPaused(!isPaused)}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all"
              >
                {isPaused ? <Activity size={14} className="text-blue-400" /> : <div className="w-3.5 h-3.5 flex items-center justify-center"><div className="w-1 h-3 bg-gray-500 rounded-sm mr-0.5" /><div className="w-1 h-3 bg-gray-500 rounded-sm" /></div>}
              </button>
            </div>
          </div>
        </header>

        {/* Main Visualization Area */}
        <main className="flex-1 flex items-center justify-center relative">
          
          {/* Traffic Flow Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <defs>
              <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="50%" stopColor="#22c55e" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Blue Path */}
            <motion.path
              d="M 50% 50% Q 40% 50%, 25% 50%"
              stroke="url(#blueGrad)"
              strokeWidth="1"
              fill="none"
              animate={{ strokeDasharray: ["0, 100", "100, 0"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Green Path */}
            <motion.path
              d="M 50% 50% Q 60% 50%, 75% 50%"
              stroke="url(#greenGrad)"
              strokeWidth="1"
              fill="none"
            />
          </svg>

          <div className="flex items-center justify-between w-full max-w-5xl relative">
            
            {/* Blue Cluster */}
            <div className="relative">
              <ClusterNode 
                type="BLUE" 
                active={currentPhase !== 'GREEN_ACTIVE'} 
                traffic={blueTraffic}
                phase={currentPhase}
              />
              <ParticleFlow 
                count={20} 
                color="bg-blue-400" 
                targetX={25} 
                targetY={50} 
                active={blueTraffic > 0} 
              />
            </div>

            {/* Central Load Balancer */}
            <LoadBalancer phase={currentPhase} />

            {/* Green Cluster */}
            <div className="relative">
              <ClusterNode 
                type="GREEN" 
                active={currentPhase !== 'BLUE_ACTIVE'} 
                traffic={greenTraffic}
                phase={currentPhase}
              />
              <ParticleFlow 
                count={20} 
                color="bg-green-400" 
                targetX={75} 
                targetY={50} 
                active={greenTraffic > 0} 
              />
            </div>

          </div>
        </main>

        {/* Deployment Progress Bar */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-full max-w-md space-y-2 z-30">
          <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase text-gray-600">
            <span>Deployment Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              animate={{ width: `${progress}%` }}
              className={`h-full ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
            />
          </div>
        </div>

        {/* Footer Info */}
        <footer className="z-30 grid grid-cols-3 gap-12 pt-8 border-t border-white/5">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-gray-600" />
              <h3 className="text-[10px] font-bold tracking-widest uppercase text-gray-500">System Metrics</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[9px] text-gray-600 uppercase mb-1">Latency</p>
                <p className="text-xl font-mono font-bold text-white">24ms</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-600 uppercase mb-1">Error Rate</p>
                <p className="text-xl font-mono font-bold text-green-500">0.00%</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center text-center px-8">
            <AnimatePresence mode="wait">
              <motion.p 
                key={currentPhase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xs leading-relaxed text-gray-500 italic"
              >
                "{config.description}"
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="flex flex-col justify-end items-end space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-gray-600" />
              <h3 className="text-[10px] font-bold tracking-widest uppercase text-gray-500">Security Status</h3>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">All Systems Nominal</span>
            </div>
          </div>
        </footer>

        {/* Phase Indicator Dots */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {PHASES.map((p, i) => {
            const isActive = (i === 0 && progress < 10) || (i === 1 && progress >= 10 && progress < 100) || (i === 2 && progress === 100);
            return (
              <div 
                key={p}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isActive ? 'bg-white scale-150 shadow-[0_0_8px_white]' : 'bg-white/10'}`}
              />
            );
          })}
        </div>

      </div>
    </div>
  );
}



import React, { useState, useEffect, useCallback } from 'react';
import DfaGraph from './components/DfaGraph';
import SatVisualizer from './components/SatVisualizer';
import ChatAssistant from './components/ChatAssistant';
import EducationalContent from './components/EducationalContent';
import ChallengePanel from './components/ChallengePanel';
import LandingPage from './components/LandingPage';
import { DfaConfig, AppTab, SimulationStep, Challenge, AppModule, Transition, DfaState, PnpMode, SatClause } from './types';
import { Play, RotateCcw, SkipForward, Plus, Trash2, BookOpen, Calculator, MonitorPlay, Pause, Trophy, Home, GitFork, Layers, ArrowRightLeft, ArrowRight, Settings2, Database, HardDrive, Network, Check, X, Palette, Braces, Sparkles } from 'lucide-react';

const INITIAL_DFA: DfaConfig = {
  states: [
    { id: 'q0', x: 150, y: 250, isAccept: false, isStart: true },
    { id: 'q1', x: 350, y: 150, isAccept: false, isStart: false },
    { id: 'q2', x: 350, y: 350, isAccept: true, isStart: false },
  ],
  transitions: [
    { source: 'q0', target: 'q1', symbol: '0' },
    { source: 'q0', target: 'q2', symbol: '1' },
    { source: 'q1', target: 'q0', symbol: '1' },
    { source: 'q1', target: 'q1', symbol: '0' },
    { source: 'q2', target: 'q2', symbol: '0' },
    { source: 'q2', target: 'q2', symbol: '1' },
  ],
  alphabet: ['0', '1']
};

const INITIAL_NFA: DfaConfig = {
    states: [
      { id: 'q0', x: 100, y: 250, isAccept: false, isStart: true },
      { id: 'q1', x: 300, y: 150, isAccept: false, isStart: false },
      { id: 'q2', x: 300, y: 350, isAccept: false, isStart: false },
      { id: 'q3', x: 500, y: 250, isAccept: true, isStart: false },
    ],
    transitions: [
      { source: 'q0', target: 'q1', symbol: 'ε' },
      { source: 'q0', target: 'q2', symbol: 'ε' },
      { source: 'q1', target: 'q3', symbol: '0' },
      { source: 'q2', target: 'q3', symbol: '1' },
    ],
    alphabet: ['0', '1', 'ε']
};

const INITIAL_PDA: DfaConfig = {
  states: [
    { id: 'q0', x: 150, y: 250, isAccept: false, isStart: true },
    { id: 'q1', x: 350, y: 250, isAccept: false, isStart: false },
    { id: 'q2', x: 550, y: 250, isAccept: true, isStart: false },
  ],
  transitions: [
    { source: 'q0', target: 'q1', symbol: '0', pop: 'ε', push: 'A' },
    { source: 'q1', target: 'q1', symbol: '0', pop: 'ε', push: 'A' },
    { source: 'q1', target: 'q2', symbol: '1', pop: 'A', push: 'ε' },
    { source: 'q2', target: 'q2', symbol: '1', pop: 'A', push: 'ε' },
  ],
  alphabet: ['0', '1']
};

// Simple TM: Flip bits (0->1, 1->0)
const INITIAL_TM: DfaConfig = {
    states: [
      { id: 'q0', x: 200, y: 250, isAccept: false, isStart: true },
      { id: 'halt', x: 500, y: 250, isAccept: true, isStart: false },
    ],
    transitions: [
      { source: 'q0', target: 'q0', symbol: '0', write: '1', direction: 'R' },
      { source: 'q0', target: 'q0', symbol: '1', write: '0', direction: 'R' },
      { source: 'q0', target: 'halt', symbol: 'B', write: 'B', direction: 'R' },
    ],
    alphabet: ['0', '1', 'B']
};

// Map of Australia (Graph Coloring)
const INITIAL_PNP: DfaConfig = {
    states: [
        { id: 'WA', x: 100, y: 200, isAccept: false, isStart: false },
        { id: 'NT', x: 250, y: 150, isAccept: false, isStart: false },
        { id: 'SA', x: 250, y: 280, isAccept: false, isStart: false },
        { id: 'Q', x: 400, y: 180, isAccept: false, isStart: false },
        { id: 'NSW', x: 450, y: 300, isAccept: false, isStart: false },
        { id: 'V', x: 350, y: 380, isAccept: false, isStart: false },
        { id: 'T', x: 400, y: 450, isAccept: false, isStart: false },
    ],
    transitions: [
        { source: 'WA', target: 'NT', symbol: '' }, { source: 'NT', target: 'WA', symbol: '' },
        { source: 'WA', target: 'SA', symbol: '' }, { source: 'SA', target: 'WA', symbol: '' },
        { source: 'NT', target: 'SA', symbol: '' }, { source: 'SA', target: 'NT', symbol: '' },
        { source: 'NT', target: 'Q', symbol: '' }, { source: 'Q', target: 'NT', symbol: '' },
        { source: 'SA', target: 'Q', symbol: '' }, { source: 'Q', target: 'SA', symbol: '' },
        { source: 'SA', target: 'NSW', symbol: '' }, { source: 'NSW', target: 'SA', symbol: '' },
        { source: 'SA', target: 'V', symbol: '' }, { source: 'V', target: 'SA', symbol: '' },
        { source: 'Q', target: 'NSW', symbol: '' }, { source: 'NSW', target: 'Q', symbol: '' },
        { source: 'NSW', target: 'V', symbol: '' }, { source: 'V', target: 'NSW', symbol: '' },
    ],
    alphabet: []
};

// 3-SAT Problem: (A v B) ^ (!A v C) ^ (!B v !C)
const INITIAL_SAT_CLAUSES: SatClause[] = [
  { id: 1, literals: [{ var: 'A', isNegated: false }, { var: 'B', isNegated: false }] },
  { id: 2, literals: [{ var: 'A', isNegated: true }, { var: 'C', isNegated: false }] },
  { id: 3, literals: [{ var: 'B', isNegated: true }, { var: 'C', isNegated: true }] },
];

// Presets for SAT
const SAT_PRESETS = {
  EASY: {
    vars: ['A', 'B'],
    clauses: [
      { id: 1, literals: [{ var: 'A', isNegated: false }, { var: 'B', isNegated: false }] },
      { id: 2, literals: [{ var: 'A', isNegated: true }, { var: 'B', isNegated: false }] }
    ]
  },
  HARD: {
    vars: ['A', 'B', 'C'],
    clauses: INITIAL_SAT_CLAUSES
  },
  UNSAT: {
    vars: ['A'],
    clauses: [
      { id: 1, literals: [{ var: 'A', isNegated: false }] },
      { id: 2, literals: [{ var: 'A', isNegated: true }] }
    ]
  }
};

const COLORS = ['#ef4444', '#22c55e', '#3b82f6']; // Red, Green, Blue

const THEME_CLASSES: Record<AppModule, { header: string, icon: string, accent: string, light: string, text: string, border: string }> = {
    [AppModule.DFA]: { header: 'bg-blue-900', icon: 'bg-blue-500', accent: 'bg-blue-600', light: 'bg-blue-100', text: 'text-blue-700', border: 'hover:border-blue-400' },
    [AppModule.NFA]: { header: 'bg-purple-900', icon: 'bg-purple-500', accent: 'bg-purple-600', light: 'bg-purple-100', text: 'text-purple-700', border: 'hover:border-purple-400' },
    [AppModule.PDA]: { header: 'bg-emerald-900', icon: 'bg-emerald-500', accent: 'bg-emerald-600', light: 'bg-emerald-100', text: 'text-emerald-700', border: 'hover:border-emerald-400' },
    [AppModule.TM]: { header: 'bg-rose-900', icon: 'bg-rose-500', accent: 'bg-rose-600', light: 'bg-rose-100', text: 'text-rose-700', border: 'hover:border-rose-400' },
    [AppModule.PNP]: { header: 'bg-indigo-900', icon: 'bg-indigo-500', accent: 'bg-indigo-600', light: 'bg-indigo-100', text: 'text-indigo-700', border: 'hover:border-indigo-200' },
    [AppModule.NFA_TO_DFA]: { header: 'bg-amber-900', icon: 'bg-amber-500', accent: 'bg-amber-600', light: 'bg-amber-100', text: 'text-amber-700', border: 'hover:border-amber-400' },
};

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [currentModule, setCurrentModule] = useState<AppModule>(AppModule.DFA);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.VISUALIZER);
  
  const [dfaConfig, setDfaConfig] = useState<DfaConfig>(INITIAL_DFA);
  const [nfaConfig, setNfaConfig] = useState<DfaConfig>(INITIAL_NFA);
  const [pdaConfig, setPdaConfig] = useState<DfaConfig>(INITIAL_PDA);
  const [tmConfig, setTmConfig] = useState<DfaConfig>(INITIAL_TM);
  const [pnpConfig, setPnpConfig] = useState<DfaConfig>(INITIAL_PNP);
  
  // PNP State
  const [pnpMode, setPnpMode] = useState<PnpMode>(PnpMode.GRAPH_COLORING);
  const [nodeColors, setNodeColors] = useState<Record<string, string>>({});
  const [selectedPnpColor, setSelectedPnpColor] = useState<string>(COLORS[0]);
  const [verificationResult, setVerificationResult] = useState<'valid' | 'invalid' | null>(null);
  const [solveHistory, setSolveHistory] = useState<any[]>([]); // Snapshots of backtracking
  
  // SAT State
  const [satVars, setSatVars] = useState<string[]>(['A', 'B', 'C']);
  const [satClauses, setSatClauses] = useState<SatClause[]>(INITIAL_SAT_CLAUSES);
  const [satAssignments, setSatAssignments] = useState<Record<string, boolean | null>>({ 'A': null, 'B': null, 'C': null });
  const [activeClauseIndex, setActiveClauseIndex] = useState<number | null>(null);
  const [isSatSolved, setIsSatSolved] = useState(false);

  // NFA to DFA Conversion State
  const [targetDfaConfig, setTargetDfaConfig] = useState<DfaConfig>({ states: [], transitions: [], alphabet: [] });
  const [conversionQueue, setConversionQueue] = useState<{id: string, nfaStates: string[]}[]>([]);
  const [conversionMapping, setConversionMapping] = useState<Record<string, string>>({}); 
  const [isConverting, setIsConverting] = useState(false);
  const [editTargetDfa, setEditTargetDfa] = useState(false); 

  // Determine which config is currently "Active"
  const activeConfig = 
    currentModule === AppModule.DFA ? dfaConfig 
    : currentModule === AppModule.NFA ? nfaConfig 
    : currentModule === AppModule.PDA ? pdaConfig 
    : currentModule === AppModule.TM ? tmConfig
    : currentModule === AppModule.PNP ? pnpConfig
    : (editTargetDfa ? targetDfaConfig : nfaConfig); 
  
  const setActiveConfig = (newConfig: DfaConfig | ((prev: DfaConfig) => DfaConfig)) => {
      if (currentModule === AppModule.DFA) setDfaConfig(newConfig);
      else if (currentModule === AppModule.NFA) setNfaConfig(newConfig);
      else if (currentModule === AppModule.PDA) setPdaConfig(newConfig);
      else if (currentModule === AppModule.TM) setTmConfig(newConfig);
      else if (currentModule === AppModule.PNP) setPnpConfig(newConfig);
      else {
          if (editTargetDfa) setTargetDfaConfig(newConfig);
          else setNfaConfig(newConfig);
      }
  };

  const [inputString, setInputString] = useState('0011');
  
  // Simulation State
  const [currentSimStates, setCurrentSimStates] = useState<string[]>([]);
  const [simIndex, setSimIndex] = useState(-1);
  const [stack, setStack] = useState<string[]>([]); // PDA
  const [tape, setTape] = useState<Record<number, string>>({}); // TM
  const [head, setHead] = useState(0); // TM
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [simResult, setSimResult] = useState<'PENDING' | 'ACCEPTED' | 'REJECTED' | 'INVALID'>('PENDING');

  // Input Controls State
  const [newStateName, setNewStateName] = useState('');
  const [newTransSource, setNewTransSource] = useState('');
  const [newTransTarget, setNewTransTarget] = useState('');
  const [newTransSymbol, setNewTransSymbol] = useState('');
  const [newTransPop, setNewTransPop] = useState('');
  const [newTransPush, setNewTransPush] = useState('');
  // TM specific inputs
  const [newTransWrite, setNewTransWrite] = useState('');
  const [newTransDir, setNewTransDir] = useState<'L' | 'R'>('R');

  const handleStateDrag = useCallback((id: string, x: number, y: number) => {
    setActiveConfig(prev => ({
      ...prev,
      states: prev.states.map(s => s.id === id ? { ...s, x, y } : s)
    }));
  }, [currentModule, editTargetDfa]);

  const getEpsilonClosure = useCallback((startStates: string[], config: DfaConfig): string[] => {
      const closure = new Set<string>(startStates);
      const stack = [...startStates];
      while (stack.length > 0) {
          const currentStateId = stack.pop()!;
          const epsilonTransitions = config.transitions.filter(
              t => t.source === currentStateId && (t.symbol === 'ε' || t.symbol === '') && !t.pop && !t.push
          );
          for (const t of epsilonTransitions) {
              if (!closure.has(t.target)) {
                  closure.add(t.target);
                  stack.push(t.target);
              }
          }
      }
      return Array.from(closure);
  }, []);

  // --- PNP Graph Coloring Logic ---
  const handleNodeClick = useCallback((id: string) => {
      if (currentModule !== AppModule.PNP || pnpMode !== PnpMode.GRAPH_COLORING) return;
      
      // Update pnpConfig states directly with the selected color
      setPnpConfig(prev => ({
          ...prev,
          states: prev.states.map(s => s.id === id ? { ...s, color: selectedPnpColor } : s)
      }));
      setVerificationResult(null);
  }, [currentModule, pnpMode, selectedPnpColor]);

  const verifyGraphColoring = () => {
      let isValid = true;
      for (const t of pnpConfig.transitions) {
          // Use colors from config state, falling back to empty string
          const c1 = pnpConfig.states.find(s => s.id === t.source)?.color;
          const c2 = pnpConfig.states.find(s => s.id === t.target)?.color;
          
          // Nodes must be colored and colors must differ
          if (!c1 || !c2 || c1 === c2) {
              isValid = false;
              break;
          }
      }
      setVerificationResult(isValid ? 'valid' : 'invalid');
  };

  const solveGraphColoring = async () => {
      const nodes = pnpConfig.states.map(s => s.id);
      const adjacency: Record<string, string[]> = {};
      nodes.forEach(n => adjacency[n] = []);
      pnpConfig.transitions.forEach(t => {
          adjacency[t.source].push(t.target);
          adjacency[t.target].push(t.source);
      });

      const history: any[] = [];
      const solve = (index: number, currentColors: Record<string, string>): boolean => {
          if (index === nodes.length) {
              history.push({ colors: { ...currentColors } });
              return true;
          }
          const node = nodes[index];
          for (const color of COLORS) {
              const isSafe = adjacency[node].every(neighbor => currentColors[neighbor] !== color);
              if (isSafe) {
                  const nextColors = { ...currentColors, [node]: color };
                  history.push({ colors: nextColors });
                  if (solve(index + 1, nextColors)) return true;
              }
          }
          history.push({ colors: { ...currentColors } }); // Backtrack visualization step
          return false;
      };

      setSolveHistory([]);
      solve(0, {});
      setSolveHistory(history);
      setIsPlaying(true);
      setSimIndex(0);
  };

  // --- PNP SAT Logic ---
  const toggleSatVariable = (variable: string) => {
      setSatAssignments(prev => {
          const val = prev[variable];
          return { ...prev, [variable]: val === null ? true : (val === true ? false : null) };
      });
  };

  // Check satisfaction
  useEffect(() => {
    if (currentModule === AppModule.PNP && pnpMode === PnpMode.SAT) {
        const check = () => {
             for (const clause of satClauses) {
                 let clauseMet = false;
                 for (const lit of clause.literals) {
                     const val = satAssignments[lit.var];
                     const effective = lit.isNegated ? (val === false) : (val === true);
                     if (effective) { clauseMet = true; break; }
                 }
                 if (!clauseMet) return false;
             }
             return true;
        }
        setIsSatSolved(check());
    }
  }, [satAssignments, satClauses, currentModule, pnpMode]);

  const loadSatPreset = (preset: 'EASY' | 'HARD' | 'UNSAT') => {
      const p = SAT_PRESETS[preset];
      setSatVars(p.vars);
      setSatClauses(p.clauses);
      const initial: Record<string, boolean | null> = {};
      p.vars.forEach(v => initial[v] = null);
      setSatAssignments(initial);
      resetSimulation();
  };

  const solveSat = async () => {
      const vars = [...satVars];
      const history: any[] = [];
      
      const checkClause = (clause: SatClause, assignments: Record<string, boolean | null>) => {
          for (const lit of clause.literals) {
              const val = assignments[lit.var];
              if (val === null) return null; // Clause undetermined
              const effective = lit.isNegated ? !val : val;
              if (effective) return true; // Clause satisfied
          }
          return false; // All literals false
      };

      const solve = (vIndex: number, currentAssignments: Record<string, boolean | null>): boolean => {
          // Check all clauses with current full/partial assignment
          for (let i = 0; i < satClauses.length; i++) {
              const res = checkClause(satClauses[i], currentAssignments);
              if (res === false) {
                  // Conflict found, highlight this clause in animation
                  history.push({ assignments: { ...currentAssignments }, activeClause: i });
                  return false;
              }
          }

          if (vIndex === vars.length) {
              history.push({ assignments: { ...currentAssignments }, activeClause: null, found: true });
              return true; 
          }

          const v = vars[vIndex];
          
          // Try True
          const assignTrue = { ...currentAssignments, [v]: true };
          history.push({ assignments: assignTrue, activeClause: null });
          if (solve(vIndex + 1, assignTrue)) return true;

          // Try False
          const assignFalse = { ...currentAssignments, [v]: false };
          history.push({ assignments: assignFalse, activeClause: null });
          if (solve(vIndex + 1, assignFalse)) return true;

          // Backtrack
          const assignNull = { ...currentAssignments, [v]: null };
          history.push({ assignments: assignNull, activeClause: null });
          return false;
      };

      const initial: Record<string, boolean | null> = {};
      vars.forEach(v => initial[v] = null);
      solve(0, initial);
      
      setSolveHistory(history);
      setIsPlaying(true);
      setSimIndex(0);
  };

  // --- NFA to DFA Logic ---
  const startConversion = () => {
    const startNode = nfaConfig.states.find(s => s.isStart);
    if(!startNode) return;
    const startClosure = getEpsilonClosure([startNode.id], nfaConfig);
    const startKey = startClosure.sort().join(',');
    const startDfaState: DfaState = { 
      id: 'S0', x: 150, y: 150, 
      isAccept: startClosure.some(id => nfaConfig.states.find(s=>s.id===id)?.isAccept), isStart: true 
    };
    setTargetDfaConfig({ states: [startDfaState], transitions: [], alphabet: nfaConfig.alphabet.filter(s => s !== 'ε') });
    setConversionQueue([{ id: 'S0', nfaStates: startClosure }]);
    setConversionMapping({ [startKey]: 'S0' });
    setIsConverting(true);
    setCurrentSimStates(startClosure); 
  };

  const nextConversionStep = () => {
    if (conversionQueue.length === 0) {
        setIsConverting(false); setCurrentSimStates([]); return;
    }
    const current = conversionQueue[0];
    const { id: sourceDfaId, nfaStates } = current;
    const newTransitions: Transition[] = [];
    const newStates: DfaState[] = [];
    const newQueueItems: any[] = [];
    const newMap = { ...conversionMapping };
    const symbols = nfaConfig.alphabet.filter(s => s !== 'ε');
    
    symbols.forEach(symbol => {
        const moveTargets = new Set<string>();
        nfaStates.forEach(nfaId => {
            nfaConfig.transitions.filter(t => t.source === nfaId && t.symbol === symbol).forEach(t => moveTargets.add(t.target));
        });
        const closure = getEpsilonClosure(Array.from(moveTargets), nfaConfig);
        if (closure.length === 0) return;
        
        const key = closure.sort().join(',');
        let targetDfaId = newMap[key];
        
        if (!targetDfaId) {
            const existingCount = targetDfaConfig.states.length + newStates.length;
            targetDfaId = `S${existingCount}`;
            newMap[key] = targetDfaId;
            const isAccept = closure.some(id => nfaConfig.states.find(s=>s.id===id)?.isAccept);
            const col = existingCount % 4;
            const row = Math.floor(existingCount / 4);
            newStates.push({
                id: targetDfaId, x: 100 + col * 180, y: 100 + row * 150, isAccept, isStart: false
            });
            newQueueItems.push({ id: targetDfaId, nfaStates: closure });
        }
        newTransitions.push({ source: sourceDfaId, target: targetDfaId, symbol });
    });
    
    setTargetDfaConfig(prev => ({ ...prev, states: [...prev.states, ...newStates], transitions: [...prev.transitions, ...newTransitions] }));
    setConversionMapping(newMap);
    const nextQueue = [...conversionQueue.slice(1), ...newQueueItems];
    setConversionQueue(nextQueue);
    if (nextQueue.length > 0) setCurrentSimStates(nextQueue[0].nfaStates);
    else { setCurrentSimStates([]); setIsConverting(false); }
  };

  const resetConversion = () => {
      setTargetDfaConfig({ states: [], transitions: [], alphabet: [] });
      setConversionQueue([]);
      setConversionMapping({});
      setIsConverting(false);
      setCurrentSimStates([]);
  };

  // --- Simulation Engine ---
  const stepSimulation = useCallback(() => {
    if (currentModule === AppModule.NFA_TO_DFA) return; 

    // PNP Backtracking Step
    if (currentModule === AppModule.PNP) {
        if (simIndex < solveHistory.length) {
            const step = solveHistory[simIndex];
            if (pnpMode === PnpMode.GRAPH_COLORING) {
                setNodeColors(step.colors);
            } else {
                setSatAssignments(step.assignments);
                setActiveClauseIndex(step.activeClause);
            }
            setSimIndex(prev => prev + 1);
        } else {
            setIsPlaying(false);
            if (pnpMode === PnpMode.GRAPH_COLORING) setVerificationResult('valid');
        }
        return;
    }

    // Initial Start
    if (simIndex === -1) {
      const startNode = activeConfig.states.find(s => s.isStart);
      if (!startNode) return;
      
      let initialStates = [startNode.id];
      if (currentModule === AppModule.NFA) {
          initialStates = getEpsilonClosure(initialStates, activeConfig);
      }
      
      setCurrentSimStates(initialStates);
      setStack([]);
      
      // Init TM Tape
      if (currentModule === AppModule.TM) {
          const tapeObj: Record<number, string> = {};
          inputString.split('').forEach((char, i) => tapeObj[i] = char);
          setTape(tapeObj);
          setHead(0);
      }
      
      setSimIndex(0);
      return;
    }

    // --- Turing Machine Logic ---
    if (currentModule === AppModule.TM) {
        if (currentSimStates.length === 0) {
            setIsPlaying(false); return;
        }
        const currentStateId = currentSimStates[0];
        const currentState = activeConfig.states.find(s => s.id === currentStateId);
        if (currentState?.isAccept) { setSimResult('ACCEPTED'); setIsPlaying(false); return; }
        const readSymbol = tape[head] || 'B';
        const transition = activeConfig.transitions.find(t => t.source === currentStateId && t.symbol === readSymbol);
        if (transition) {
            const newTape = { ...tape };
            if (transition.write && transition.write !== 'B') newTape[head] = transition.write;
            else delete newTape[head];
            setTape(newTape);
            setHead(prev => transition.direction === 'L' ? prev - 1 : prev + 1);
            setCurrentSimStates([transition.target]);
        } else {
            setSimResult('REJECTED'); setIsPlaying(false);
        }
        return;
    }

    // --- DFA/NFA/PDA Input Bound Logic ---
    if (simIndex >= inputString.length) {
         const isAccepted = currentSimStates.some(id => activeConfig.states.find(s => s.id === id)?.isAccept);
         setSimResult(isAccepted ? 'ACCEPTED' : 'REJECTED');
         setIsPlaying(false);
         return;
    }

    const char = inputString[simIndex];
    
    // --- PDA Logic ---
    if (currentModule === AppModule.PDA) {
        if (currentSimStates.length === 0) { setSimResult('REJECTED'); setIsPlaying(false); return; }
        const currentState = currentSimStates[0];
        let transition = null;
        let consumedInput = false;

        if (char !== undefined) {
            transition = activeConfig.transitions.find(t => {
                const symbolMatch = t.symbol === char;
                const topStack = stack.length > 0 ? stack[stack.length - 1] : null;
                const popMatch = !t.pop || t.pop === 'ε' || t.pop === topStack;
                return t.source === currentState && symbolMatch && popMatch;
            });
            if (transition) consumedInput = true;
        }
        if (!transition) {
             transition = activeConfig.transitions.find(t => {
                const symbolMatch = t.symbol === 'ε' || t.symbol === '';
                const topStack = stack.length > 0 ? stack[stack.length - 1] : null;
                const popMatch = !t.pop || t.pop === 'ε' || t.pop === topStack;
                return t.source === currentState && symbolMatch && popMatch;
            });
        }
        if (transition) {
            const newStack = [...stack];
            if (transition.pop && transition.pop !== 'ε') newStack.pop();
            if (transition.push && transition.push !== 'ε') newStack.push(transition.push);
            setStack(newStack);
            setCurrentSimStates([transition.target]);
            if (consumedInput) setSimIndex(simIndex + 1);
        } else {
            const isAccept = activeConfig.states.find(s => s.id === currentState)?.isAccept;
            if (simIndex === inputString.length) setSimResult(isAccept ? 'ACCEPTED' : 'REJECTED');
            else setSimResult('REJECTED');
            setIsPlaying(false);
        }
        return;
    }

    // --- DFA / NFA Logic ---
    const currentStates = currentSimStates;
    let nextStates: string[] = [];
    if (currentModule === AppModule.DFA) {
        if (currentStates.length === 1) {
            const currentState = currentStates[0];
            const transition = activeConfig.transitions.find(t => t.source === currentState && t.symbol === char);
            if (transition) nextStates.push(transition.target);
        }
    } else { // NFA
        const directTargets = new Set<string>();
        currentStates.forEach(sourceId => {
            const transitions = activeConfig.transitions.filter(t => t.source === sourceId && t.symbol === char);
            transitions.forEach(t => directTargets.add(t.target));
        });
        const closure = getEpsilonClosure(Array.from(directTargets), activeConfig);
        nextStates = closure;
    }
    if (nextStates.length > 0) {
      setCurrentSimStates(nextStates);
      setSimIndex(simIndex + 1);
    } else {
      setCurrentSimStates([]); setSimResult('REJECTED'); setIsPlaying(false);
    }
  }, [activeConfig, inputString, simIndex, currentSimStates, currentModule, stack, tape, head, getEpsilonClosure, solveHistory, pnpMode]);

  useEffect(() => {
    let interval: number;
    if (isPlaying && simResult === 'PENDING') {
      const intervalTime = currentModule === AppModule.TM ? 800 : (currentModule === AppModule.PNP ? 800 : 1500);
      interval = window.setInterval(stepSimulation, intervalTime);
    }
    return () => window.clearInterval(interval);
  }, [isPlaying, stepSimulation, simResult, currentModule]);

  const resetSimulation = () => {
    setIsPlaying(false);
    setSimIndex(-1);
    setCurrentSimStates([]);
    setStack([]);
    setTape({});
    setHead(0);
    setSimResult('PENDING');
    if (currentModule === AppModule.PNP) {
        if (pnpMode === PnpMode.GRAPH_COLORING) {
            setNodeColors({});
            setVerificationResult(null);
        } else {
             setSatAssignments({ 'A': null, 'B': null, 'C': null });
             setActiveClauseIndex(null);
             setIsSatSolved(false);
        }
    }
  };

  const handleStartModule = (module: AppModule) => {
      setCurrentModule(module);
      setShowLanding(false);
      resetSimulation();
      setActiveTab(AppTab.VISUALIZER);
      setInputString(module === AppModule.PDA ? '0011' : (module === AppModule.TM ? '0011' : '01'));
      if (module === AppModule.NFA_TO_DFA) resetConversion();
  };

  const handleStartChallenge = (challenge: Challenge) => {
      if (challenge.module === AppModule.PNP && challenge.satConfig) {
          setPnpMode(PnpMode.SAT);
          setSatVars(challenge.satConfig.vars);
          setSatClauses(challenge.satConfig.clauses);
          const initial: Record<string, boolean | null> = {};
          challenge.satConfig.vars.forEach(v => initial[v] = null);
          setSatAssignments(initial);
          resetSimulation();
      }
      // For other modules, the challenge panel mostly guides the user construction
  };

  // --- Editor Helpers ---
  const addStateWithId = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (activeConfig.states.some(s => s.id === trimmed)) { alert("State ID must be unique."); return; }
    resetSimulation();
    setActiveConfig(prev => ({
      ...prev, states: [...prev.states, { id: trimmed, x: Math.random() * 300 + 50, y: Math.random() * 150 + 50, isAccept: false, isStart: false }]
    }));
  };

  const addState = () => { addStateWithId(newStateName); setNewStateName(''); };
  const deleteState = (id: string) => {
    resetSimulation();
    setActiveConfig(prev => ({
      ...prev, states: prev.states.filter(s => s.id !== id), transitions: prev.transitions.filter(t => t.source !== id && t.target !== id)
    }));
  };
  const addTransitionExplicit = (source: string, target: string, symbol: string, pop?: string, push?: string, write?: string, direction?: 'L'|'R') => {
      if (!source || !target) return;
      setActiveConfig(prev => ({
        ...prev, transitions: [...prev.transitions, { source, target, symbol, pop, push, write, direction }]
      }));
  };
  const addTransition = () => {
    addTransitionExplicit(newTransSource, newTransTarget, newTransSymbol, newTransPop, newTransPush, newTransWrite, newTransDir);
    setNewTransSymbol(''); setNewTransPop(''); setNewTransPush(''); setNewTransWrite('');
  };
  const deleteTransition = (index: number) => {
      setActiveConfig(prev => ({ ...prev, transitions: prev.transitions.filter((_, idx) => idx !== index) }));
  };
  const toggleAcceptState = (id: string) => {
    setActiveConfig(prev => ({ ...prev, states: prev.states.map(s => s.id === id ? { ...s, isAccept: !s.isAccept } : s) }));
  };

  const theme = THEME_CLASSES[currentModule];
  const isSplitView = currentModule === AppModule.NFA_TO_DFA;

  if (showLanding) { return <LandingPage onStart={handleStartModule} />; }

  return (
    <div className="flex flex-col h-screen overflow-hidden animate-fadeIn">
      {/* Header */}
      <header className={`h-16 text-white flex items-center px-6 justify-between shrink-0 shadow-lg z-20 relative transition-colors ${theme.header}`}>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowLanding(true)} className="p-2 -ml-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <Home size={20} />
          </button>
          <div className="h-6 w-px bg-white/20"></div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold font-mono shadow-inner shadow-black/20 ${theme.icon}`}>
              {currentModule === AppModule.NFA_TO_DFA ? <ArrowRightLeft size={20}/> : 
               currentModule === AppModule.TM ? <HardDrive size={20}/> : 
               currentModule === AppModule.PDA ? <Layers size={20}/> :
               currentModule === AppModule.NFA ? <GitFork size={20}/> :
               currentModule === AppModule.PNP ? <Network size={20}/> :
               <Play size={20}/>}
            </div>
            <h1 className="text-lg font-bold tracking-tight hidden md:block">
              {currentModule === AppModule.PDA ? 'Pushdown Automata' : (currentModule === AppModule.NFA ? 'NFA Visualizer' : (currentModule === AppModule.NFA_TO_DFA ? 'NFA → DFA' : (currentModule === AppModule.TM ? 'Turing Machine' : (currentModule === AppModule.PNP ? 'P vs NP' : 'DFA Master'))))}
            </h1>
          </div>
        </div>
        <nav className="flex gap-1 md:gap-2">
          {[
            { id: AppTab.VISUALIZER, icon: MonitorPlay, label: 'Playground' },
            { id: AppTab.CHALLENGES, icon: Trophy, label: 'Challenges' },
            { id: AppTab.DEFINITION, icon: Calculator, label: 'Definition' },
            { id: AppTab.THEORY, icon: BookOpen, label: 'Theory' },
          ]
          .filter(tab => !(currentModule === AppModule.NFA_TO_DFA && tab.id === AppTab.CHALLENGES))
          .map(tab => (
             <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white/20 text-white shadow-md' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
             >
                <tab.icon size={16} /> <span className="hidden sm:inline">{tab.label}</span>
             </button>
          ))}
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className={`flex-1 relative flex flex-col ${activeTab !== AppTab.VISUALIZER && activeTab !== AppTab.CHALLENGES ? 'hidden md:flex' : 'w-full'} ${activeTab === AppTab.VISUALIZER ? 'md:w-1/2 border-r border-slate-200' : 'md:w-1/2'}`}>
          
          {isSplitView && activeTab === AppTab.VISUALIZER ? (
            <div className="flex flex-col h-full bg-slate-100">
                <div className="flex-1 relative border-b border-slate-300">
                    <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur px-2 py-1 rounded shadow border border-purple-200">
                        <span className="text-[10px] font-bold uppercase text-purple-600 flex items-center gap-1"><GitFork size={12}/> Source NFA</span>
                    </div>
                    <DfaGraph 
                        config={nfaConfig} 
                        activeStateIds={currentSimStates} 
                        onStateDragEnd={(id, x, y) => setNfaConfig(prev => ({...prev, states: prev.states.map(s => s.id === id ? {...s, x, y} : s)}))} 
                    />
                </div>
                <div className="h-14 bg-white border-b border-slate-300 flex items-center px-4 justify-between shrink-0 shadow-sm z-10">
                   <div className="flex items-center gap-2 text-sm text-slate-600">
                        <ArrowRightLeft size={16} className="text-amber-500"/>
                        <span className="font-semibold">Subset Construction</span>
                        <span className="text-xs text-slate-400 border-l pl-2 ml-2">{isConverting ? `Processing: ${conversionQueue[0]?.id || 'Finish'}` : 'Ready'}</span>
                   </div>
                   <div className="flex gap-2">
                        {!isConverting && targetDfaConfig.states.length < 2 && (
                            <button onClick={startConversion} className="flex items-center gap-2 px-3 py-1.5 bg-amber-600 text-white rounded hover:bg-amber-700 text-xs font-bold uppercase tracking-wide">
                                <Play size={14}/> Start
                            </button>
                        )}
                        {isConverting && (
                            <button onClick={nextConversionStep} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-bold uppercase tracking-wide">
                                <SkipForward size={14}/> Step
                            </button>
                        )}
                        <button onClick={resetConversion} className="p-1.5 border border-slate-300 text-slate-600 rounded hover:bg-slate-100" title="Reset">
                            <RotateCcw size={16}/>
                        </button>
                   </div>
                </div>
                <div className="flex-1 relative">
                    <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur px-2 py-1 rounded shadow border border-amber-200">
                        <span className="text-[10px] font-bold uppercase text-amber-600 flex items-center gap-1"><Database size={12}/> Target DFA</span>
                    </div>
                    <DfaGraph 
                        config={targetDfaConfig} 
                        activeStateIds={[]} 
                        onStateDragEnd={(id, x, y) => setTargetDfaConfig(prev => ({...prev, states: prev.states.map(s => s.id === id ? {...s, x, y} : s)}))} 
                    />
                </div>
            </div>
          ) : (
            <>
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur p-3 rounded-lg shadow border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                    {currentModule !== AppModule.PNP ? (
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                            simResult === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' :
                            simResult === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                        }`}>{simResult}</span>
                    ) : (
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                            pnpMode === PnpMode.GRAPH_COLORING ? (
                                verificationResult === 'valid' ? 'bg-emerald-100 text-emerald-700' :
                                verificationResult === 'invalid' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                            ) : (
                                isSatSolved ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                            )
                        }`}>
                            {pnpMode === PnpMode.GRAPH_COLORING 
                                ? (verificationResult ? (verificationResult === 'valid' ? 'Valid Coloring' : 'Conflict Found') : 'Unverified') 
                                : (isSatSolved ? 'Formula Satisfied!' : 'SAT Solver')}
                        </span>
                    )}
                    
                    {currentModule !== AppModule.PNP && <span className="font-mono text-sm">State: <span className={`font-bold ${theme.text}`}>{currentSimStates.join(', ') || '∅'}</span></span>}
                    </div>

                    {currentModule === AppModule.PDA && (
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Stack</span>
                            <div className="flex flex-col-reverse items-center bg-slate-100 w-12 h-24 rounded border border-slate-300 p-1 overflow-hidden">
                                {stack.map((item, i) => (
                                    <div key={i} className="w-full text-center text-xs font-mono bg-emerald-200 border-b border-white py-0.5">{item}</div>
                                ))}
                                {stack.length === 0 && <span className="text-[10px] text-slate-400 mt-auto">Empty</span>}
                            </div>
                        </div>
                    )}
                    
                    {currentModule === AppModule.TM && (
                         <div className="flex flex-col gap-1 w-64">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Infinite Tape</span>
                            <div className="relative h-12 bg-slate-100 rounded border border-slate-300 flex items-center overflow-hidden">
                                <div className="absolute left-1/2 -ml-3 top-0 bottom-0 w-6 border-2 border-rose-500 bg-rose-100/30 z-10 pointer-events-none"></div>
                                <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(calc(50% - ${head * 24}px - 12px))` }}>
                                    {Array.from({ length: Math.max(inputString.length + 5, head + 5) }).map((_, i) => (
                                        <div key={i} className="w-6 h-8 flex items-center justify-center border-r border-slate-200 font-mono text-sm shrink-0">
                                            {tape[i] || 'B'}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="text-[10px] text-center text-slate-400">Head Position: {head}</div>
                        </div>
                    )}

                    {simIndex >= 0 && currentModule !== AppModule.TM && currentModule !== AppModule.PNP && (
                    <div className="mt-2 font-mono text-lg bg-slate-100 p-2 rounded flex gap-1 justify-center max-w-[200px] overflow-x-auto">
                        {inputString.split('').map((c, i) => (
                        <span key={i} className={`w-6 text-center ${i === simIndex ? 'bg-yellow-400 font-bold' : i < simIndex ? 'text-slate-400' : 'text-slate-800'}`}>{c}</span>
                        ))}
                    </div>
                    )}
                    
                    {currentModule === AppModule.PNP && pnpMode === PnpMode.GRAPH_COLORING && (
                        <div className="text-xs text-slate-500 mt-1 max-w-[150px]">
                            Select a color on the right, then click nodes to paint.
                        </div>
                    )}
                </div>
                
                {currentModule === AppModule.PNP && pnpMode === PnpMode.SAT ? (
                    <div className="relative w-full h-full">
                        <SatVisualizer 
                            variables={satVars}
                            clauses={satClauses}
                            assignments={satAssignments}
                            activeClauseIndex={activeClauseIndex}
                            onToggleVariable={toggleSatVariable}
                            isSolving={isPlaying}
                        />
                        {isSatSolved && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-fadeIn">
                                <div className="bg-white/90 backdrop-blur border border-emerald-300 p-6 rounded-2xl shadow-xl flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 animate-bounce">
                                        <Sparkles size={32}/>
                                    </div>
                                    <h3 className="text-xl font-bold text-emerald-800">Solved!</h3>
                                    <p className="text-sm text-slate-600">All clauses satisfied.</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <DfaGraph 
                        config={activeConfig} 
                        activeStateIds={currentSimStates} 
                        onStateDragEnd={handleStateDrag} 
                        nodeColors={currentModule === AppModule.PNP ? nodeColors : undefined}
                        isUndirected={currentModule === AppModule.PNP}
                        onStateClick={currentModule === AppModule.PNP ? handleNodeClick : undefined}
                    />
                )}
                
                <div className="h-20 bg-white border-t border-slate-200 flex items-center px-6 gap-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                
                {currentModule === AppModule.PNP ? (
                     <div className="flex gap-4 items-center w-full">
                         <div className="flex gap-1 items-center mr-auto">
                            <span className="text-xs font-bold text-slate-500 uppercase mr-2">Mode:</span>
                            {pnpMode === PnpMode.GRAPH_COLORING ? (
                                <>
                                <button onClick={solveGraphColoring} disabled={isPlaying} className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm font-bold flex items-center gap-1 hover:bg-indigo-700 disabled:opacity-50"><Network size={16}/> Solve (NP)</button>
                                </>
                            ) : (
                                <button onClick={solveSat} disabled={isPlaying} className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm font-bold flex items-center gap-1 hover:bg-indigo-700 disabled:opacity-50"><Braces size={16}/> Solve SAT (NP)</button>
                            )}
                            <button onClick={resetSimulation} className="p-1.5 border border-slate-300 text-slate-600 rounded hover:bg-slate-100 ml-2" title="Reset"><RotateCcw size={16}/></button>
                         </div>
                         <div className="text-xs text-slate-400">
                             {isPlaying ? `Backtracking Step: ${simIndex}` : (verificationResult ? `Result: ${verificationResult.toUpperCase()}` : 'Ready')}
                         </div>
                     </div>
                ) : (
                    <>
                        <input type="text" value={inputString} onChange={(e) => { setInputString(e.target.value); resetSimulation(); }} placeholder="Input..." className="border border-slate-300 rounded px-3 py-2 font-mono w-40 focus:ring-2 focus:ring-blue-500 outline-none" />
                        <div className="flex gap-2">
                            <button onClick={resetSimulation} className="p-2 hover:bg-slate-100 rounded text-slate-600"><RotateCcw size={20}/></button>
                            <button onClick={stepSimulation} className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-slate-50 text-slate-700"><SkipForward size={18}/> Step</button>
                            <button onClick={() => setIsPlaying(!isPlaying)} className={`flex items-center gap-2 px-6 py-2 rounded text-white ${isPlaying ? 'bg-amber-500' : theme.accent}`}>{isPlaying ? <Pause size={18}/> : <Play size={18}/>} {isPlaying ? 'Pause' : 'Run'}</button>
                        </div>
                    </>
                )}
                
                </div>
            </>
          )}
        </div>

        {/* Right Panel */}
        <div className={`bg-slate-50 border-l border-slate-200 flex flex-col ${activeTab === AppTab.VISUALIZER || activeTab === AppTab.CHALLENGES ? 'hidden md:flex' : 'flex'} w-full md:w-[400px]`}>
           <div className="flex-1 overflow-hidden relative flex flex-col">
             
             {/* Challenge Mode */}
             {activeTab === AppTab.CHALLENGES && <ChallengePanel dfa={activeConfig} module={currentModule} onStartChallenge={handleStartChallenge} onAddState={addStateWithId} onDeleteState={deleteState} onAddTransition={addTransitionExplicit} onDeleteTransition={deleteTransition} onToggleAccept={toggleAcceptState} />}
             
             {/* Visualizer Mode (Editor) */}
             {activeTab === AppTab.VISUALIZER && (
                <div className="h-full flex flex-col">
                    <div className="p-4 overflow-y-auto flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                <Settings2 size={18}/> 
                                {isSplitView ? 'Editor' : `Edit ${currentModule === AppModule.PNP ? 'Graph' : currentModule}`}
                            </h2>
                        </div>

                        {/* PNP Mode Toggle */}
                        {currentModule === AppModule.PNP && (
                            <div className="bg-slate-200 p-1 rounded-lg flex mb-6">
                                <button 
                                    onClick={() => { setPnpMode(PnpMode.GRAPH_COLORING); resetSimulation(); }}
                                    className={`flex-1 text-xs font-bold py-1.5 rounded-md transition-all flex items-center justify-center gap-2 ${pnpMode === PnpMode.GRAPH_COLORING ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Palette size={12}/> Graph Coloring
                                </button>
                                <button 
                                    onClick={() => { setPnpMode(PnpMode.SAT); resetSimulation(); }}
                                    className={`flex-1 text-xs font-bold py-1.5 rounded-md transition-all flex items-center justify-center gap-2 ${pnpMode === PnpMode.SAT ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Braces size={12}/> SAT Problem
                                </button>
                            </div>
                        )}

                        {/* NFA to DFA: Target Toggle */}
                        {isSplitView && (
                            <div className="bg-slate-200 p-1 rounded-lg flex mb-6">
                                <button 
                                    onClick={() => setEditTargetDfa(false)}
                                    className={`flex-1 text-xs font-bold py-1.5 rounded-md transition-all flex items-center justify-center gap-2 ${!editTargetDfa ? 'bg-white shadow text-purple-700' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <GitFork size={12}/> Source NFA
                                </button>
                                <button 
                                    onClick={() => setEditTargetDfa(true)}
                                    className={`flex-1 text-xs font-bold py-1.5 rounded-md transition-all flex items-center justify-center gap-2 ${editTargetDfa ? 'bg-white shadow text-amber-700' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Database size={12}/> Target DFA
                                </button>
                            </div>
                        )}
                        
                        {/* Editor Controls for Automata/Graph */}
                        {!(currentModule === AppModule.PNP && pnpMode === PnpMode.SAT) && (
                            <>
                            {currentModule === AppModule.PNP && pnpMode === PnpMode.GRAPH_COLORING && (
                                <div className="mb-6 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                                    <h3 className="text-xs font-bold text-indigo-800 uppercase mb-2 text-center">Color Palette</h3>
                                    <div className="flex gap-4 justify-center">
                                        {COLORS.map((c, i) => (
                                            <button
                                                key={c}
                                                onClick={() => setSelectedPnpColor(c)}
                                                className={`w-8 h-8 rounded-full border-2 shadow-sm transition-all ${selectedPnpColor === c ? 'border-slate-800 ring-2 ring-slate-300 ring-offset-1 scale-110' : 'border-transparent hover:scale-110 hover:shadow-md'}`}
                                                style={{ backgroundColor: c }}
                                                title={i === 0 ? "Red" : i === 1 ? "Green" : "Blue"}
                                            >
                                                {selectedPnpColor === c && <Check size={14} className="text-white mx-auto stroke-[3]"/>}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-2 text-center text-[10px] font-medium text-indigo-600">Active Color</div>
                                </div>
                            )}

                            <div className="flex gap-2 mb-6">
                            <input value={newStateName} onChange={e => setNewStateName(e.target.value)} placeholder={currentModule === AppModule.PNP ? "Node ID (e.g. A)" : "State (e.g. q0)"} className="flex-1 px-3 py-2 border rounded text-sm" />
                            <button 
                                onClick={addState} 
                                disabled={!newStateName} 
                                className={`px-3 py-2 ${theme.light} ${theme.text} rounded text-sm hover:bg-slate-200 disabled:opacity-50`}
                            >
                                <Plus size={16}/>
                            </button>
                            </div>
                            
                            {/* Transitions */}
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Add {currentModule === AppModule.PNP ? 'Edge' : 'Transition'}</h3>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    <select value={newTransSource} onChange={e => setNewTransSource(e.target.value)} className="w-16 p-1 border rounded text-xs"><option value="">Src</option>{activeConfig.states.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}</select>
                                    {currentModule !== AppModule.PNP && (
                                        <div className="relative">
                                            <input 
                                                value={newTransSymbol} 
                                                onChange={e => setNewTransSymbol(e.target.value)} 
                                                placeholder="σ" 
                                                className="w-10 p-1 border rounded text-xs text-center" 
                                            />
                                            {(currentModule === AppModule.NFA || (currentModule === AppModule.NFA_TO_DFA && !editTargetDfa)) && (
                                            <button
                                                onClick={() => setNewTransSymbol('ε')}
                                                className={`absolute -top-4 left-0 w-full text-[9px] text-${currentModule === AppModule.NFA ? 'purple' : 'amber'}-600 font-bold hover:underline`}
                                                title="Insert Epsilon"
                                            >
                                                +ε
                                            </button>
                                            )}
                                        </div>
                                    )}
                                    {currentModule === AppModule.PDA && (
                                        <>
                                            <input value={newTransPop} onChange={e => setNewTransPop(e.target.value)} placeholder="Pop" className="w-10 p-1 border rounded text-xs text-center" />
                                            <input value={newTransPush} onChange={e => setNewTransPush(e.target.value)} placeholder="Push" className="w-10 p-1 border rounded text-xs text-center" />
                                        </>
                                    )}
                                    {currentModule === AppModule.TM && (
                                        <>
                                            <input value={newTransWrite} onChange={e => setNewTransWrite(e.target.value)} placeholder="Wr" className="w-10 p-1 border rounded text-xs text-center" />
                                            <select value={newTransDir} onChange={e => setNewTransDir(e.target.value as 'L'|'R')} className="w-12 p-1 border rounded text-xs"><option value="R">R</option><option value="L">L</option></select>
                                        </>
                                    )}
                                    <select value={newTransTarget} onChange={e => setNewTransTarget(e.target.value)} className="w-16 p-1 border rounded text-xs"><option value="">Dst</option>{activeConfig.states.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}</select>
                                    <button 
                                        onClick={addTransition} 
                                        disabled={!newTransSource || !newTransTarget} 
                                        className={`p-1 ${theme.light} ${theme.text} rounded hover:bg-slate-200 disabled:opacity-50`}
                                    >
                                        <Plus size={16}/>
                                    </button>
                                </div>
                            </div>
                            </>
                        )}
                        
                        {/* SAT Presets */}
                        {currentModule === AppModule.PNP && pnpMode === PnpMode.SAT && (
                            <div className="bg-slate-100 p-4 rounded text-sm text-slate-600 space-y-4">
                                <div>
                                    <h3 className="font-bold text-slate-800 mb-2">SAT Presets (Challenges)</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        <button onClick={() => loadSatPreset('EASY')} className="px-3 py-2 bg-white border border-slate-300 rounded hover:bg-green-50 hover:border-green-300 hover:text-green-700 text-left transition-colors flex items-center justify-between">
                                            <span className="font-bold text-xs">Easy (2-SAT)</span>
                                            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Solvable</span>
                                        </button>
                                        <button onClick={() => loadSatPreset('HARD')} className="px-3 py-2 bg-white border border-slate-300 rounded hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700 text-left transition-colors flex items-center justify-between">
                                            <span className="font-bold text-xs">Hard (3-SAT)</span>
                                            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">NP-C</span>
                                        </button>
                                        <button onClick={() => loadSatPreset('UNSAT')} className="px-3 py-2 bg-white border border-slate-300 rounded hover:bg-red-50 hover:border-red-300 hover:text-red-700 text-left transition-colors flex items-center justify-between">
                                            <span className="font-bold text-xs">Unsatisfiable</span>
                                            <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Impossible</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-500 italic">
                                    Click variables on the circuit to toggle True/False manually.
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="h-1/2 border-t border-slate-200"><ChatAssistant module={currentModule} /></div>
                </div>
             )}
             {(activeTab === AppTab.DEFINITION || activeTab === AppTab.THEORY) && (
               <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto"><EducationalContent activeTab={activeTab} module={currentModule} pnpMode={pnpMode} /></div>
                  <div className="h-1/3 border-t"><ChatAssistant module={currentModule} /></div>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default App;

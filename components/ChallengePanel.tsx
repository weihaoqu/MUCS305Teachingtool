

import React, { useState } from 'react';
import { Challenge, DfaConfig, AppModule, Transition, SatClause } from '../types';
import { Trophy, Play, CheckCircle, XCircle, ArrowRight, Plus, Trash2 } from 'lucide-react';

const CHALLENGES: Challenge[] = [
  // --- DFA Challenges ---
  {
    id: 'c1',
    title: 'Odd Number of Zeros',
    description: 'Construct a DFA over Σ={0, 1} that accepts strings containing an odd number of "0"s.',
    difficulty: 'Easy',
    module: AppModule.DFA,
    testCases: [
      { input: '0', expected: true },
      { input: '000', expected: true },
      { input: '101', expected: true },
      { input: '', expected: false },
      { input: '00', expected: false },
      { input: '11', expected: false },
      { input: '0010', expected: true },
    ]
  },
  {
    id: 'c2',
    title: 'Ends with "01"',
    description: 'Construct a DFA over Σ={0, 1} that accepts strings that end with the sequence "01".',
    difficulty: 'Medium',
    module: AppModule.DFA,
    testCases: [
      { input: '01', expected: true },
      { input: '1101', expected: true },
      { input: '001', expected: true },
      { input: '0', expected: false },
      { input: '1', expected: false },
      { input: '00', expected: false },
      { input: '10', expected: false },
      { input: '010', expected: false },
    ]
  },
  {
    id: 'c3',
    title: 'Even length strings',
    description: 'Construct a DFA that accepts all strings with an even length (0, 2, 4, ...).',
    difficulty: 'Easy',
    module: AppModule.DFA,
    testCases: [
      { input: '', expected: true },
      { input: '00', expected: true },
      { input: '1011', expected: true },
      { input: '0', expected: false },
      { input: '010', expected: false },
      { input: '11111', expected: false },
    ]
  },
  // --- NFA Challenges ---
  {
    id: 'n1',
    title: 'Ends with "01" (NFA)',
    description: 'Construct an NFA that accepts strings ending in "01". Use nondeterminism to make it simpler than the DFA version!',
    difficulty: 'Easy',
    module: AppModule.NFA,
    testCases: [
      { input: '01', expected: true },
      { input: '101', expected: true },
      { input: '0001', expected: true },
      { input: '0', expected: false },
      { input: '1', expected: false },
      { input: '10', expected: false },
      { input: '010', expected: false },
    ]
  },
  {
    id: 'n2',
    title: 'Contains "00" or "11"',
    description: 'Construct an NFA that accepts strings containing either "00" OR "11" as a substring. Tip: Use epsilon transitions to branch.',
    difficulty: 'Medium',
    module: AppModule.NFA,
    testCases: [
      { input: '00', expected: true },
      { input: '11', expected: true },
      { input: '01001', expected: true },
      { input: '10110', expected: true },
      { input: '01', expected: false },
      { input: '10', expected: false },
      { input: '010101', expected: false },
    ]
  },
  {
    id: 'n3',
    title: '3rd from last is "1"',
    description: 'Construct an NFA that accepts any string where the 3rd character from the end is a "1" (e.g. ...1xx).',
    difficulty: 'Medium',
    module: AppModule.NFA,
    testCases: [
      { input: '100', expected: true },
      { input: '111', expected: true },
      { input: '0101', expected: true },
      { input: '00', expected: false },
      { input: '000', expected: false },
      { input: '010', expected: false },
      { input: '1000', expected: false },
    ]
  },
  // --- PDA Challenges ---
  {
      id: 'p1',
      title: 'Balanced Parentheses',
      description: 'Accept strings with balanced parentheses "0" for "(" and "1" for ")". E.g., 01, 0011. Reject 011, 10.',
      difficulty: 'Medium',
      module: AppModule.PDA,
      testCases: [
          { input: '01', expected: true },
          { input: '0011', expected: true },
          { input: '', expected: true },
          { input: '0101', expected: true },
          { input: '10', expected: false },
          { input: '0', expected: false },
          { input: '001', expected: false },
      ]
  },
  // --- TM Challenges ---
  {
      id: 't1',
      title: 'Flip Bits',
      description: 'Design a Turing Machine that reads a string of 0s and 1s, flips every bit (0->1, 1->0), and then halts.',
      difficulty: 'Easy',
      module: AppModule.TM,
      testCases: [
          { input: '01', expected: true },
          { input: '0011', expected: true },
          { input: '000111', expected: true },
          { input: '010', expected: false },
          { input: '11', expected: false },
          { input: '001', expected: false },
      ]
  },
  // --- PNP Challenges (SAT) ---
  {
      id: 'sat1',
      title: 'Intro to 2-SAT',
      description: 'Solve this 2-CNF formula. Since clauses have only 2 literals, this can be solved efficiently (in Polynomial time) using chain logic.',
      difficulty: 'Easy',
      module: AppModule.PNP,
      satConfig: {
          vars: ['A', 'B', 'C'],
          clauses: [
              { id: 1, literals: [{ var: 'A', isNegated: false }, { var: 'B', isNegated: false }] }, // (A v B)
              { id: 2, literals: [{ var: 'A', isNegated: true }, { var: 'B', isNegated: false }] },  // (!A v B)
              { id: 3, literals: [{ var: 'B', isNegated: true }, { var: 'C', isNegated: false }] },  // (!B v C)
          ]
      },
      testCases: [ { input: 'solve', expected: true } ]
  },
  {
      id: 'sat2',
      title: 'Classic 3-SAT',
      description: 'A standard NP-Complete problem. Clauses have 3 literals. You must guess and check to find a valid assignment.',
      difficulty: 'Hard',
      module: AppModule.PNP,
      satConfig: {
          vars: ['A', 'B', 'C'],
          clauses: [
              { id: 1, literals: [{ var: 'A', isNegated: false }, { var: 'B', isNegated: false }, { var: 'C', isNegated: false }] }, // (A v B v C)
              { id: 2, literals: [{ var: 'A', isNegated: true }, { var: 'B', isNegated: true }, { var: 'C', isNegated: false }] },  // (!A v !B v C)
              { id: 3, literals: [{ var: 'A', isNegated: false }, { var: 'C', isNegated: true }, { var: 'B', isNegated: false }] },  // (A v !C v B)
          ]
      },
      testCases: [ { input: 'solve', expected: true } ]
  },
  {
      id: 'sat3',
      title: 'Unsatisfiable?',
      description: 'Try to find a solution. Is it even possible? Sometimes the answer is simply "No".',
      difficulty: 'Expert',
      module: AppModule.PNP,
      satConfig: {
          vars: ['A', 'B'],
          clauses: [
              { id: 1, literals: [{ var: 'A', isNegated: false }, { var: 'B', isNegated: false }] }, // (A v B)
              { id: 2, literals: [{ var: 'A', isNegated: true }, { var: 'B', isNegated: false }] },  // (!A v B)
              { id: 3, literals: [{ var: 'B', isNegated: true }] },                                  // (!B)
              { id: 4, literals: [{ var: 'A', isNegated: true }, { var: 'B', isNegated: true }] },    // (!A v !B)
          ]
      },
      testCases: [ { input: 'solve', expected: false } ]
  }
];

interface Props {
  dfa: DfaConfig; 
  module: AppModule;
  onStartChallenge: (challenge: Challenge) => void;
  // Editor props
  onAddState: (name: string) => void;
  onDeleteState: (id: string) => void;
  onAddTransition: (source: string, target: string, symbol: string) => void;
  onDeleteTransition: (index: number) => void;
  onToggleAccept: (id: string) => void;
}

const ChallengePanel: React.FC<Props> = ({ 
    dfa, 
    module,
    onStartChallenge,
    onAddState,
    onDeleteState,
    onAddTransition,
    onDeleteTransition,
    onToggleAccept
}) => {
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<{input: string, pass: boolean, actual: boolean}[] | null>(null);
  const [success, setSuccess] = useState(false);

  // Local state for editor inputs
  const [newStateName, setNewStateName] = useState('');
  const [newTransSource, setNewTransSource] = useState('');
  const [newTransTarget, setNewTransTarget] = useState('');
  const [newTransSymbol, setNewTransSymbol] = useState('');

  const activeChallenge = CHALLENGES.find(c => c.id === activeChallengeId);

  // Filter challenges by current module
  const filteredChallenges = CHALLENGES.filter(c => c.module === module);

  const handleStart = (challenge: Challenge) => {
    setActiveChallengeId(challenge.id);
    setTestResults(null);
    setSuccess(false);
    onStartChallenge(challenge);
  };

  const handleBack = () => {
    setActiveChallengeId(null);
    setTestResults(null);
    setSuccess(false);
  };

  // --- Simulation Logic ---

  const getEpsilonClosure = (states: string[], transitions: Transition[]): Set<string> => {
    const closure = new Set<string>(states);
    const stack = [...states];
    
    while(stack.length > 0) {
        const current = stack.pop()!;
        const epsMoves = transitions.filter(t => t.source === current && (t.symbol === 'ε' || t.symbol === ''));
        for (const t of epsMoves) {
            if (!closure.has(t.target)) {
                closure.add(t.target);
                stack.push(t.target);
            }
        }
    }
    return closure;
  };

  const simulateMachine = (input: string): boolean => {
    const startState = dfa.states.find(s => s.isStart);
    if (!startState && module !== AppModule.PNP) return false;

    if (module === AppModule.DFA) {
        // DFA Simulation
        if (!startState) return false;
        let currentStateId = startState.id;
        for (const char of input) {
            const transition = dfa.transitions.find(t => t.source === currentStateId && t.symbol === char);
            if (!transition) return false;
            currentStateId = transition.target;
        }
        const endState = dfa.states.find(s => s.id === currentStateId);
        return endState ? endState.isAccept : false;
    } else if (module === AppModule.NFA) {
        // NFA Simulation
        if (!startState) return false;
        let currentStates = new Set<string>([startState.id]);
        currentStates = getEpsilonClosure(Array.from(currentStates), dfa.transitions);

        for (const char of input) {
            const nextStates = new Set<string>();
            currentStates.forEach(sId => {
                const moves = dfa.transitions.filter(t => t.source === sId && t.symbol === char);
                moves.forEach(m => nextStates.add(m.target));
            });
            currentStates = getEpsilonClosure(Array.from(nextStates), dfa.transitions);
        }
        return Array.from(currentStates).some(sId => dfa.states.find(s => s.id === sId)?.isAccept);
    } else if (module === AppModule.PNP) {
        // For PNP/SAT challenges, we rely on the visualizer in the main app to show success.
        // This button acts as a confirmation.
        return true; 
    } else if (module === AppModule.TM) {
        // TM Simulation (Limit steps to prevent infinite loop)
        if (!startState) return false;
        let head = 0;
        let state = startState.id;
        const tape: Record<number, string> = {};
        input.split('').forEach((c,i) => tape[i] = c);
        
        let steps = 0;
        while(steps < 1000) {
            const sObj = dfa.states.find(s => s.id === state);
            if (sObj?.isAccept) return true;
            
            const read = tape[head] || 'B';
            const trans = dfa.transitions.find(t => t.source === state && t.symbol === read);
            
            if (!trans) return false; // Reject
            
            if (trans.write && trans.write !== 'B') tape[head] = trans.write;
            else delete tape[head];
            
            head = trans.direction === 'L' ? head - 1 : head + 1;
            state = trans.target;
            steps++;
        }
        return false; // Timeout
    }
    return false;
  };

  const checkSolution = () => {
    if (!activeChallenge) return;

    const results = activeChallenge.testCases.map(tc => {
      const result = simulateMachine(tc.input);
      return {
        input: tc.input === '' ? '(empty)' : tc.input,
        pass: result === tc.expected,
        actual: result
      };
    });

    setTestResults(results);
    setSuccess(results.every(r => r.pass));
  };

  if (activeChallenge) {
    return (
      <div className="flex flex-col h-full bg-slate-50">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-white shadow-sm flex items-center justify-between shrink-0">
            <button onClick={handleBack} className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-sm font-medium">
                <ArrowRight className="rotate-180" size={16} /> Back
            </button>
            <span className="font-bold text-slate-800 text-sm truncate max-w-[150px]">{activeChallenge.title}</span>
            <div className={`px-2 py-0.5 text-xs rounded font-bold ${activeChallenge.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : activeChallenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : activeChallenge.difficulty === 'Hard' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'}`}>
                {activeChallenge.difficulty}
            </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
            {/* Instructions */}
            <div className={`p-4 border-b ${module === AppModule.NFA ? 'bg-purple-50 border-purple-100' : (module === AppModule.TM ? 'bg-rose-50 border-rose-100' : (module === AppModule.PNP ? 'bg-indigo-50 border-indigo-100' : 'bg-blue-50 border-blue-100'))}`}>
                <h3 className={`text-xs font-bold uppercase mb-1 ${module === AppModule.NFA ? 'text-purple-500' : (module === AppModule.TM ? 'text-rose-500' : (module === AppModule.PNP ? 'text-indigo-500' : 'text-blue-500'))}`}>Goal</h3>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    {activeChallenge.description}
                </p>
            </div>

            {/* Editor Controls - Only for Automata, not SAT/PNP */}
            {module !== AppModule.PNP && (
            <div className="p-4 border-b border-slate-200 bg-white">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Construction Kit</h3>
                
                {/* Add State */}
                <div className="flex gap-2 mb-3">
                    <input 
                        type="text" 
                        value={newStateName}
                        onChange={(e) => setNewStateName(e.target.value)}
                        placeholder="New State (e.g. q1)"
                        className="flex-1 px-2 py-1.5 border border-slate-300 rounded text-sm font-mono focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                    <button 
                        onClick={() => { onAddState(newStateName); setNewStateName(''); }}
                        disabled={!newStateName.trim()}
                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded font-medium text-xs hover:bg-blue-200 disabled:opacity-50 flex items-center gap-1"
                    >
                        <Plus size={14} /> Add
                    </button>
                </div>

                {/* State List (Compact) */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {dfa.states.map(state => (
                        <div key={state.id} className={`flex items-center gap-1 pl-2 pr-1 py-1 rounded border text-xs ${state.isAccept ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                            <span className="font-mono font-bold">{state.id}</span>
                            <button 
                                onClick={() => onToggleAccept(state.id)}
                                className={`w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold ${state.isAccept ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500 hover:bg-emerald-200'}`}
                                title="Toggle Accept"
                            >
                                {state.isAccept ? 'A' : 'R'}
                            </button>
                            {!state.isStart && (
                                <button onClick={() => onDeleteState(state.id)} className="text-slate-400 hover:text-red-500">
                                    <XCircle size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add Transition */}
                <div className="flex gap-1 mb-2 items-center">
                   <select value={newTransSource} onChange={(e) => setNewTransSource(e.target.value)} className="flex-1 p-1.5 border rounded text-xs">
                     <option value="">Src</option>
                     {dfa.states.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
                   </select>
                   
                   <div className="relative">
                        <input 
                            type="text" 
                            placeholder="σ"
                            maxLength={1}
                            value={newTransSymbol}
                            onChange={(e) => setNewTransSymbol(e.target.value)}
                            className="w-10 p-1.5 border rounded text-xs text-center font-mono"
                        />
                        {module === AppModule.NFA && (
                             <button
                                 onClick={() => setNewTransSymbol('ε')}
                                 className="absolute -top-4 left-0 w-full text-[9px] text-purple-600 font-bold hover:underline"
                                 title="Insert Epsilon"
                             >
                                 +ε
                             </button>
                        )}
                   </div>

                   <select value={newTransTarget} onChange={(e) => setNewTransTarget(e.target.value)} className="flex-1 p-1.5 border rounded text-xs">
                     <option value="">Dest</option>
                     {dfa.states.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
                   </select>
                   <button 
                    onClick={() => { onAddTransition(newTransSource, newTransTarget, newTransSymbol); setNewTransSymbol(''); }}
                    disabled={!newTransSource || !newTransTarget || !newTransSymbol}
                    className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 disabled:opacity-50"
                   >
                     <Plus size={16} />
                   </button>
                </div>

                {/* Transitions List */}
                <div className="max-h-24 overflow-y-auto space-y-1">
                    {dfa.transitions.map((t, i) => (
                        <div key={i} className="flex items-center justify-between text-xs p-1 bg-slate-50 rounded border border-slate-100">
                           <span className="font-mono">{t.source} --({t.symbol})--> {t.target}</span>
                           <button onClick={() => onDeleteTransition(i)} className="text-slate-400 hover:text-red-500"><Trash2 size={12} /></button>
                        </div>
                    ))}
                </div>
            </div>
            )}
            
            {module === AppModule.PNP && (
                 <div className="p-4 border-b border-slate-200 bg-white">
                    <p className="text-xs text-slate-500">
                        For SAT challenges, use the interactive circuit visualizer on the left. Click on variables (A, B, C) to toggle their Truth values until all clauses are green.
                    </p>
                 </div>
            )}

            {/* Test Results */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-slate-500 uppercase">Status</h3>
                </div>
                
                {module !== AppModule.PNP && testResults && (
                    <div className="space-y-1 mb-4">
                        {testResults.map((tc, idx) => (
                            <div key={idx} className={`flex items-center justify-between p-2 rounded text-xs border ${
                                tc.pass ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
                            }`}>
                                <div className="flex gap-2">
                                    <span className="font-mono font-bold">{tc.input}</span>
                                    <span className="text-slate-500">→ {tc.actual ? 'Acc' : 'Rej'}</span>
                                </div>
                                {tc.pass ? <CheckCircle size={14} className="text-emerald-500"/> : <XCircle size={14} className="text-red-500"/>}
                            </div>
                        ))}
                    </div>
                )}
                
                {success && (
                    <div className="animate-bounce bg-emerald-100 border border-emerald-200 p-3 rounded-lg text-center mb-4">
                        <Trophy className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                        <h3 className="font-bold text-emerald-800 text-sm">Challenge Solved!</h3>
                    </div>
                )}

                <button 
                    onClick={checkSolution}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg font-bold shadow transition-all active:translate-y-0.5 text-sm"
                >
                    <Play size={16} fill="currentColor" /> {module === AppModule.PNP ? 'Confirm Solved' : (testResults ? 'Run Again' : 'Verify Solution')}
                </button>
            </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="h-full flex flex-col bg-slate-50">
       <div className="p-4 border-b border-slate-200 bg-white">
         <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Trophy className="text-yellow-500" /> {module === AppModule.NFA_TO_DFA ? 'Conversion' : (module === AppModule.PNP ? 'Logic' : module)} Challenges
         </h2>
         <p className="text-xs text-slate-500 mt-1">Select a problem to solve.</p>
       </div>
       
       <div className="flex-1 overflow-y-auto p-4 space-y-3">
         {filteredChallenges.length === 0 ? (
             <p className="text-sm text-slate-500 text-center py-10">No challenges available for this module yet.</p>
         ) : (
            filteredChallenges.map(challenge => (
                <div 
                    key={challenge.id}
                    onClick={() => handleStart(challenge)}
                    className={`group cursor-pointer bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all ${module === AppModule.NFA ? 'hover:border-purple-300' : (module === AppModule.TM ? 'hover:border-rose-300' : (module === AppModule.PNP ? 'hover:border-indigo-300' : 'hover:border-blue-300'))}`}
                >
                    <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-bold text-slate-800 text-sm transition-colors ${module === AppModule.NFA ? 'group-hover:text-purple-600' : (module === AppModule.TM ? 'group-hover:text-rose-600' : (module === AppModule.PNP ? 'group-hover:text-indigo-600' : 'group-hover:text-blue-600'))}`}>{challenge.title}</h3>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${
                            challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 
                            challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                            challenge.difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                            'bg-purple-100 text-purple-700'
                        }`}>
                            {challenge.difficulty}
                        </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{challenge.description}</p>
                </div>
            ))
         )}
       </div>
    </div>
  );
};

export default ChallengePanel;
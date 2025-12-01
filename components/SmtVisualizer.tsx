import React from 'react';
import { SmtConstraint } from '../types';
import { AlertTriangle, CheckCircle, Scale } from 'lucide-react';

interface Props {
  constraints: SmtConstraint[];
  assignments: Record<string, boolean>; // map constraint.id -> boolean
  onToggleAssignment: (id: string) => void;
}

const SmtVisualizer: React.FC<Props> = ({ constraints, assignments, onToggleAssignment }) => {
  // 1. Calculate Intersection (Theory Solver Logic)
  // We assume integer arithmetic for visualization simplicity
  let minVal = -10;
  let maxVal = 10;
  let hasConflict = false;

  const activeConstraints = constraints.filter(c => assignments[c.id]);

  activeConstraints.forEach(c => {
    if (c.type === 'gt') { // x > val => x >= val + 1 (integers)
      minVal = Math.max(minVal, c.value + 1);
    } else if (c.type === 'lt') { // x < val => x <= val - 1
      maxVal = Math.min(maxVal, c.value - 1);
    } else if (c.type === 'eq') { // x = val
      minVal = Math.max(minVal, c.value);
      maxVal = Math.min(maxVal, c.value);
    }
  });

  if (minVal > maxVal) {
    hasConflict = true;
  }

  // Helper for Number Line Scaling
  const rangeStart = -10;
  const rangeEnd = 10;
  const width = 600;
  const padding = 40;
  const scale = (val: number) => {
    // Clamp for drawing safety
    const clamped = Math.max(rangeStart, Math.min(rangeEnd, val));
    return padding + ((clamped - rangeStart) / (rangeEnd - rangeStart)) * (width - 2 * padding);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 overflow-y-auto">
      
      {/* Top Section: Boolean Abstraction */}
      <div className="p-6 bg-white border-b border-slate-200 shadow-sm shrink-0">
        <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
          <Scale size={16} /> Boolean Abstraction Layer (SAT)
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          The SAT solver suggests which constraints are "True". Click to toggle constraints on/off.
        </p>
        <div className="flex flex-wrap gap-3">
          {constraints.map(c => {
            const isActive = assignments[c.id];
            return (
              <button
                key={c.id}
                onClick={() => onToggleAssignment(c.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-mono font-bold transition-all
                  ${isActive 
                    ? 'bg-fuchsia-100 border-fuchsia-400 text-fuchsia-800 shadow-md transform scale-105' 
                    : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                  }
                `}
              >
                <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-fuchsia-500' : 'bg-slate-300'}`} />
                {c.variable} {c.type === 'gt' ? '>' : c.type === 'lt' ? '<' : '='} {c.value}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Theory Solver (LIA) */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center relative bg-slate-50/50">
        <h3 className="absolute top-6 left-6 text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
           Theory Solver (Linear Integer Arithmetic)
        </h3>

        {/* Status Badge */}
        <div className="mb-8">
           {activeConstraints.length === 0 ? (
             <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-xs font-bold">No Constraints Active</span>
           ) : hasConflict ? (
             <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full font-bold animate-pulse">
               <AlertTriangle size={18} /> Conflict Detected (UNSAT)
             </div>
           ) : (
             <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-bold">
               <CheckCircle size={18} /> Consistent (SAT) 
               <span className="text-xs font-normal ml-1 border-l border-emerald-300 pl-2">
                 Valid x: [{minVal}, {maxVal}]
               </span>
             </div>
           )}
        </div>

        {/* SVG Number Line */}
        <svg width="100%" height="200" viewBox={`0 0 ${width} 200`} className="overflow-visible">
           {/* Main Axis */}
           <line x1={padding} y1={100} x2={width - padding} y2={100} stroke="#94a3b8" strokeWidth="2" />
           
           {/* Ticks */}
           {Array.from({ length: 21 }).map((_, i) => {
             const val = i - 10;
             const x = scale(val);
             return (
               <g key={val}>
                 <line x1={x} y1={95} x2={x} y2={105} stroke="#94a3b8" strokeWidth="1" />
                 <text x={x} y={125} textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="monospace">{val}</text>
               </g>
             );
           })}

           {/* Render Intervals for Active Constraints */}
           {activeConstraints.map((c, i) => {
             // Stagger height to avoid total overlap visually, though mathematically they are 1D
             const yLevel = 100 - (10 * (i + 1)); 
             const color = 'rgba(217, 70, 239, 0.4)'; // Fuchsia transparent
             const stroke = '#a21caf';

             let x1 = 0, x2 = 0;
             
             if (c.type === 'gt') {
                x1 = scale(c.value);
                x2 = scale(rangeEnd);
             } else if (c.type === 'lt') {
                x1 = scale(rangeStart);
                x2 = scale(c.value);
             } else { // eq
                x1 = scale(c.value);
                x2 = scale(c.value);
             }

             return (
               <g key={c.id}>
                 {/* Range Line */}
                 {c.type !== 'eq' && (
                    <line x1={x1} y1={100} x2={x2} y2={100} stroke={stroke} strokeWidth="4" opacity="0.3" />
                 )}
                 {/* Specific Indicator */}
                 <circle cx={c.type === 'lt' ? x2 : x1} cy={100} r={4} fill="white" stroke={stroke} strokeWidth="2" />
                 {c.type !== 'eq' && (
                   <text x={(x1 + x2)/2} y={80} textAnchor="middle" fontSize="10" fill={stroke} fontWeight="bold">
                     {c.type === 'gt' ? '>' : '<'} {c.value}
                   </text>
                 )}
               </g>
             )
           })}

           {/* The Resulting Intersection (if valid) */}
           {!hasConflict && activeConstraints.length > 0 && (
             <g>
               <rect 
                 x={scale(minVal)} 
                 y={92} 
                 width={Math.max(0, scale(maxVal) - scale(minVal))} 
                 height={16} 
                 fill="#10b981" 
                 opacity="0.6"
                 rx="4"
               />
               <text x={(scale(minVal) + scale(maxVal)) / 2} y={150} textAnchor="middle" fill="#047857" fontWeight="bold" fontSize="12">
                 Feasible Region
               </text>
             </g>
           )}
        </svg>

      </div>
    </div>
  );
};

export default SmtVisualizer;
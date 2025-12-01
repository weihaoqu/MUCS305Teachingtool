
import React from 'react';
import { SatClause } from '../types';
import { Check, X, Minus } from 'lucide-react';

interface Props {
  variables: string[];
  clauses: SatClause[];
  assignments: Record<string, boolean | null>;
  activeClauseIndex: number | null; // For animation highlighting
  onToggleVariable: (variable: string) => void;
  isSolving: boolean;
}

const SatVisualizer: React.FC<Props> = ({ 
  variables, 
  clauses, 
  assignments, 
  activeClauseIndex, 
  onToggleVariable,
  isSolving
}) => {
  // Layout constants
  const svgWidth = 800;
  const svgHeight = 500;
  const varX = 100;
  const clauseX = 400;
  const resultX = 700;
  const startY = 80;
  const gapY = 80;

  // Helper to evaluate a literal
  const evaluateLiteral = (variable: string, isNegated: boolean) => {
    const val = assignments[variable];
    if (val === null || val === undefined) return null;
    return isNegated ? !val : val;
  };

  // Helper to evaluate a clause
  const evaluateClause = (clause: SatClause) => {
    let hasNull = false;
    for (const lit of clause.literals) {
      const val = evaluateLiteral(lit.var, lit.isNegated);
      if (val === true) return true; // One true literal makes the OR clause true
      if (val === null) hasNull = true;
    }
    return hasNull ? null : false; // False only if all are false
  };

  const allClausesMet = clauses.every(c => evaluateClause(c) === true);

  return (
    <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full bg-slate-50 rounded-lg shadow-inner">
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#cbd5e1" />
        </marker>
      </defs>

      {/* Title */}
      <text x={svgWidth/2} y={30} textAnchor="middle" className="text-lg font-bold fill-slate-400 font-mono">
        Boolean Satisfiability (CNF)
      </text>

      {/* Connections (Wires) */}
      <g className="wires opacity-50">
        {clauses.map((clause, cIdx) => {
          const clauseY = startY + cIdx * gapY + (variables.length * gapY / 2) - (clauses.length * gapY / 2);
          
          return clause.literals.map((lit, lIdx) => {
            const vIdx = variables.indexOf(lit.var);
            const variableY = startY + vIdx * gapY;
            const litVal = evaluateLiteral(lit.var, lit.isNegated);
            
            // Color logic: Green if carrying a TRUE signal to the clause, Red if FALSE, Gray if Null
            const strokeColor = litVal === true ? '#22c55e' : (litVal === false ? '#ef4444' : '#cbd5e1');
            
            return (
              <path
                key={`${cIdx}-${lIdx}`}
                d={`M ${varX + 40} ${variableY} C ${varX + 150} ${variableY}, ${clauseX - 150} ${clauseY + (lIdx * 10 - 10)}, ${clauseX - 10} ${clauseY + (lIdx * 10 - 10)}`}
                fill="none"
                stroke={strokeColor}
                strokeWidth={litVal !== null ? 3 : 1}
                className="transition-colors duration-300"
              />
            );
          });
        })}

        {/* Clause to Result Wires */}
        {clauses.map((clause, cIdx) => {
             const clauseY = startY + cIdx * gapY + (variables.length * gapY / 2) - (clauses.length * gapY / 2);
             const clauseVal = evaluateClause(clause);
             const strokeColor = clauseVal === true ? '#22c55e' : (clauseVal === false ? '#ef4444' : '#cbd5e1');
             
             return (
                 <path
                    key={`res-${cIdx}`}
                    d={`M ${clauseX + 110} ${clauseY} C ${resultX - 50} ${clauseY}, ${resultX - 50} ${svgHeight/2}, ${resultX} ${svgHeight/2}`}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={clauseVal !== null ? 3 : 1}
                    className="transition-colors duration-300"
                 />
             )
        })}
      </g>

      {/* Variables (Inputs) */}
      {variables.map((v, i) => {
        const y = startY + i * gapY;
        const val = assignments[v];
        return (
          <g key={v} onClick={() => !isSolving && onToggleVariable(v)} className={`${isSolving ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            <rect 
                x={varX - 30} y={y - 25} width={70} height={50} rx={10} 
                fill={val === true ? '#22c55e' : (val === false ? '#ef4444' : '#e2e8f0')} 
                stroke={val === null || val === undefined ? '#94a3b8' : 'none'}
                strokeWidth={2}
                className="transition-colors duration-300 shadow-sm"
            />
            <text x={varX + 5} y={y + 5} textAnchor="middle" fill={val === null || val === undefined ? '#475569' : 'white'} fontWeight="bold" fontSize="18">
              {v}={val === true ? 'T' : (val === false ? 'F' : '?')}
            </text>
          </g>
        );
      })}

      {/* Clauses (Gates) */}
      {clauses.map((clause, i) => {
        const y = startY + i * gapY + (variables.length * gapY / 2) - (clauses.length * gapY / 2);
        const isActive = activeClauseIndex === i;
        const result = evaluateClause(clause);
        
        return (
          <g key={i}>
            {/* Clause Box */}
            <rect 
                x={clauseX} y={y - 30} width={110} height={60} rx={8} 
                fill={result === true ? '#dcfce7' : (result === false ? '#fee2e2' : 'white')}
                stroke={isActive ? '#eab308' : (result === false ? '#ef4444' : '#cbd5e1')}
                strokeWidth={isActive ? 4 : 2}
                className="transition-all duration-300"
            />
            {/* Literals Text */}
            <text x={clauseX + 55} y={y + 5} textAnchor="middle" className="font-mono font-bold text-slate-700 text-sm">
              ({clause.literals.map(l => (l.isNegated ? '¬' : '') + l.var).join(' ∨ ')})
            </text>
            {/* Status Icon */}
            <g transform={`translate(${clauseX + 85}, ${y - 20})`}>
                {result === true && <Check size={16} className="text-green-600" />}
                {result === false && <X size={16} className="text-red-600" />}
            </g>
          </g>
        );
      })}

      {/* Final Result (AND Gate representation) */}
      <g transform={`translate(${resultX}, ${svgHeight/2 - 40})`}>
          <path d="M0,0 V80 H20 A40,40 0 0,0 20,0 Z" fill={allClausesMet ? '#22c55e' : '#e2e8f0'} stroke="#94a3b8" strokeWidth="2" />
          <text x={35} y={45} textAnchor="middle" fill={allClausesMet ? 'white' : '#64748b'} fontWeight="bold">AND</text>
          
          <circle cx={80} cy={40} r={20} fill={allClausesMet ? '#22c55e' : '#f1f5f9'} stroke={allClausesMet ? '#15803d' : '#cbd5e1'} strokeWidth="3" />
           {allClausesMet ? 
            <Check x={68} y={28} size={24} className="text-white" /> : 
            <Minus x={68} y={28} size={24} className="text-slate-300" />
           }
      </g>

    </svg>
  );
};

export default SatVisualizer;

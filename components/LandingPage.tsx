

import React from 'react';
import { ArrowRight, Binary, GitFork, School, Layers, ArrowRightLeft, HardDrive, Network, Split, Scale, ClipboardList } from 'lucide-react';
import { AppModule } from '../types';

interface Props {
  onStart: (module: AppModule) => void;
}

const LandingPage: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-7xl w-full text-center space-y-12 animate-fadeIn">
        
        {/* Header Section */}
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-2xl mb-2 shadow-sm">
            <School className="w-10 h-10 text-blue-700" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
              Monmouth CS 305
            </h1>
            <h2 className="text-2xl md:text-3xl text-slate-600 font-light">
              Theory of Computing
            </h2>
          </div>
          <div className="inline-block px-4 py-1.5 bg-slate-200 rounded-full text-sm font-semibold text-slate-600 uppercase tracking-widest">
            By Weihao
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full mx-auto mt-12 text-left">
          {/* Module 1: DFA */}
          <div 
            onClick={() => onStart(AppModule.DFA)}
            className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-400 transition-all cursor-pointer relative overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110 opacity-50"></div>
            
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:rotate-6 transition-transform">
                <Binary size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-700 transition-colors">Deterministic (DFA)</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed flex-1">
                Explore Deterministic Finite Automata (DFA) through interactive visualization, formal definitions, and AI-assisted challenges.
              </p>
              <div className="flex items-center text-blue-600 font-bold group-hover:translate-x-2 transition-transform text-sm">
                Start Module <ArrowRight size={18} className="ml-2" />
              </div>
            </div>
          </div>

          {/* Module 2: NFA */}
          <div 
            onClick={() => onStart(AppModule.NFA)}
            className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-purple-400 transition-all cursor-pointer relative overflow-hidden flex flex-col"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-50 to-purple-100 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110 opacity-50"></div>

             <div className="relative z-10 flex-1 flex flex-col">
              <div className="w-14 h-14 bg-purple-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:rotate-6 transition-transform">
                <GitFork size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-purple-700 transition-colors">Nondeterministic (NFA)</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed flex-1">
                Dive into Nondeterminism! Visualize multiple active states, epsilon transitions, and the power of parallel computation paths.
              </p>
              <div className="flex items-center text-purple-600 font-bold group-hover:translate-x-2 transition-transform text-sm">
                Start Module <ArrowRight size={18} className="ml-2" />
              </div>
            </div>
          </div>

          {/* Module 3: PDA */}
          <div 
            onClick={() => onStart(AppModule.PDA)}
            className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-emerald-400 transition-all cursor-pointer relative overflow-hidden flex flex-col"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110 opacity-50"></div>

             <div className="relative z-10 flex-1 flex flex-col">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:rotate-6 transition-transform">
                <Layers size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-emerald-700 transition-colors">Pushdown (PDA)</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed flex-1">
                Learn about Stack Memory! Visualize how Pushdown Automata handle Context-Free Languages using a LIFO stack.
              </p>
              <div className="flex items-center text-emerald-600 font-bold group-hover:translate-x-2 transition-transform text-sm">
                Start Module <ArrowRight size={18} className="ml-2" />
              </div>
            </div>
          </div>

           {/* Module 7: CFG (New) */}
          <div 
            onClick={() => onStart(AppModule.CFG)}
            className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-cyan-400 transition-all cursor-pointer relative overflow-hidden flex flex-col"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110 opacity-50"></div>

             <div className="relative z-10 flex-1 flex flex-col">
              <div className="w-14 h-14 bg-cyan-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:rotate-6 transition-transform">
                <Split size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-cyan-700 transition-colors">Context-Free Grammar</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed flex-1">
                Generate languages using Grammars! Visualize derivations, build Parse Trees, and understand recursive rules.
              </p>
              <div className="flex items-center text-cyan-600 font-bold group-hover:translate-x-2 transition-transform text-sm">
                Start Module <ArrowRight size={18} className="ml-2" />
              </div>
            </div>
          </div>

          {/* Module 4: NFA to DFA */}
          <div 
            onClick={() => onStart(AppModule.NFA_TO_DFA)}
            className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-amber-400 transition-all cursor-pointer relative overflow-hidden flex flex-col"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-50 to-amber-100 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110 opacity-50"></div>

             <div className="relative z-10 flex-1 flex flex-col">
              <div className="w-14 h-14 bg-amber-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:rotate-6 transition-transform">
                <ArrowRightLeft size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-amber-700 transition-colors">NFA to DFA</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed flex-1">
                Master the Subset Construction algorithm! Convert Nondeterministic Automata into equivalent Deterministic machines.
              </p>
              <div className="flex items-center text-amber-600 font-bold group-hover:translate-x-2 transition-transform text-sm">
                Start Module <ArrowRight size={18} className="ml-2" />
              </div>
            </div>
          </div>

          {/* Module 5: Turing Machine */}
          <div 
            onClick={() => onStart(AppModule.TM)}
            className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-rose-400 transition-all cursor-pointer relative overflow-hidden flex flex-col"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-50 to-rose-100 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110 opacity-50"></div>

             <div className="relative z-10 flex-1 flex flex-col">
              <div className="w-14 h-14 bg-rose-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:rotate-6 transition-transform">
                <HardDrive size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-rose-700 transition-colors">Turing Machine</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed flex-1">
                The ultimate computational model! Visualize infinite tapes, read/write heads, and the logic that defines modern computing.
              </p>
              <div className="flex items-center text-rose-600 font-bold group-hover:translate-x-2 transition-transform text-sm">
                Start Module <ArrowRight size={18} className="ml-2" />
              </div>
            </div>
          </div>

          {/* Module 6: P vs NP */}
          <div 
            onClick={() => onStart(AppModule.PNP)}
            className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-400 transition-all cursor-pointer relative overflow-hidden flex flex-col"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110 opacity-50"></div>

             <div className="relative z-10 flex-1 flex flex-col">
              <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:rotate-6 transition-transform">
                <Network size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-700 transition-colors">P vs NP</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed flex-1">
                Complexity Theory! Explore the Graph Coloring problem, understand NP-Completeness, and visualize Backtracking algorithms.
              </p>
              <div className="flex items-center text-indigo-600 font-bold group-hover:translate-x-2 transition-transform text-sm">
                Start Module <ArrowRight size={18} className="ml-2" />
              </div>
            </div>
          </div>

          {/* Module 8: SMT Solver */}
          <div 
            onClick={() => onStart(AppModule.SMT)}
            className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-fuchsia-400 transition-all cursor-pointer relative overflow-hidden flex flex-col"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110 opacity-50"></div>

             <div className="relative z-10 flex-1 flex flex-col">
              <div className="w-14 h-14 bg-fuchsia-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:rotate-6 transition-transform">
                <Scale size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-fuchsia-700 transition-colors">SMT Solver</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed flex-1">
                Satisfiability Modulo Theories. Visualize Lazy SMT, where Boolean logic meets Mathematical Theory (Linear Arithmetic).
              </p>
              <div className="flex items-center text-fuchsia-600 font-bold group-hover:translate-x-2 transition-transform text-sm">
                Start Module <ArrowRight size={18} className="ml-2" />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Student Survey Section */}
      <div className="mt-16 text-center animate-fadeIn">
         <a 
           href="https://docs.google.com/forms/d/e/1FAIpQLScW-fWdXjSBnHZ2SQ4SMO_ImDIqP49DeHr9jckEzwgD1eMKdw/viewform?usp=sharing&ouid=113013872270547245854" 
           target="_blank" 
           rel="noopener noreferrer"
           className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-bold shadow-xl hover:bg-blue-600 hover:scale-105 transition-all active:scale-95"
         >
           <ClipboardList size={20} />
           Take Student Survey
         </a>
         <p className="text-slate-400 text-xs mt-3 font-medium">
           Finished playing? We'd love your feedback!
         </p>
      </div>
      
      <footer className="mt-12 text-slate-400 text-xs font-medium uppercase tracking-wider">
        © {new Date().getFullYear()} Monmouth University • Computer Science Department
      </footer>
    </div>
  );
};

export default LandingPage;

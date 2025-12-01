

import React from 'react';
import { AppTab, AppModule, PnpMode } from '../types';

interface Props {
  activeTab: AppTab;
  module: AppModule;
  pnpMode?: PnpMode;
}

const EducationalContent: React.FC<Props> = ({ activeTab, module, pnpMode }) => {
  if (activeTab === AppTab.VISUALIZER) return null;

  return (
    <div className="p-6 h-full overflow-y-auto bg-white">
      {activeTab === AppTab.DEFINITION && (
        <div className="space-y-6 animate-fadeIn">
          <h2 className="text-2xl font-bold text-slate-800 border-b pb-2">
             Formal Definition ({module === AppModule.NFA_TO_DFA ? 'Subset Construction' : (module === AppModule.PNP ? (pnpMode === PnpMode.SAT ? 'Boolean Satisfiability (SAT)' : 'Complexity Classes') : (module === AppModule.CFG ? 'Context-Free Grammar' : (module === AppModule.SMT ? 'Satisfiability Modulo Theories' : module)))})
          </h2>
          
          {module === AppModule.DFA ? (
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-600">
                A <strong>Deterministic Finite Automaton (DFA)</strong> is a 5-tuple, $(Q, \Sigma, \delta, q_0, F)$, consisting of:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-700">
                <li><strong className="text-blue-700">Q</strong>: Finite set of states.</li>
                <li><strong className="text-purple-700">Σ</strong>: Input alphabet.</li>
                <li><strong className="text-emerald-700">δ</strong>: Transition function {'$\\delta: Q \\times \\Sigma \\rightarrow Q$'}.</li>
                <li><strong className="text-orange-700">q₀</strong>: Start state.</li>
                <li><strong className="text-red-700">F</strong>: Set of accept states.</li>
              </ul>
            </div>
          ) : module === AppModule.NFA ? (
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-600">
                A <strong>Nondeterministic Finite Automaton (NFA)</strong> is a 5-tuple, $(Q, \Sigma, \delta, q_0, F)$, consisting of:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-700">
                <li><strong className="text-blue-700">Q</strong>: Finite set of states.</li>
                <li><strong className="text-purple-700">Σ</strong>: Input alphabet.</li>
                <li><strong className="text-emerald-700">δ</strong>: Transition function {'$\\delta: Q \\times \\Sigma_\\epsilon \\rightarrow P(Q)$'}.</li>
                <li><strong className="text-orange-700">q₀</strong>: Start state.</li>
                <li><strong className="text-red-700">F</strong>: Set of accept states.</li>
              </ul>
            </div>
          ) : module === AppModule.PDA ? (
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-600">
                A <strong>Pushdown Automaton (PDA)</strong> is a 6-tuple, $(Q, \Sigma, \Gamma, \delta, q_0, F)$, adding a stack to the finite automaton:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-700">
                <li><strong className="text-blue-700">Q</strong>: Finite set of states.</li>
                <li><strong className="text-purple-700">Σ</strong>: Input alphabet.</li>
                <li><strong className="text-indigo-700">Γ</strong>: Stack alphabet (symbols stored on the stack).</li>
                <li><strong className="text-emerald-700">δ</strong>: Transition function {'$\\delta: Q \\times \\Sigma_\\epsilon \\times \\Gamma_\\epsilon \\rightarrow P(Q \\times \\Gamma_\\epsilon)$'}.</li>
                <li><strong className="text-orange-700">q₀</strong>: Start state.</li>
                <li><strong className="text-red-700">F</strong>: Set of accept states.</li>
              </ul>
            </div>
          ) : module === AppModule.TM ? (
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-600">
                A <strong>Turing Machine (TM)</strong> is a 7-tuple, {'$(Q, \\Sigma, \\Gamma, \\delta, q_0, q_{accept}, q_{reject})$'}, consisting of:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-700">
                <li><strong className="text-blue-700">Q</strong>: Finite set of states.</li>
                <li><strong className="text-purple-700">Σ</strong>: Input alphabet.</li>
                <li><strong className="text-indigo-700">Γ</strong>: Tape alphabet (contains Σ and the blank symbol 'B').</li>
                <li><strong className="text-emerald-700">δ</strong>: Transition function {'$\\delta: Q \\times \\Gamma \\rightarrow Q \\times \\Gamma \\times \\{L, R\\}$'}.</li>
                <li><strong className="text-orange-700">q₀</strong>: Start state.</li>
                <li><strong className="text-green-700">q_accept</strong>: The accepting state.</li>
                <li><strong className="text-red-700">q_reject</strong>: The rejecting state.</li>
              </ul>
            </div>
          ) : module === AppModule.CFG ? (
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-600">
                A <strong>Context-Free Grammar (CFG)</strong> is a 4-tuple, {'$(V, \\Sigma, R, S)$'}, consisting of:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-700">
                <li><strong className="text-blue-700">V</strong>: A finite set of Variables (or Non-terminals), e.g., {'$\\{S, A, B\\}$'}.</li>
                <li><strong className="text-purple-700">Σ</strong>: A finite set of Terminals, e.g., {'$\\{0, 1\\}$'}, disjoint from V.</li>
                <li><strong className="text-emerald-700">R</strong>: A finite set of Production Rules, where each rule is of the form {'$A \\rightarrow w$'}, where {'$A \\in V$'} and {'$w \\in (V \\cup \\Sigma)^*$'} (string of variables and terminals).</li>
                <li><strong className="text-orange-700">S</strong>: The Start Variable, {'$S \\in V$'}.</li>
              </ul>
            </div>
          ) : module === AppModule.SMT ? (
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-600">
                <strong>SMT (Satisfiability Modulo Theories)</strong> extends SAT solving by supporting formulas from "theories" like Linear Integer Arithmetic, Arrays, and Bit Vectors.
              </p>
              
              <div className="bg-fuchsia-50 border-l-4 border-fuchsia-500 p-4 my-4">
                 <h3 className="font-bold text-fuchsia-900">Lazy SMT (DPLL(T))</h3>
                 <p className="text-fuchsia-800 text-sm mt-1">
                   Modern SMT solvers work by "abstracting" the formula into Boolean variables and letting a SAT solver handle the logic structure.
                 </p>
                 <ol className="list-decimal pl-5 mt-2 text-fuchsia-800 text-sm space-y-1">
                   <li><strong>Abstraction</strong>: Replace constraints (e.g., {'$x > 3$'}) with boolean variables (e.g., {'$B_1$'}).</li>
                   <li><strong>SAT Solving</strong>: The SAT solver proposes a truth assignment for these variables (e.g., {'$B_1 = True$'}).</li>
                   <li><strong>Theory Check</strong>: A specialized "Theory Solver" checks if the active constraints are consistent (e.g., is {'$x > 3 \land x < 2$'} possible?).</li>
                   <li><strong>Learning</strong>: If inconsistent, the Theory Solver adds a "Conflict Clause" to exclude that combination.</li>
                 </ol>
              </div>
            </div>
          ) : module === AppModule.PNP ? (
             pnpMode === PnpMode.SAT ? (
              <div className="prose prose-slate max-w-none space-y-4">
                  <p className="text-lg text-slate-600">
                    The <strong>Boolean Satisfiability Problem (SAT)</strong> is the problem of determining if there exists an interpretation (assignment of True/False values) that satisfies a given Boolean formula.
                  </p>
                  
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">1. CNF (Conjunctive Normal Form)</h3>
                    <p className="mt-2 text-slate-700">
                      Standard SAT problems are often expressed in CNF, which is an <strong>AND</strong> of <strong>ORs</strong>:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mt-2 text-slate-700">
                      <li><strong className="text-purple-700">Literal</strong>: A variable ($x$) or its negation {'$(\\neg x)$'}.</li>
                      <li><strong className="text-emerald-700">Clause</strong>: A disjunction (OR) of literals, e.g., {'$(x_1 \\lor \\neg x_2)$'}.</li>
                      <li><strong className="text-orange-700">Formula</strong>: A conjunction (AND) of clauses.</li>
                    </ul>
                    <div className="bg-slate-100 p-3 rounded mt-2 font-mono text-sm">
                        Example: {'$(x_1 \\lor x_2) \\land (\\neg x_1 \\lor x_3) \\land (\\neg x_2 \\lor \\neg x_3)$'}
                    </div>
                  </div>

                  <div className="border-l-4 border-indigo-500 pl-4 bg-indigo-50 p-4 rounded-r">
                    <h3 className="font-bold text-indigo-900">2. The Cook-Levin Theorem</h3>
                    <p className="mt-1 text-indigo-800 italic">
                      "Boolean Satisfiability (SAT) is NP-complete."
                    </p>
                    <p className="mt-2 text-sm text-indigo-700">
                      This means that:
                      1. SAT is in NP (we can verify a solution quickly).
                      2. Every other problem in NP can be reduced to SAT in polynomial time.
                      <br/>
                      <strong>Implication:</strong> If we could solve SAT efficiently (in Polynomial time), we could solve EVERY problem in NP efficiently ($P = NP$).
                    </p>
                  </div>

                  <div>
                     <h3 className="text-lg font-bold text-slate-800">3. 2-SAT vs 3-SAT</h3>
                     <ul className="list-disc pl-6 space-y-2 mt-2 text-slate-700">
                        <li>
                            <strong className="text-green-700">2-SAT</strong>: Clauses have at most 2 literals.
                            <br/><span className="text-sm text-slate-500">Status: <strong>P (Polynomial Time)</strong>. Can be solved efficiently using implication graphs.</span>
                        </li>
                        <li>
                            <strong className="text-rose-700">3-SAT</strong>: Clauses have at most 3 literals.
                            <br/><span className="text-sm text-slate-500">Status: <strong>NP-Complete</strong>. There is no known efficient algorithm for general 3-SAT.</span>
                        </li>
                     </ul>
                  </div>
              </div>
             ) : (
                <div className="prose prose-slate max-w-none">
                  <p className="text-lg text-slate-600">
                    <strong>Complexity Classes</strong> classify problems based on the resources (time/space) required to solve them.
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-700">
                    <li><strong className="text-green-700">P (Polynomial Time)</strong>: Problems that can be <em>solved</em> by a deterministic Turing machine in polynomial time ({'$O(n^k)$'}). Examples: Sorting, Shortest Path.</li>
                    <li><strong className="text-indigo-700">NP (Nondeterministic Polynomial Time)</strong>: Problems where a solution can be <em>verified</em> in polynomial time. P is a subset of NP.</li>
                    <li><strong className="text-rose-700">NP-Complete</strong>: The hardest problems in NP. If any NP-Complete problem has a polynomial time algorithm, then $P = NP$. Example: 3-Coloring, SAT, Traveling Salesman.</li>
                  </ul>
                </div>
             )
          ) : (
             <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-600">
                The <strong>Subset Construction Algorithm</strong> converts an NFA {'$N = (Q, \\Sigma, \\delta, q_0, F)$'} into an equivalent DFA {'$M = (Q\', \\Sigma, \\delta\', q_0\', F\')$'}.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-700">
                <li><strong className="text-blue-700">Q'</strong>: The power set of Q ({'$2^Q$'}). Each state in the DFA represents a set of states in the NFA.</li>
                <li><strong className="text-orange-700">q₀'</strong>: {'$E(\\{q_0\\})$'}, the epsilon closure of the NFA start state.</li>
                <li><strong className="text-red-700">F'</strong>: The set of all states in {'$Q\''} that contain at least one accepting state from {'$F$'}.</li>
                <li><strong className="text-emerald-700">δ'(R, a)</strong>: For a set of NFA states {'$R$'} and input {'$a$'}, the next state is {'$\\bigcup_{r \\in R} E(\\delta(r, a))$'}.</li>
              </ul>
            </div>
          )}

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-6">
            <h3 className="font-semibold text-slate-800 mb-2">Key Concept</h3>
            <p className="text-slate-600">
              {module === AppModule.PDA 
               ? "The PDA accepts if the input is empty and the machine is in an accept state (or by empty stack, depending on definition)."
               : module === AppModule.TM 
               ? "The TM accepts if it enters the Accept state. It rejects if it enters the Reject state. It loops if it never halts."
               : module === AppModule.CFG
               ? "A Derivation is a sequence of substitutions to generate a string. A Parse Tree represents the structure of this derivation pictorially."
               : module === AppModule.PNP
               ? (pnpMode === PnpMode.SAT ? "Cook-Levin Theorem: SAT is the 'original' NP-Complete problem. 3-SAT is hard, but 2-SAT is easy." : "In Graph Coloring, 'Checking' if no two adjacent nodes have the same color is fast (P). 'Finding' a valid coloring is hard (NP).")
               : module === AppModule.SMT
               ? "SMT Solvers work by checking the 'Boolean Skeleton' first. If the skeleton is true, they ask the Theory Solver: 'Is this mathematically possible?'"
               : module === AppModule.NFA_TO_DFA 
               ? "The resulting DFA simulates the NFA by tracking all possible states the NFA could be in simultaneously."
               : "The machine accepts w if a valid path leads to an accept state."}
            </p>
          </div>
        </div>
      )}

      {activeTab === AppTab.THEORY && (
        <div className="space-y-6 animate-fadeIn">
          <h2 className="text-2xl font-bold text-slate-800 border-b pb-2">Theory & Concepts</h2>
          <div className="space-y-4">
            <section>
              <h3 className="text-lg font-bold text-blue-700">
                {module === AppModule.PDA ? "Memory & Context" : 
                 module === AppModule.TM ? "Universal Computation" :
                 module === AppModule.CFG ? "Generative Power" :
                 module === AppModule.PNP ? "The Million Dollar Question" :
                 module === AppModule.SMT ? "Automated Reasoning" :
                 module === AppModule.NFA_TO_DFA ? "Equivalence of NFA & DFA" :
                 (module === AppModule.DFA ? "Determinism" : "Nondeterminism")}
              </h3>
              <p className="text-slate-600 mt-1">
                {module === AppModule.PDA 
                  ? 'Unlike DFAs/NFAs which have limited memory, a PDA uses an infinite Stack (LIFO) to store information. This allows it to recognize Context-Free Languages (e.g., matching parentheses, palindromes) which regular expressions cannot handle.'
                  : module === AppModule.TM
                  ? 'A Turing Machine is the most powerful computational model. With an infinite tape that can be read and written to in any order, it can simulate any computer algorithm. This leads to the Church-Turing Thesis: anything computable can be computed by a Turing Machine.'
                  : module === AppModule.CFG
                  ? 'Context-Free Grammars are more powerful than Regular Expressions. They are essential in computer science for defining programming language syntax (compilers use parsers based on CFGs) and modeling data structures (HTML/XML).'
                  : module === AppModule.PNP
                  ? 'Is P = NP? This is one of the greatest unsolved problems in computer science. It asks whether every problem whose solution can be quickly verified can also be solved quickly. Most experts believe P ≠ NP, implying that some problems are inherently hard to solve.'
                  : module === AppModule.SMT
                  ? 'SMT solvers are the engine behind modern Formal Verification, Software Testing, and Constraint Satisfaction. By combining fast SAT solvers with domain-specific math, they can prove code correctness or find security bugs efficiently.'
                  : module === AppModule.NFA_TO_DFA
                  ? 'Every NFA has an equivalent DFA. While NFAs are easier to design (allowing guesses and epsilon moves), DFAs are easier to implement in hardware or code. The trade-off is that the DFA might have exponentially more states ($2^n$) than the NFA.'
                  : (module === AppModule.DFA 
                      ? '"Deterministic" means that for every state and every input symbol, there is exactly one next state.'
                      : '"Nondeterministic" means a state can have multiple transitions for the same symbol, or move without input (ε).')}
              </p>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationalContent;
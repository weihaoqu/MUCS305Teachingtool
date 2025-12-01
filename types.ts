

export interface DfaState {
  id: string;
  x: number;
  y: number;
  isAccept: boolean;
  isStart: boolean;
  color?: string;
}

export interface Transition {
  source: string;
  target: string;
  symbol: string;
  pop?: string;
  push?: string;
  write?: string;     // For Turing Machine
  direction?: 'L' | 'R'; // For Turing Machine
}

export interface DfaConfig {
  states: DfaState[];
  transitions: Transition[];
  alphabet: string[];
}

export interface SimulationStep {
  stateIds: string[]; 
  inputChar: string | null;
  remainingInput: string;
  index: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum AppTab {
  VISUALIZER = 'VISUALIZER',
  THEORY = 'THEORY',
  DEFINITION = 'DEFINITION',
  CHALLENGES = 'CHALLENGES'
}

export enum AppModule {
  DFA = 'DFA',
  NFA = 'NFA',
  PDA = 'PDA',
  NFA_TO_DFA = 'NFA_TO_DFA',
  TM = 'TM',
  PNP = 'PNP',
  CFG = 'CFG',
  SMT = 'SMT'
}

export enum PnpMode {
  GRAPH_COLORING = 'GRAPH_COLORING',
  SAT = 'SAT'
}

export interface SatClause {
  id: number;
  literals: { var: string; isNegated: boolean }[];
}

export interface TestCase {
  input: string;
  expected: boolean;
}

export interface CfgProduction {
  head: string;
  body: string[]; // e.g. ['0', 'S', '1']
}

export interface CfgConfig {
  variables: string[];
  terminals: string[];
  productions: CfgProduction[];
  startVariable: string;
  rawText: string; // To persist the editor state
}

export interface ParseTreeNode {
  id: string;
  name: string; // The symbol
  children?: ParseTreeNode[];
  isTerminal: boolean;
}

export interface SmtConstraint {
  id: string;
  variable: string; // Usually 'x' for simplicity
  type: 'gt' | 'lt' | 'eq';
  value: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  testCases: TestCase[];
  module: AppModule;
  satConfig?: {
    vars: string[];
    clauses: SatClause[];
  };
  cfgTarget?: string; // For CFG challenges, the target string to derive
}

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ParseTreeNode } from '../types';

interface Props {
  data: ParseTreeNode | null;
  onNodeClick?: (nodeId: string, symbol: string, x: number, y: number) => void;
}

const CfgVisualizer: React.FC<Props> = ({ data, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g").attr("transform", "translate(0, 40)");

    // Create tree layout
    const root = d3.hierarchy(data);
    const treeLayout = d3.tree<ParseTreeNode>().size([width, height - 100]);
    
    treeLayout(root);

    // Links
    g.selectAll(".link")
      .data(root.links())
      .enter().append("path")
      .attr("class", "link")
      .attr("d", d3.linkVertical()
          .x(d => d.x!)
          .y(d => d.y!) as any
      )
      .attr("fill", "none")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 2);

    // Nodes
    const nodes = g.selectAll(".node")
      .data(root.descendants())
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    // Circle
    nodes.append("circle")
      .attr("r", 20)
      .attr("fill", d => d.data.isTerminal ? (d.data.name === 'ε' ? '#f1f5f9' : '#dcfce7') : '#cffafe') // Green for terminal, Cyan for Variable
      .attr("stroke", d => d.data.isTerminal ? (d.data.name === 'ε' ? '#94a3b8' : '#22c55e') : '#0891b2')
      .attr("stroke-width", d => {
          // Highlight expandable nodes (Leaf Non-Terminals)
          const isExpandable = !d.data.isTerminal && (!d.children || d.children.length === 0);
          return isExpandable ? 3 : 2;
      })
      .style("cursor", d => {
          const isExpandable = !d.data.isTerminal && (!d.children || d.children.length === 0);
          return isExpandable ? "pointer" : "default";
      })
      .on("click", (event, d) => {
          // Only trigger click for Leaf Non-Terminals (Variables that haven't been expanded yet)
          const isExpandable = !d.data.isTerminal && (!d.children || d.children.length === 0);
          if (isExpandable && onNodeClick) {
              event.stopPropagation();
              // Get absolute position for popup
              const rect = svgRef.current?.getBoundingClientRect();
              if (rect) {
                  onNodeClick(d.data.id, d.data.name, rect.left + d.x!, rect.top + d.y! + 40);
              }
          }
      });

    // Text
    nodes.append("text")
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .text(d => d.data.name)
      .attr("font-weight", "bold")
      .attr("fill", "#0f172a")
      .attr("font-family", "monospace")
      .attr("font-size", "14px")
      .style("pointer-events", "none");

  }, [data, onNodeClick]);

  if (!data) {
      return (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm italic">
              Parse tree will appear here...
          </div>
      )
  }

  return (
    <svg ref={svgRef} className="w-full h-full bg-slate-50/50" />
  );
};

export default CfgVisualizer;

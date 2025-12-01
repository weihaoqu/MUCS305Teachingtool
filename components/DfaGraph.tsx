

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { DfaConfig, DfaState } from '../types';

interface DfaGraphProps {
  config: DfaConfig;
  activeStateIds: string[];
  onStateDragEnd: (id: string, x: number, y: number) => void;
  // New props for P vs NP
  nodeColors?: Record<string, string>;
  isUndirected?: boolean;
  onStateClick?: (id: string) => void;
}

const DfaGraph: React.FC<DfaGraphProps> = ({ config, activeStateIds, onStateDragEnd, nodeColors, isUndirected, onStateClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const prevActiveStateIdsRef = useRef<string[]>([]);
  
  // Group transitions
  const getGroupedTransitions = () => {
    const map = new Map<string, string[]>();
    config.transitions.forEach(t => {
      // For undirected graph, sort source/target to group edge directions together
      const key = isUndirected 
        ? [t.source, t.target].sort().join('-')
        : `${t.source}-${t.target}`;
        
      if (!map.has(key)) map.set(key, []);
      
      let label = t.symbol || 'ε';
      
      if (t.write && t.direction) {
        label = `${t.symbol} → ${t.write}, ${t.direction}`;
      } else if (t.pop || t.push) {
        label += `, ${t.pop || 'ε'} → ${t.push || 'ε'}`;
      }
      
      // If undirected (Graph Coloring), often no labels are needed, but we keep logic just in case
      map.get(key)?.push(label);
    });
    return map;
  };

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const defs = svg.append("defs");
    defs.append("marker").attr("id", "arrowhead").attr("viewBox", "0 -5 10 10").attr("refX", 28).attr("refY", 0).attr("markerWidth", 8).attr("markerHeight", 8).attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "#64748b");
    defs.append("marker").attr("id", "start-arrow").attr("viewBox", "0 -5 10 10").attr("refX", 28).attr("refY", 0).attr("markerWidth", 10).attr("markerHeight", 10).attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "#3b82f6");

    const transitionsGroup = svg.append("g").attr("class", "transitions");
    const nodesGroup = svg.append("g").attr("class", "nodes");
    const labelsGroup = svg.append("g").attr("class", "labels");
    const animationGroup = svg.append("g").attr("class", "animation-layer");

    const groupedTransitions = getGroupedTransitions();

    groupedTransitions.forEach((labels, key) => {
      const [sourceId, targetId] = key.split('-');
      const source = config.states.find(s => s.id === sourceId);
      const target = config.states.find(s => s.id === targetId);
      if (!source || !target) return;

      const isSelfLoop = sourceId === targetId;
      
      let pathD = "";
      let labelX = 0, labelY = 0;

      if (isSelfLoop) {
        const x = source.x, y = source.y - 20;
        pathD = `M${x - 5},${y} C${x - 30},${y - 50} ${x + 30},${y - 50} ${x + 5},${y}`;
        labelX = x; labelY = y - 45;
      } else {
        const dx = target.x - source.x, dy = target.y - source.y;
        
        if (isUndirected) {
            // Straight line for undirected
            pathD = `M${source.x},${source.y}L${target.x},${target.y}`;
            labelX = (source.x + target.x) / 2; labelY = (source.y + target.y) / 2 - 10;
        } else {
            // Curved or Straight for Directed
            const dr = Math.sqrt(dx * dx + dy * dy);
            const hasReverse = groupedTransitions.has(`${targetId}-${sourceId}`);
            if (hasReverse) {
                pathD = `M${source.x},${source.y}A${dr},${dr} 0 0,1 ${target.x},${target.y}`;
                labelX = (source.x + target.x) / 2 + (dy * 0.15); 
                labelY = (source.y + target.y) / 2 - (dx * 0.15);
            } else {
                pathD = `M${source.x},${source.y}L${target.x},${target.y}`;
                labelX = (source.x + target.x) / 2; labelY = (source.y + target.y) / 2 - 10;
            }
        }
      }

      transitionsGroup.append("path")
        .attr("id", `edge-${key}`)
        .attr("d", pathD)
        .attr("fill", "none")
        .attr("stroke", "#64748b")
        .attr("stroke-width", 2)
        .attr("marker-end", isUndirected ? null : "url(#arrowhead)");

      // Only show labels if not empty (Graph Coloring usually has empty labels)
      const labelText = labels.join('\n');
      if (labelText.trim() !== 'ε' && labelText.trim() !== '') {
          const text = labelsGroup.append("text")
            .attr("x", labelX)
            .attr("y", labelY)
            .attr("text-anchor", "middle")
            .attr("fill", "#1e293b")
            .attr("font-size", "11px")
            .attr("font-weight", "bold");
            
          labels.forEach((line, i) => {
              text.append("tspan").attr("x", labelX).attr("dy", i === 0 ? 0 : "1.2em").text(line);
          });
            
          const bbox = text.node()?.getBBox();
          if (bbox) {
              labelsGroup.insert("rect", "text")
                .attr("x", bbox.x - 2).attr("y", bbox.y - 2).attr("width", bbox.width + 4).attr("height", bbox.height + 4)
                .attr("fill", "rgba(255,255,255,0.85)").attr("rx", 2);
          }
      }
    });

    const nodeSelection = nodesGroup.selectAll("g")
      .data(config.states).enter().append("g")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .call(d3.drag<SVGGElement, DfaState>()
        .on("drag", (event, d) => d3.select(event.sourceEvent.target.parentNode).attr("transform", `translate(${event.x},${event.y})`))
        .on("end", (event, d) => onStateDragEnd(d.id, event.x, event.y))
      );

    // Start Arrow only for Automata, not PNP graphs typically
    if (!isUndirected) {
        const startState = config.states.find(s => s.isStart);
        if (startState) {
            svg.append("path").attr("d", `M${startState.x - 50},${startState.y}L${startState.x - 25},${startState.y}`).attr("stroke", "#3b82f6").attr("stroke-width", 3).attr("marker-end", "url(#start-arrow)");
            svg.append("text").attr("x", startState.x - 60).attr("y", startState.y + 4).attr("text-anchor", "end").attr("font-size", "14px").attr("fill", "#3b82f6").attr("font-weight", "bold").text("Start");
        }
    }

    nodeSelection.append("circle")
      .attr("r", 20)
      .attr("fill", d => {
          if (nodeColors && nodeColors[d.id]) return nodeColors[d.id];
          if (d.color) return d.color;
          return activeStateIds.includes(d.id) ? "#fde047" : "#fff";
      })
      .attr("stroke", d => activeStateIds.includes(d.id) ? "#eab308" : "#334155")
      .attr("stroke-width", d => activeStateIds.includes(d.id) ? 4 : 2)
      .style("cursor", onStateClick ? "pointer" : "move")
      .on("click", (event, d) => {
          if (onStateClick) {
              event.stopPropagation();
              onStateClick(d.id);
          }
      });

    // Accept rings (only for Automata)
    if (!isUndirected) {
        nodeSelection.filter(d => d.isAccept).append("circle")
          .attr("r", 16).attr("fill", "none").attr("stroke", d => activeStateIds.includes(d.id) ? "#eab308" : "#334155").attr("stroke-width", 2);
    }

    nodeSelection.append("text")
        .attr("dy", 5)
        .attr("text-anchor", "middle")
        .text(d => d.id)
        .attr("font-weight", "600")
        .attr("fill", d => {
             const fill = (nodeColors && nodeColors[d.id]) || d.color;
             if (fill && ['#ef4444', '#22c55e', '#3b82f6'].includes(fill)) return "#ffffff";
             return "#0f172a";
        })
        .style("pointer-events", "none");

    // Animation Particles
    if (activeStateIds.length > 0 && prevActiveStateIdsRef.current.length > 0 && !isUndirected) {
        prevActiveStateIdsRef.current.forEach(prevId => {
            activeStateIds.forEach(currId => {
                const pathNode = svg.select<SVGPathElement>(`#edge-${prevId}-${currId}`).node();
                if (pathNode) {
                    const particle = animationGroup.append("circle").attr("r", 6).attr("fill", "#eab308").attr("stroke", "#ffffff").attr("stroke-width", 2);
                    const totalLength = pathNode.getTotalLength();
                    particle.transition().duration(600).ease(d3.easeCubicInOut)
                        .attrTween("transform", function() { return function(t) { const point = pathNode.getPointAtLength(t * totalLength); return `translate(${point.x},${point.y})`; }; })
                        .remove();
                }
            });
        });
    }
    prevActiveStateIdsRef.current = activeStateIds;
  }, [config, activeStateIds, onStateDragEnd, nodeColors, isUndirected, onStateClick]);

  return <svg ref={svgRef} className="w-full h-full bg-slate-100 rounded-lg shadow-inner cursor-crosshair touch-none" />;
};

export default DfaGraph;
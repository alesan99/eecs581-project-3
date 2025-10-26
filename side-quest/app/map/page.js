/*
  Name: map/page.js
  Description: Map viewing page. Main map interface for tracking quest progress.
  Programmers: Alejandro Sandoval
  Date: 10/25/2025
  Revisions: N/A
  Errors: N/A
*/
"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { mapData } from "./mapData";
import { Node, NodeDialog } from "./node";

export default function MapPage() {
  return (
    <div className="page flex-1 flex flex-col w-full">
      <MapCanvas />
    </div>
  );
}

function MapCanvas() {
  const containerRef = useRef(null);
  const [nodes] = useState(mapData.nodes);
  const [selectedId, setSelectedId] = useState(null);
  const [nodeToggles, setNodeToggles] = useState(() =>
    Object.fromEntries(nodes.map(n => [n.id, Object.fromEntries(n.quests.map(opt => [opt, false]))]))
  );

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const isPanningRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });
  const movedRef = useRef(false);

  useEffect(() => {
    // center initial view on first node
    const start = nodes[0];
    const c = containerRef.current;
    if (c && start) {
      setPan({ x: c.clientWidth / 2 - start.x, y: c.clientHeight / 2 - start.y });
    }
  }, []);

  function onPointerDown(e) {
    if (e.button !== 0) return;
    if (e.target !== containerRef.current) return;
    isPanningRef.current = true;
    setIsPanning(true);
    movedRef.current = false;
    lastRef.current = { x: e.clientX, y: e.clientY };
    containerRef.current.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!isPanningRef.current) return;
    const dx = e.clientX - lastRef.current.x;
    const dy = e.clientY - lastRef.current.y;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) movedRef.current = true;
    lastRef.current = { x: e.clientX, y: e.clientY };
    setPan(p => ({ x: p.x + dx, y: p.y + dy }));
  }

  function onPointerUp(e) {
    if (!isPanningRef.current) return;
    isPanningRef.current = false;
    setIsPanning(false);
    movedRef.current = false;
    try { containerRef.current.releasePointerCapture(e.pointerId); } catch {}
  }

  function onNodePointerDown(e) {
    e.stopPropagation();
  }

  function onNodeClick(id) {
    if (movedRef.current) {
      movedRef.current = false;
      return;
    }
    setSelectedId(id);
  }

  function toggleOption(nodeId, option) {
    setNodeToggles(prev => ({
      ...prev,
      [nodeId]: { ...prev[nodeId], [option]: !prev[nodeId][option] },
    }));
  }

  function closeDialog() {
    setSelectedId(null);
  }

  const findNode = id => nodes.find(n => n.id === id);

  return (
    <div
      ref={containerRef}
  className={`relative w-full h-full ${isPanning ? "cursor-grabbing" : "cursor-grab"} bg-gray-50 dark:bg-gray-900 overflow-hidden border rounded`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div className="absolute top-0 left-0" style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}>
        <div
          className="absolute top-0 left-0 pointer-events-none select-none"
          style={{ zIndex: 0, width: mapData.background.width, height: mapData.background.height, opacity: mapData.background.opacity ?? 1 }}
        >
          <Image
            src={mapData.background.src}
            width={mapData.background.width}
            height={mapData.background.height}
            alt="map background"
            priority
            unoptimized
          />
        </div>
        
        <svg width={mapData.width} height={mapData.height} className="absolute top-0 left-0 pointer-events-none" style={{ overflow: "visible" }}>
          <g>
            {mapData.links.map(([a, b]) => {
              const na = findNode(a);
              const nb = findNode(b);
              if (!na || !nb) return null;
              return <line key={`${a}-${b}`} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke="#94a3b8" strokeWidth={2} strokeLinecap="round" />;
            })}
          </g>
        </svg>

        {nodes.map(n => (
          <Node key={n.id} node={n} onPointerDown={onNodePointerDown} onClick={() => onNodeClick(n.id)} />
        ))}
      </div>

      {selectedId && (
        <NodeDialog
          node={findNode(selectedId)}
          containerRef={containerRef}
          pan={pan}
          toggles={nodeToggles[selectedId]}
          onToggle={(opt) => toggleOption(selectedId, opt)}
          onClose={closeDialog}
        />
      )}
    </div>
  );
}
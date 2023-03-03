import React, { useState, useRef, useCallback } from "react";
import ForceGraph2D from "react-force-graph-2d";
import useData from "./useData";

const useOptions = () => {
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);
  const [nodeAmount, setNodeAmount] = useState(0);

  return {
    width,
    setWidth,
    height,
    setHeight,
    nodeAmount,
    setNodeAmount
  };
};

const App = () => {
  const {
    width,
    setWidth,
    height,
    setHeight,
    nodeAmount,
    setNodeAmount
  } = useOptions();
  const NODE_R = 8;

  const data = useData(nodeAmount);
  const graphRef = useRef(null);

  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);
  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };

  const handleNodeHover = node => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (node) {
      highlightNodes.add(node);
      console.log(node.neighbors);
      node.neighbors &&
        node.neighbors.forEach(neighbor => highlightNodes.add(neighbor));
      node.links && node.links.forEach(link => highlightLinks.add(link));
    }

    setHoverNode(node || null);
    updateHighlight();
  };

  const styles = {
    width,
    height,
    border: "1px solid black"
  };

  const paintRing = useCallback(
    (node, ctx) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_R * 1.4, 0, 2 * Math.PI, false);
      ctx.fillStyle = node === hoverNode ? "red" : "orange";
      ctx.fill();
    },
    [hoverNode]
  );

  const handleLinkHover = link => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }

    updateHighlight();
  };

  const handleNodeRightClick = node => {
    console.log(node);
  };

  const graphData = {
    nodes: data.nodes,
    links: data.edges
  };

  return (
    <div>
      <div style={styles}>
        <ForceGraph2D
          width={width}
          height={height}
          ref={graphRef}
          nodeRelSize={NODE_R}
          graphData={graphData}
          nodeCanvasObjectMode={node =>
            highlightNodes.has(node) ? "before" : undefined
          }
          nodeCanvasObject={paintRing}
          // @ highlight
          // linkWidth={link => (highlightLinks.has(link) ? 5 : 1)}
          // linkDirectionalParticles={link => (highlightLinks.has(link) ? 2 : 0)}
          // onNodeHover={handleNodeHover}
          // onLinkHover={handleLinkHover}
          onNodeRightClick={handleNodeRightClick}
          // onNodeClick
          // onBackgroundClick
          // onBackgroundRightClick
        />
      </div>
      <div>
        <div>
          width：
          <input value={width} onChange={e => setWidth(e.target.value)} />
        </div>
        <div>
          height：
          <input value={height} onChange={e => setHeight(e.target.value)} />
        </div>
        <div>
          node Amount：
          <input
            value={nodeAmount}
            onChange={e => setNodeAmount(e.target.value)}
          />
        </div>
      </div>
      <ul>
        <li>1、拖动</li>
        <li>2、缩放</li>
      </ul>
    </div>
  );
};

export default App;

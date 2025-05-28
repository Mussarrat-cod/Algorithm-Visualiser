const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

let nodes = [];
let edges = [];
let mode = "node";
let selectedNode = null;

function setMode(m) {
  mode = m;
  selectedNode = null;
}

canvas.addEventListener("click", e => {
  const x = e.offsetX;
  const y = e.offsetY;

  if (mode === "node") {
    const id = String.fromCharCode(65 + nodes.length);
    nodes.push({ id, x, y });
    updateNodeOptions();
  } else if (mode === "edge") {
    const clicked = getNodeAt(x, y);
    if (clicked) {
      if (!selectedNode) {
        selectedNode = clicked;
        highlightNode(clicked);
      } else if (selectedNode !== clicked) {
        const weight = parseInt(prompt("Enter weight:"), 10);
        if (!isNaN(weight)) {
          edges.push({ from: selectedNode.id, to: clicked.id, weight });
        }
        selectedNode = null;
      }
    }
  }

  draw();
});

function getNodeAt(x, y) {
  return nodes.find(n => Math.hypot(n.x - x, n.y - y) < 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw edges
  edges.forEach(edge => {
    const from = nodes.find(n => n.id === edge.from);
    const to = nodes.find(n => n.id === edge.to);

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    ctx.fillText(edge.weight, midX, midY);
  });

  // Draw nodes
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, 20, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.fillText(n.id, n.x - 5, n.y + 5);
  });
}

function highlightNode(node) {
  ctx.beginPath();
  ctx.arc(node.x, node.y, 22, 0, Math.PI * 2);
  ctx.strokeStyle = "red";
  ctx.stroke();
  ctx.strokeStyle = "black";
}

function updateNodeOptions() {
  const startSel = document.getElementById("startNode");
  const endSel = document.getElementById("endNode");
  startSel.innerHTML = "";
  endSel.innerHTML = "";
  nodes.forEach(n => {
    const opt1 = new Option(n.id, n.id);
    const opt2 = new Option(n.id, n.id);
    startSel.add(opt1);
    endSel.add(opt2);
  });
}

function reset() {
  nodes = [];
  edges = [];
  selectedNode = null;
  updateNodeOptions();
  draw();
}

// ==== DIJKSTRA CORE ====

async function runDijkstra() {
  const start = document.getElementById("startNode").value;
  const end = document.getElementById("endNode").value;

  const graph = {};
  nodes.forEach(n => (graph[n.id] = []));
  edges.forEach(e => {
    graph[e.from].push({ node: e.to, weight: e.weight });
    graph[e.to].push({ node: e.from, weight: e.weight }); // bidirectional
  });

  const path = await dijkstra(graph, start, end, animateStep);
  highlightPath(path);
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function animateStep(current, distances, visited) {
  const node = nodes.find(n => n.id === current);
  highlightNode(node);
  await sleep(300);
}

function highlightPath(path) {
  for (let i = 0; i < path.length - 1; i++) {
    const from = nodes.find(n => n.id === path[i]);
    const to = nodes.find(n => n.id === path[i + 1]);
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = "green";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
  }
}

// ==== Priority Queue + Dijkstra ====

class MinPriorityQueue {
  constructor() {
    this.items = [];
  }
  enqueue(element, priority) {
    this.items.push({ element, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }
  dequeue() {
    return this.items.shift();
  }
  isEmpty() {
    return this.items.length === 0;
  }
}

async function dijkstra(graph, start, end, visualizeStep) {
  const distances = {}, prev = {}, visited = new Set();
  for (const node in graph) {
    distances[node] = Infinity;
    prev[node] = null;
  }
  distances[start] = 0;

  const pq = new MinPriorityQueue();
  pq.enqueue(start, 0);

  while (!pq.isEmpty()) {
    const { element: current } = pq.dequeue();
    visited.add(current);
    await visualizeStep(current, distances, visited);

    if (current === end) break;

    for (const neighbor of graph[current]) {
      const alt = distances[current] + neighbor.weight;
      if (alt < distances[neighbor.node]) {
        distances[neighbor.node] = alt;
        prev[neighbor.node] = current;
        pq.enqueue(neighbor.node, alt);
      }
    }
  }

  // Reconstruct path
  const path = [];
  let curr = end;
  while (curr !== null) {
    path.unshift(curr);
    curr = prev[curr];
  }
  return path[0] === start ? path : [];
}

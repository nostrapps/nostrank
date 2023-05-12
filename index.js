// Mock data
const profiles = [
  {
    "id": "1",
    "name": "Alice",
    "connections": ["2", "3"]
  },
  {
    "id": "2",
    "name": "Bob",
    "connections": ["1", "3", "4"]
  },
  // ... more profiles
];

// Initialize
const N = profiles.length;
const d = 0.85;
const initialScore = 1 / N;
let scores = {};
let newScores = {};
profiles.forEach(profile => {
  scores[profile.id] = initialScore;
  newScores[profile.id] = 0;
});

// Create a mapping from profile ID to connections for faster lookup
let connections = {};
profiles.forEach(profile => {
  connections[profile.id] = profile.connections;
});

// Iterate until convergence
let maxIterations = 100;
let epsilon = 0.0001;  // stop if all page ranks change by less than this
for (let iter = 0; iter < maxIterations; iter++) {
  // Distribute scores
  for (let id in scores) {
    let currentScore = scores[id];
    let distributedScore = currentScore * d / connections[id].length;
    connections[id].forEach(connectionId => {
      newScores[connectionId] += distributedScore;
    });
  }

  // Apply damping factor and check for convergence
  let hasConverged = true;
  for (let id in scores) {
    newScores[id] = newScores[id] * d + (1 - d) / N;
    if (Math.abs(newScores[id] - scores[id]) > epsilon) {
      hasConverged = false;
    }
  }

  // Swap scores and newScores, and clear newScores for next iteration
  [scores, newScores] = [newScores, scores];
  for (let id in newScores) {
    newScores[id] = 0;
  }

  if (hasConverged) {
    break;
  }
}

console.log(scores);


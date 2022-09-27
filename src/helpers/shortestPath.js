/**
 * Basic priority queue implementation. If a better priority queue is wanted/needed,
 * this code works with the implementation in google's closure library (https://code.google.com/p/closure-library/).
 * Use goog.require('goog.structs.PriorityQueue'); and new goog.structs.PriorityQueue()
 */
function PriorityQueue() {
  this._nodes = [];

  this.enqueue = function (priority, key) {
    this._nodes.push({ key: key, priority: priority });
    this.sort();
  };
  this.dequeue = function () {
    return this._nodes.shift().key;
  };
  this.sort = function () {
    this._nodes.sort(function (a, b) {
      return a.priority - b.priority;
    });
  };
  this.isEmpty = function () {
    return !this._nodes.length;
  };
}

/**
 * Pathfinding starts here
 */
export function Graph() {
  var INFINITY = 1 / 0;
  this.vertices = {};

  this.addVertex = function (name, edges) {
    this.vertices[name] = edges;
  };

  this.shortestPath = function (start, finish) {
    var nodes = new PriorityQueue(),
      distances = {},
      previous = {},
      path = [],
      smallest,
      vertex,
      neighbor,
      alt;

    for (vertex in this.vertices) {
      if (vertex === start) {
        distances[vertex] = 0;
        nodes.enqueue(0, vertex);
      } else {
        distances[vertex] = INFINITY;
        nodes.enqueue(INFINITY, vertex);
      }

      previous[vertex] = null;
    }

    while (!nodes.isEmpty()) {
      smallest = nodes.dequeue();

      if (smallest === finish) {
        path = [];

        while (previous[smallest]) {
          path.push(smallest);
          smallest = previous[smallest];
        }

        break;
      }

      if (!smallest || distances[smallest] === INFINITY) {
        continue;
      }

      for (neighbor in this.vertices[smallest]) {
        alt = distances[smallest] + this.vertices[smallest][neighbor];

        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = smallest;

          nodes.enqueue(alt, neighbor);
        }
      }
    }

    return path;
  };
}

// var g = new Graph();

// g.addVertex('O', { A: 4, B: 6, C: 5 });
// g.addVertex('A', { O: 4, B: 1, D: 7 });
// g.addVertex('B', { A: 1, O: 6, C: 2, E: 4, D: 5 });
// g.addVertex('C', { O: 5, B: 2, E: 5 });
// g.addVertex('D', { A: 7, B: 5, E: 1, T: 6 });
// g.addVertex('E', { D: 1, B: 4, C: 5, T: 8 });
// g.addVertex('T', { D: 6, E: 8 });

// // Log test, with the addition of reversing the path and prepending the first node so it's more readable
// console.log(g.shortestPath('O', 'T').concat(['O']).reverse());

G6.registerLayout("bigraph-layout", {
  // 默认参数
  getDefaultCfg: function getDefaultCfg() {
    return {
      center: [0, 0], // 布局的中心
      biSep: 100, // 两部分的间距
      nodeSep: 20, // 同一部分的节点间距
      direction: "horizontal", // 两部分的分布方向
      nodeSize: 20 // 节点大小
    };
  },
  // 执行布局
  execute: function execute() {
    var self = this;
    var center = self.center;
    var biSep = self.biSep;
    var nodeSep = self.nodeSep;
    var nodeSize = self.nodeSize;
    var part1Pos = 0,
      part2Pos = 0;
    // 若指定为横向分布
    if (self.direction === "horizontal") {
      part1Pos = center[0] - biSep / 2;
      part2Pos = center[0] + biSep / 2;
    }
    var nodes = self.nodes;
    var edges = self.edges;
    var part1Nodes = [];
    var part2Nodes = [];
    var part1NodeMap = new Map();
    var part2NodeMap = new Map();
    // separate the nodes and init the positions
    nodes.forEach(function(node, i) {
      if (node.cluster === "part1") {
        part1Nodes.push(node);
        part1NodeMap.set(node.id, i);
      } else {
        part2Nodes.push(node);
        part2NodeMap.set(node.id, i);
      }
    });

    // 对 part1 的节点进行排序
    part1Nodes.forEach(function(p1n) {
      var index = 0;
      var adjCount = 0;
      edges.forEach(function(edge) {
        var sourceId = edge.source;
        var targetId = edge.target;
        if (sourceId === p1n.id) {
          index += part2NodeMap.get(targetId);
          adjCount++;
        } else if (targetId === p1n.id) {
          index += part2NodeMap.get(sourceId);
          adjCount++;
        }
      });
      index /= adjCount;
      p1n.index = index;
    });
    part1Nodes.sort(function(a, b) {
      return a.index - b.index;
    });

    // 对 part2 的节点进行排序
    part2Nodes.forEach(function(p2n) {
      var index = 0;
      var adjCount = 0;
      edges.forEach(function(edge) {
        var sourceId = edge.source;
        var targetId = edge.target;
        if (sourceId === p2n.id) {
          index += part1NodeMap.get(targetId);
          adjCount++;
        } else if (targetId === p2n.id) {
          index += part1NodeMap.get(sourceId);
          adjCount++;
        }
      });
      index /= adjCount;
      p2n.index = index;
    });
    part2Nodes.sort(function(a, b) {
      return a.index - b.index;
    });

    // 放置节点
    var hLength =
      part1Nodes.length > part2Nodes.length
        ? part1Nodes.length
        : part2Nodes.length;
    var height = hLength * (nodeSep + nodeSize);
    var begin = center[1] - height / 2;
    if (self.direction === "vertical") {
      begin = center[0] - height / 2;
    }
    part1Nodes.forEach(function(p1n, i) {
      if (self.direction === "horizontal") {
        p1n.x = part1Pos;
        p1n.y = begin + i * (nodeSep + nodeSize);
      } else {
        p1n.x = begin + i * (nodeSep + nodeSize);
        p1n.y = part1Pos;
      }
    });
    part2Nodes.forEach(function(p2n, i) {
      if (self.direction === "horizontal") {
        p2n.x = part2Pos;
        p2n.y = begin + i * (nodeSep + nodeSize);
      } else {
        p2n.x = begin + i * (nodeSep + nodeSize);
        p2n.y = part2Pos;
      }
    });
  }
});

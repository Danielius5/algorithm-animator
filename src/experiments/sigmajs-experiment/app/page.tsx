"use client";
import "@react-sigma/core/lib/react-sigma.min.css";
import Graph, { DirectedGraph, MultiDirectedGraph, UndirectedGraph } from "graphology";
import { SigmaContainer } from "@react-sigma/core";
import { FC } from "react";

const LoadGraphWithByProp: FC = () => {
  // Create the graph
  const graph = new MultiDirectedGraph({allowSelfLoops:true});
  graph.addNode("A", { x: 0, y: 0, label: "S1", size: 25 });
  graph.addNode("B", { x: 1, y: 1, label: "S2", size: 25 });
  graph.addEdge("A", "A", { label: "A", type:"arrow"});
  graph.addEdge("A", "B", { label: "B", type:"arrow", size:10});

  return <SigmaContainer style={{ height: "500px" }} graph={graph} settings={{renderEdgeLabels : true}} ></SigmaContainer>;
};

export default LoadGraphWithByProp;
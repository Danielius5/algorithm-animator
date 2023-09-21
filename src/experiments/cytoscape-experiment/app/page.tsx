"use client";
import Image from "next/image";
import cytoscape from "cytoscape";
import { useEffect, useRef } from "react";

/* useful links:
https://js.cytoscape.org/demos/labels/code.js
*/
export default function Home() {
  const graphRef = useRef(null);

  useEffect(() => {
    let cy = cytoscape({
      container: graphRef.current, // container to render in
      layout: {
        name: "breadthfirst",
        roots: ["a"],
        // position: function(node) {
        //   return {
        //    row: node.data('row'),
        //    col: node.data('col')
        //   }
        // },
        // condense: false,
        // rows:5,
        // cols:5
      },
      elements: [
        { data: { id: "a", label: "S1" } },
        { data: { id: "b", label: "S2" } },
        { data: { id: "c", label: "S3" } },
        { data: { id: "d", label: "S4" }, classes: ["accepted-state"] },
        {
          data: {
            id: "ab",
            label: "a",
            source: "a",
            target: "b",
          },
        },
        {
          data: {
            id: "ac",
            label: "b",
            source: "a",
            target: "c",
          },
        },
        {
          data: {
            id: "cd",
            label: "b",
            source: "c",
            target: "d",
          },
        },
        {
          data: {
            id: "bd",
            label: "a",
            source: "b",
            target: "d",
          },
        },
        {
          data: {
            id: "dd",
            label: "a,b",
            source: "d",
            target: "d",
          },
        },
        {
          data: {
            id: "bc",
            label: "a",
            source: "b",
            target: "c",
          },
        },
        {
          data: {
            id: "cb",
            label: "b",
            source: "c",
            target: "b",
          },
        },
      ],
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            "text-valign": "center",
            "text-halign": "center",
            width: "50px",
            height: "50px",
            "border-color": "#333",
            "border-width": "1px",
            "background-color": "#fff",
          },
        },
        {
          selector: "edge",
          style: {
            label: "data(label)",
            width: "2px",
            "text-valign": "bottom",
            "target-arrow-shape": "triangle",
            "target-arrow-color": "#333",
            "curve-style": "bezier",
            "font-size": "30px",
            color: "#333",
          },
        },
        {
          selector: ".accepted-state",
          style: { "border-color": "#f00", "border-width": "3px" },
        },
      ],
    });
    cy.fit();
  }, []);
  return (
    <div>
      <div ref={graphRef} style={{ width: "500px", height: "500px" }}></div>
    </div>
  );
}

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

function LaplaceBarChart({ width, height, trueValue, sensitivity, epsilon }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // The fixed base height of the bar is 250.
    const baseHeight = 250;

    // Adjust the scale parameter b based on the true value to make noise proportional.
    const b = sensitivity / epsilon / trueValue; // Scale noise with trueValue

    // Laplace random variable generator function
    const laplaceRandom = () => {
      const u = Math.random() - 0.5;
      return (u < 0 ? 1 : -1) * b * Math.log(1 - 2 * Math.abs(u));
    };

    // Generate samples and calculate the height for each bar.
    const samples = Array.from(
      { length: 50 },
      () => laplaceRandom() * baseHeight
    );

    // Clear the previous visualization
    svg.selectAll("*").remove();

    // Draw the bars
    svg
      .selectAll("rect")
      .data(samples)
      .enter()
      .append("rect")
      .attr("x", 0) // Adjust to center the bar if needed
      .attr("y", (d) => height - baseHeight - d) // Position the bottom of the bar fixed, only the top changes with noise
      .attr("width", width) // Width of the entire SVG
      .attr("height", (d) => baseHeight + d) // Height includes the noise, affecting only the top part of the bar
      .style("fill", "none")
      .style("stroke", "steelblue")
      .style("stroke-opacity", 0.2)
      .style("stroke-width", 0.5);
  }, [width, height, trueValue, sensitivity, epsilon]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
}

export default LaplaceBarChart;

// svg
//   .selectAll("rect")
//   .data(samples)
//   .enter()
//   .append("rect")
//   .attr("x", 0) // Adjust to center the bar if needed
//   .attr("y", (d) => height - 50 - d)
//   .attr("width", 39) // Width of the entire SVG
//   .attr("height", (d) => d)
//   .style("fill", "none")
//   .style("stroke", "steelblue")
//   .style("stroke-opacity", 0.2)
//   .style("stroke-width", 0.5);

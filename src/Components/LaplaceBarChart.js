import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

function LaplaceBarChart({ width, height, trueValue, sensitivity, epsilon }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Constants
    const baseHeight = 250;
    const nonPrivateBarColor = "red";
    const privateBarColor = "steelblue";
    const b = sensitivity / epsilon / trueValue;
    const curveWidth = 100; // Width reserved for the curve
    // Laplace random variable generator
    const laplaceRandom = () => {
      const u = Math.random() - 0.5;
      return (u < 0 ? 1 : -1) * b * Math.log(1 - 2 * Math.abs(u));
    };

    // Generate samples
    const samples = Array.from(
      { length: 50 },
      () => laplaceRandom() * baseHeight
    );

    // Clear previous visualization
    svg.selectAll("*").remove();

    // Draw noisy bars
    svg
      .selectAll("rect.noisy")
      .data(samples)
      .enter()
      .append("rect")
      .attr("class", "noisy")
      .attr("x", 0)
      .attr("y", (d) => height - baseHeight - d)
      .attr("width", width - curveWidth)
      .attr("height", (d) => baseHeight + d)
      .style("fill", "none")
      .style("stroke", privateBarColor)
      .style("stroke-opacity", 0.4)
      .style("stroke-width", 0.5);

    // Draw non-private output bar
    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", height - baseHeight)
      .attr("width", width - curveWidth)
      .attr("height", baseHeight + trueValue)
      .style("fill", "none")
      .style("stroke", nonPrivateBarColor)
      .style("stroke-opacity", 1)
      .style("stroke-width", 1);

    // Draw Laplace distribution curve
    // ...

    // Scale for the Laplace distribution curve
    const laplace = (x, mu = 0, b = b) =>
      (1 / (2 * b)) * Math.exp(-Math.abs(x - mu) / b);

    // Generate points for the curve
    const points = d3.range(-1, 1, 0.001).map((x) => ({
      x: x,
      y: laplace(x, 0, b), // Using b from your sensitivity / epsilon / trueValue calculation
    }));

    // Scale for the curve
    const scaleX = d3.scaleLinear().domain([-1, 1]).range([0, height]);
    // ...

    // Adjust the scaleY range to make the curve less tall
    const scaleY = d3
      .scaleLinear()
      .domain([0, Math.max(...points.map((d) => d.y))])
      .range([30, 0]); // Increase the lower bound of the range

    // ...

    // Laplace dist

    // Laplace distribution curve
    const laplaceCurve = d3
      .line()
      .curve(d3.curveNatural)
      .x((d) => scaleX(d.x)) // Shift the curve to the right
      .y((d) => scaleY(d.y)); // Shift the curve downwards

    // Append the curve to the SVG
    svg
      .append("path")
      .datum(points)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("d", laplaceCurve)
      .attr("transform", `translate(${width - 50}, ${0}) rotate(90)`);

    // TODO: Add arrow paths if needed
  }, [width, height, trueValue, sensitivity, epsilon]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
}

export default LaplaceBarChart;

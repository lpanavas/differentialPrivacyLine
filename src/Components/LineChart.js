import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

function LineChart({
  width,
  height,
  minEpsilon,
  maxEpsilon,
  trueValue,
  selectedEpsilon,
  setSelectedEpsilon,
  releaseQueries,
  k,
  sensitivity,
}) {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const delta = 0.05;
    const delta_gaussian = 0.00001; // <- Different delta for Gaussian noise

    const dataLaplace = Array.from({ length: 100 }, (_, index) => {
      const computedEpsilon =
        minEpsilon + (maxEpsilon - minEpsilon) * (index / 99);
      const error =
        Math.log(k / delta) *
        ((sensitivity * releaseQueries) / computedEpsilon);
      return { epsilon: computedEpsilon, error: error };
    });

    // Gaussian error data
    const dataGaussian = Array.from({ length: 100 }, (_, index) => {
      const computedEpsilon =
        minEpsilon + (maxEpsilon - minEpsilon) * (index / 99);
      const sigma =
        (sensitivity * Math.sqrt(2 * Math.log(1.25 / delta_gaussian) * k)) / // <- Adjusted for sqrt(k)
        computedEpsilon;
      const error = sigma * 1.96; // 95% confidence interval for Gaussian noise
      console.log(
        `Epsilon: ${computedEpsilon}, Sigma: ${sigma}, Sensitivity: ${sensitivity}, Delta: ${delta_gaussian}`
      ); // Debugging line

      return {
        epsilon: computedEpsilon,
        error: error,
      };
    });

    const xScale = d3
      .scaleLinear()
      .domain([minEpsilon, maxEpsilon])
      .range([60, width - 10]);
    const yScale = d3
      .scaleLinear()
      // .domain([0, d3.max(dataLaplace, (d) => d.error)])
      .domain([0, trueValue])
      .range([height - 50, 10]);

    const line = d3
      .line()
      .x((d) => xScale(d.epsilon))
      .y((d) => yScale(d.error));

    svg.selectAll("*").remove();

    // Axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height - 50})`)
      .call(d3.axisBottom(xScale).ticks(10));
    svg
      .append("g")
      .attr("transform", "translate(60,0)")
      .call(d3.axisLeft(yScale));

    // Laplace error line
    svg
      .append("path")
      .datum(dataLaplace)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("d", line);

    svg
      .append("path")
      .datum(dataGaussian)
      .attr("fill", "none")
      .attr("stroke", "green") // Different color for the Gaussian line
      .attr("d", line);

    // Draggable red line
    const selectedXPosition = xScale(selectedEpsilon);
    const epsilonLine = svg
      .append("line")
      .attr("x1", selectedXPosition)
      .attr("y1", 10)
      .attr("x2", selectedXPosition)
      .attr("y2", height - 50)
      .attr("stroke", "red")
      .attr("stroke-width", "1") // Increased stroke-width for better clickability
      .attr("stroke-dasharray", "1")
      .style("cursor", "ew-resize"); // Cursor indicates horizontal movement

    // Transparent rectangle for better clickability and dragging
    const dragAreaWidth = 10; // Width of the invisible area for easier dragging
    svg
      .append("rect")
      .attr("x", selectedXPosition - dragAreaWidth / 2)
      .attr("y", 10)
      .attr("width", dragAreaWidth)
      .attr("height", height - 50)
      .attr("fill", "transparent")
      .style("cursor", "ew-resize")
      .call(
        d3.drag().on("drag", (event) => {
          const newX = Math.max(60, Math.min(width - 10, event.x));
          const newEpsilon = xScale.invert(newX);
          epsilonLine
            .attr("x1", xScale(newEpsilon))
            .attr("x2", xScale(newEpsilon));
          d3.select(event.sourceEvent.target).attr(
            "x",
            xScale(newEpsilon) - dragAreaWidth / 2
          );
          setSelectedEpsilon(newEpsilon);
        })
      );
    // Legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 150},20)`);
    legend
      .append("circle")
      .attr("cx", 10)
      .attr("cy", 0)
      .attr("r", 6)
      .style("fill", "blue");
    legend
      .append("text")
      .attr("x", 30)
      .attr("y", 0)
      .text("Laplace Error")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    legend
      .append("circle")
      .attr("cx", 10)
      .attr("cy", 20) // Position below the Laplace legend entry
      .attr("r", 6)
      .style("fill", "green"); // Same color as the Gaussian line
    legend
      .append("text")
      .attr("x", 30)
      .attr("y", 20) // Align with the circle
      .text("Gaussian Error")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    // Axis labels
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
      .attr("x", -height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Predicted Error (95% confidence)");
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 5)
      .attr("dy", "-0.5em")
      .style("text-anchor", "middle")
      .text("Epsilon (ε)");
  }, [
    minEpsilon,
    maxEpsilon,
    width,
    height,
    trueValue,
    selectedEpsilon,
    releaseQueries,
    k,
    sensitivity,
    setSelectedEpsilon,
  ]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
}

export default LineChart;

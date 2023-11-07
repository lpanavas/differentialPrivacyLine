import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function SingleBarComponent({
  width,
  height,
  trueValue, // Input for the true height of the bar
  minEpsilon,
  maxEpsilon,
  selectedEpsilon,
  k,
  sensitivity,
}) {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Define the blur filter
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "blur");
    filter
      .append("feGaussianBlur")
      .attr("in", "SourceGraphic")
      .attr("stdDeviation", "5");

    const b = sensitivity / selectedEpsilon;
    const laplacePdf = (x) => (1 / (2 * b)) * Math.exp(-Math.abs(x) / b);

    const yScale = d3
      .scaleLinear()
      .domain([0, trueValue + laplacePdf(0)])
      .range([height - 50, 10]);

    // Render main bar with reduced opacity
    const barWidth = 50;
    svg
      .append("rect")
      .attr("x", width / 2 - barWidth / 2)
      .attr("y", yScale(trueValue))
      .attr("width", barWidth)
      .attr("height", height - yScale(trueValue))
      .style("fill", "#69b3a2")
      .style("fill-opacity", 0.5);

    // Adjusting error distribution height (Laplace noise) while keeping same shading
    const errorHeight = height - yScale(laplacePdf(0));
    svg
      .append("rect")
      .attr("x", width / 2 - barWidth / 2)
      .attr("y", yScale(trueValue))
      .attr("width", barWidth)
      .attr("height", errorHeight)
      .style("fill", "#457b9d")
      .attr("filter", "url(#blur)");
  }, [
    width,
    height,
    trueValue,
    minEpsilon,
    maxEpsilon,
    selectedEpsilon,
    k,
    sensitivity,
  ]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
}

export default SingleBarComponent;

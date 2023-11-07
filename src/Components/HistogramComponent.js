import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function HistogramComponent() {
  const ref = useRef(null);

  useEffect(() => {
    const svg = d3.select(ref.current);

    // Define the blur filter
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "blur");
    filter
      .append("feGaussianBlur")
      .attr("in", "SourceGraphic")
      .attr("stdDeviation", "5"); // Adjust for desired blur intensity

    // Sample data and histogram setup
    const data = Array.from({ length: 1000 }, d3.randomNormal(0, 1));
    const histogram = d3.histogram().domain([-5, 5])(data);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(histogram, (d) => d.length)])
      .range([300, 0]);
    const xScale = d3.scaleLinear().domain([-5, 5]).range([0, 500]);

    // Create bars with reduced opacity
    svg
      .selectAll(".bar")
      .data(histogram)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.x0))
      .attr("y", (d) => yScale(d.length))
      .attr("width", (d) => xScale(d.x1) - xScale(d.x0))
      .attr("height", (d) => 300 - yScale(d.length))
      .style("fill", "#69b3a2")
      .style("fill-opacity", 0.5); // Adjust for desired opacity

    // Add blurry error bars on top
    svg
      .selectAll(".error")
      .data(histogram)
      .enter()
      .append("rect")
      .attr("class", "error")
      .attr("x", (d) => xScale(d.x0))
      .attr("y", (d) => yScale(d.length))
      .attr("width", (d) => xScale(d.x1) - xScale(d.x0))
      .attr("height", (d) => (300 - yScale(d.length)) * 0.1) // 10% error for illustration
      .style("fill", "#457b9d")
      .attr("filter", "url(#blur)");
  }, []);

  return (
    <div>
      <svg ref={ref} width="520" height="320"></svg>
    </div>
  );
}

export default HistogramComponent;

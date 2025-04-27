"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";

interface GlobeProps {
  rotateTo: { longitude: number; latitude: number; name: string } | null;
}

export default function Globe({ rotateTo }: GlobeProps) {
  const globeRef = useRef<SVGSVGElement>(null);
  const globeState = useRef<{
    projection: d3.GeoProjection;
    pathGenerator: d3.GeoPath;
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    marker: d3.Selection<SVGGElement, unknown, null, undefined>;
  } | null>(null);

  // Function to update the marker
  const updateMarker = () => {
    if (!globeState.current || !rotateTo) return;
    
    const { projection, marker } = globeState.current;
    marker.selectAll("*").remove();
    
    if (!isNaN(rotateTo.longitude) && !isNaN(rotateTo.latitude)) {
      const [x, y] = projection([
        rotateTo.longitude,
        rotateTo.latitude,
      ]) || [0, 0];

      marker
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 8)
        .attr("fill", "#FF5733")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 2)
        .attr("filter", "url(#drop-shadow)");

      marker
        .append("text")
        .attr("x", x)
        .attr("y", y - 12)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "#333")
        .attr("stroke", "white")
        .attr("stroke-width", "0.8px")
        .text(rotateTo.name);
    }
  };

  // Initialize the globe
  useEffect(() => {
    if (!globeRef.current || globeState.current) return;

    const width = 600;
    const height = 600;
    const sensitivity = 75;

    const projection = geoOrthographic()
      .scale(250)
      .translate([width / 2, height / 2])
      .clipAngle(90);

    const pathGenerator = geoPath(projection);

    const svg = d3
      .select(globeRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("display", "block");

    svg
      .append("path")
      .datum({ type: "Sphere" })
      .attr("fill", "lightblue")
      .attr("stroke", "black")
      .attr("d", pathGenerator as any);

    svg
      .append("path")
      .datum(d3.geoGraticule10())
      .attr("stroke", "#ccc")
      .attr("fill", "none")
      .attr("d", pathGenerator as any);

    const map = svg.append("g");
    const marker = svg.append("g").attr("class", "marker");

    d3.json<Topology>(
      "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
    ).then((topology) => {
      if (!topology) return;

      const world = feature(topology, topology.objects.countries as any);

      map
        .append("path")
        .datum(world as any)
        .attr("fill", "#e5e5e5")
        .attr("stroke", "#ddd")
        .attr("d", pathGenerator as any);

      svg.call(
        d3.drag<SVGSVGElement, unknown>().on("drag", (event) => {
          const rotate = projection.rotate();
          const k = sensitivity / projection.scale();
          projection.rotate([
            rotate[0] + event.dx * k,
            rotate[1] - event.dy * k,
          ]);
          pathGenerator.projection(projection);
          svg.selectAll("path").attr("d", pathGenerator as any);
          updateMarker();
        })
      );

      const initialScale = projection.scale();
      svg.call(
        d3.zoom<SVGSVGElement, unknown>().on("zoom", (event) => {
          const { transform } = event;
          if (transform.k > 0.3) {
            projection.scale(initialScale * transform.k);
            pathGenerator.projection(projection);
            svg.selectAll("path").attr("d", pathGenerator as any);
            updateMarker();
          } else {
            transform.k = 0.3;
          }
        })
      );

      svg
        .append("defs")
        .append("filter")
        .attr("id", "drop-shadow")
        .append("feDropShadow")
        .attr("dx", 0)
        .attr("dy", 3)
        .attr("stdDeviation", 3)
        .attr("flood-color", "black")
        .attr("flood-opacity", 0.3);

      // Store the globe state
      globeState.current = {
        projection,
        pathGenerator,
        svg,
        marker
      };

      // Initial marker update
      updateMarker();
    });

    return () => {
      d3.select(globeRef.current).selectAll("*").remove();
      globeState.current = null;
    };
  }, []); // Empty dependency array - only run once

  // Handle rotation updates
  useEffect(() => {
    if (!globeState.current || !rotateTo) return;

    const { projection, pathGenerator, svg } = globeState.current;

    const currentRotation = projection.rotate();
    const targetRotation = [-rotateTo.longitude, -rotateTo.latitude] as [number, number];
    
    // Calculate the shortest path for longitude
    let longitudeDiff = targetRotation[0] - currentRotation[0];
    if (Math.abs(longitudeDiff) > 180) {
      longitudeDiff = longitudeDiff > 0 ? longitudeDiff - 360 : longitudeDiff + 360;
    }
    
    const r = d3.interpolate(currentRotation, [
      currentRotation[0] + longitudeDiff,
      targetRotation[1]
    ] as [number, number]);

    d3.transition()
      .duration(1250)
      .tween("rotate", () => {
        return (t: number) => {
          projection.rotate(r(t));
          pathGenerator.projection(projection);
          svg.selectAll("path").attr("d", pathGenerator as any);
          updateMarker();
        };
      });
  }, [rotateTo]); // Only run when rotateTo changes

  return <svg ref={globeRef}></svg>;
}

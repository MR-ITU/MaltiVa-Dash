import React, { useState, useEffect, useMemo, useRef } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import * as topojson from 'topojson-client';

// ONLY THESE FIVE LOCATIONS WILL BE SHOWN
const locations = [
  { lat: 40.7128, lng: -74.0060, name: 'USA (New York)' },
  { lat: 52.5200, lng: 13.4050, name: 'Germany (Berlin)' },
  { lat: 35.6895, lng: 139.6917, name: 'Japan (Tokyo)' },
  { lat: -22.9068, lng: -43.1729, name: 'Brazil (Rio de Janeiro)' },
  { lat: 28.6139, lng: 77.2090, name: 'India (New Delhi)' },
];

interface Location {
  lat: number;
  lng: number;
  name: string;
}

interface InteractiveGlobeProps {
  width?: string | number;
  height?: string | number;
  backgroundColor?: string;
}

const InteractiveGlobe: React.FC<InteractiveGlobeProps> = ({
  width = '100%',
  height = '100%',
  backgroundColor = 'transparent', 
}) => {
  const [landPolygons, setLandPolygons] = useState<any[]>([]);
  const globeRef = useRef<any>();

  useEffect(() => {
    fetch('//unpkg.com/world-atlas@2.0.2/land-110m.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(landTopo => {
        if (landTopo?.objects?.land) {
          setLandPolygons(topojson.feature(landTopo, landTopo.objects.land).features);
        } else {
          console.error("Invalid land data format");
          setLandPolygons([]);
        }
      })
      .catch(err => {
        console.error("Error fetching land data:", err);
        setLandPolygons([]);
      });
  }, []);

  const globeMaterial = useMemo(() => new THREE.MeshPhongMaterial({
    color: '#071026',
    specular: '#0a1a3a',
    shininess: 7,
    transparent: true,
    opacity: 0.97
  }), []);

  const polygonsMaterial = useMemo(() => new THREE.MeshLambertMaterial({
    color: '#304060',
    side: THREE.DoubleSide,
  }), []);

  const markerDotsData = useMemo(() => locations, []);
  const htmlMarkerLabelsData = useMemo(() => locations, []);

  useEffect(() => {
    if (globeRef.current && landPolygons.length > 0) {
      globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2.2 });
    }
  }, [landPolygons]);

  return (
    <div style={{ 
      width, 
      height, 
      position: 'relative',
      backgroundColor,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Globe
        ref={globeRef}
        backgroundColor="rgba(0,0,0,0)"
        globeMaterial={globeMaterial}
        showGlobe={true}
        showAtmosphere={true}
        atmosphereColor="#2a5a8c"
        atmosphereAltitude={0.25}
        polygonsData={landPolygons}
        polygonCapMaterial={polygonsMaterial}
        polygonSideColor={() => 'rgba(0,0,0,0)'}
        polygonStrokeColor={() => '#506080'}
        pointsData={markerDotsData}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.001}
        pointRadius={0.012}
        pointColor={() => '#00ff88'}
        htmlElementsData={htmlMarkerLabelsData}
        htmlLat="lat"
        htmlLng="lng"
        htmlAltitude={0.022}
        htmlElement={(d: Location) => {
          const el = document.createElement('div');
          el.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
          el.style.color = 'white';
          el.style.fontSize = '10px';
          el.style.padding = '4px 8px';
          el.style.borderRadius = '4px';
          el.style.border = '1px solid rgba(74, 222, 128, 0.3)';
          el.style.whiteSpace = 'nowrap';
          el.style.pointerEvents = 'auto';
          el.style.transform = 'translate(-50%, calc(-100% - 8px))';
          el.innerHTML = d.name;
          return el;
        }}
      />
    </div>
  );
};

export default InteractiveGlobe;
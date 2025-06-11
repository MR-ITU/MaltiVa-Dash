import React, { useState, useEffect, useMemo, useRef } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import { useMediaQuery } from 'react-responsive';

interface Location {
  lat: number;
  lng: number;
  name: string;
  dcId?: string;
  dcOwner?: string;
  replicaNodes?: number;
  apiBoundaryNodes?: number;
  totalNodes?: number;
  nodeProviders?: number;
  subnets?: number;
}

const locations: Location[] = [
  { 
    lat: 46.2044, lng: 6.1432, name: 'Geneva, Switzerland',
    dcId: 'gel',
    dcOwner: 'HighDC',
    replicaNodes: 28,
    apiBoundaryNodes: 0,
    totalNodes: 28,
    nodeProviders: 2,
    subnets: 7
  },
  { 
    lat: 40.7128, lng: -74.0060, name: 'USA (New York)',
    dcId: 'nyc',
    dcOwner: 'GlobalDC',
    replicaNodes: 42,
    apiBoundaryNodes: 5,
    totalNodes: 47,
    nodeProviders: 4,
    subnets: 12
  },
  { 
    lat: 52.5200, lng: 13.4050, name: 'Germany (Berlin)',
    dcId: 'ber',
    dcOwner: 'EuroDC',
    replicaNodes: 35,
    apiBoundaryNodes: 3,
    totalNodes: 38,
    nodeProviders: 3,
    subnets: 9
  },
  { 
    lat: 35.6895, lng: 139.6917, name: 'Japan (Tokyo)',
    dcId: 'tyo',
    dcOwner: 'AsiaDC',
    replicaNodes: 50,
    apiBoundaryNodes: 8,
    totalNodes: 58,
    nodeProviders: 5,
    subnets: 15
  },
  { 
    lat: -22.9068, lng: -43.1729, name: 'Brazil (Rio de Janeiro)',
    dcId: 'rio',
    dcOwner: 'SouthAmericaDC',
    replicaNodes: 22,
    apiBoundaryNodes: 2,
    totalNodes: 24,
    nodeProviders: 2,
    subnets: 6
  },
  { 
    lat: 28.6139, lng: 77.2090, name: 'India (New Delhi)',
    dcId: 'del',
    dcOwner: 'AsiaDC',
    replicaNodes: 38,
    apiBoundaryNodes: 4,
    totalNodes: 42,
    nodeProviders: 3,
    subnets: 10
  }
];

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
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const globeRef = useRef<any>();
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Detect mobile devices


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

  useEffect(() => {
    if (globeRef.current && landPolygons.length > 0) {
      // Adjust view for mobile devices
      if (isMobile) {
        // Zoomed out view for mobile
        globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 3.5 });
      } else {
        // Standard view for desktop
        globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2.2 });
      }
    }
  }, [landPolygons, isMobile]);

  // Create a function to generate labels that handles clicks
 const createLabelElement = (d: Location) => {
    const el = document.createElement('div');
    el.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    el.style.color = 'white';
    el.style.fontSize = isMobile ? '12px' : '10px'; // Larger text on mobile
    el.style.padding = '4px 8px';
    el.style.borderRadius = '4px';
    el.style.border = '1px solid rgba(74, 222, 128, 0.3)';
    el.style.whiteSpace = 'nowrap';
    el.style.pointerEvents = 'auto';
    el.style.cursor = 'pointer';
    el.style.transform = 'translate(-50%, calc(-100% - 8px))';
    el.style.zIndex = '10'; // Ensure labels are above other elements
    el.innerHTML = d.name;
    
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      setSelectedLocation(d);
    });
    
    return el;
  };


  return (
    <div style={{ 
      width, 
      height, 
      position: 'relative',
      backgroundColor,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden' // Prevent any overflow
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
        pointRadius={isMobile ? 0.018 : 0.012} // Larger points on mobile
        pointColor={() => '#00ff88'}
        onPointClick={(point: Location) => setSelectedLocation(point)}
        htmlElementsData={htmlMarkerLabelsData}
        htmlLat="lat"
        htmlLng="lng"
        htmlAltitude={0.022}
        htmlElement={createLabelElement} // Use our custom label creator
      />
      
      {/* Location Details Modal */}
      {selectedLocation && (
        <div style={{
          position: 'absolute',
          bottom: isMobile ? '10px' : '20px', // Adjust position for mobile
          left: '50%',
          transform: 'translateX(-50%)',
          width: isMobile ? '90%' : '300px', // Responsive width
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid rgba(74, 222, 128, 0.3)',
          zIndex: 100,
          backdropFilter: 'blur(5px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: '8px'
          }}>
            <h3 style={{ margin: 0 }}>{selectedLocation.name}</h3>
            <button 
              onClick={() => setSelectedLocation(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
          
          {selectedLocation.dcId && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ fontWeight: 'bold' }}>Data Center ID</div>
              <div>{selectedLocation.dcId}</div>
              
              <div style={{ fontWeight: 'bold' }}>Data Center Owner</div>
              <div>{selectedLocation.dcOwner}</div>
              
              <div style={{ fontWeight: 'bold' }}>Replica Nodes</div>
              <div>{selectedLocation.replicaNodes}</div>
              
              <div style={{ fontWeight: 'bold' }}>API Boundary Nodes</div>
              <div>{selectedLocation.apiBoundaryNodes}</div>
              
              <div style={{ fontWeight: 'bold' }}>Total Nodes</div>
              <div>{selectedLocation.totalNodes}</div>
              
              <div style={{ fontWeight: 'bold' }}>Node Providers</div>
              <div>{selectedLocation.nodeProviders}</div>
              
              <div style={{ fontWeight: 'bold' }}>Subnets</div>
              <div>{selectedLocation.subnets}</div>
            </div>
          )}
          
          {!selectedLocation.dcId && (
            <div>No data center information available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default InteractiveGlobe;
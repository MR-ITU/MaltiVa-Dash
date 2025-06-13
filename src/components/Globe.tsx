import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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

  // Rotation control refs
  const rotationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);
  const rotationSpeedRef = useRef(0.1); // degrees per frame

  // Blinking animation state
  const [blinkPhase, setBlinkPhase] = useState(0);
  
  useEffect(() => {
    // Blinking animation for labels
    const blinkInterval = setInterval(() => {
      setBlinkPhase(prev => (prev + 1) % 4);
    }, 800);
    
    return () => clearInterval(blinkInterval);
  }, []);

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

  // Auto-rotation functions
  const startAutoRotation = useCallback(() => {
    if (rotationIntervalRef.current) return;
    
    rotationIntervalRef.current = setInterval(() => {
      if (!isDraggingRef.current && globeRef.current) {
        const currentPov = globeRef.current.pointOfView();
        const newLng = (currentPov.lng + rotationSpeedRef.current) % 360;
        globeRef.current.pointOfView({ ...currentPov, lng: newLng }, 0);
      }
    }, 50);
  }, []);

  const stopAutoRotation = useCallback(() => {
    if (rotationIntervalRef.current) {
      clearInterval(rotationIntervalRef.current);
      rotationIntervalRef.current = null;
    }
  }, []);

  // Handle user interactions
  const handleInteractionStart = useCallback(() => {
    isDraggingRef.current = true;
    stopAutoRotation();
  }, [stopAutoRotation]);

  const handleInteractionEnd = useCallback(() => {
    isDraggingRef.current = false;
    // Restart rotation after a delay
    setTimeout(() => {
      startAutoRotation();
    }, 2000);
  }, [startAutoRotation]);

  useEffect(() => {
    if (globeRef.current && landPolygons.length > 0) {
      // Adjust view for mobile devices
      if (isMobile) {
        // Zoomed out view for mobile
        globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 4.0 });
      } else {
        // Standard view for desktop
        globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2.8 });
      }
      
      // Start auto rotation after initial load
      const startTimer = setTimeout(() => {
        startAutoRotation();
      }, 2000);
      
      return () => {
        clearTimeout(startTimer);
        stopAutoRotation();
      };
    }
  }, [landPolygons, isMobile, startAutoRotation, stopAutoRotation]);

  // Create a function to generate labels with blinking effect
  const createLabelElement = useCallback((d: Location) => {
    const el = document.createElement('div');
    el.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    el.style.color = 'white';
    el.style.fontSize = isMobile ? '12px' : '10px';
    el.style.padding = '4px 8px';
    el.style.borderRadius = '4px';
    el.style.whiteSpace = 'nowrap';
    el.style.pointerEvents = 'auto';
    el.style.cursor = 'pointer';
    el.style.transform = 'translate(-50%, calc(-100% - 8px))';
    el.style.zIndex = '10';
    el.style.transition = 'all 0.3s ease';
    el.style.animation = 'blink 1.5s infinite';
    el.innerHTML = d.name;
    
    // Add blinking border effect
    const blinkColors = [
      'rgba(74, 222, 128, 0.3)',
      'rgba(74, 222, 128, 0.6)',
      'rgba(74, 222, 128, 0.9)',
      'rgba(74, 222, 128, 0.6)'
    ];
    el.style.border = `1px solid ${blinkColors[blinkPhase]}`;
    
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      setSelectedLocation(d);
      handleInteractionStart();
      setTimeout(handleInteractionEnd, 2000);
    });
    
    return el;
  }, [isMobile, blinkPhase, handleInteractionStart, handleInteractionEnd]);


  return (
    <div style={{ 
      width, 
      height, 
      position: 'relative',
      backgroundColor,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      {/* Blinking animation style */}
      <style>
        {`
          @keyframes blink {
            0% { box-shadow: 0 0 3px rgba(74, 222, 128, 0.3); }
            50% { box-shadow: 0 0 8px rgba(74, 222, 128, 0.8); }
            100% { box-shadow: 0 0 3px rgba(74, 222, 128, 0.3); }
          }
        `}
      </style>
      
      <Globe
        ref={globeRef}
        backgroundColor="rgba(0,0,0,0)"
        globeMaterial={globeMaterial}
        showGlobe={true}
        showAtmosphere={true}
        atmosphereColor="#2a5a8c"
        atmosphereAltitude={0.2}  // Thinner atmosphere for smaller globe
        polygonsData={landPolygons}
        polygonCapMaterial={polygonsMaterial}
        polygonSideColor={() => 'rgba(0,0,0,0)'}
        polygonStrokeColor={() => '#506080'}
        pointsData={markerDotsData}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.001}
        pointRadius={isMobile ? 0.016 : 0.01}  // Slightly smaller points
        pointColor={() => '#00ff88'}
        pointLabel={d => d.name}
        onPointClick={(point: Location) => {
          setSelectedLocation(point);
          handleInteractionStart();
          setTimeout(handleInteractionEnd, 2000);
        }}
        htmlElementsData={htmlMarkerLabelsData}
        htmlLat="lat"
        htmlLng="lng"
        htmlAltitude={0.018}  // Closer to surface
        htmlElement={createLabelElement}
        onGlobeDragStart={handleInteractionStart}
        onGlobeDragEnd={handleInteractionEnd}
      />
      
      {/* Location Details Modal */}
      {selectedLocation && (
        <div style={{
          position: 'absolute',
          bottom: isMobile ? '10px' : '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: isMobile ? '90%' : '300px',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid rgba(74, 222, 128, 0.3)',
          zIndex: 100,
          backdropFilter: 'blur(5px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          animation: 'blink 2s infinite' // Apply blinking to modal too
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: '8px'
          }}>
            <h3 style={{ 
              margin: 0,
              fontSize: isMobile ? '16px' : '18px',
              color: '#4ade80' // Green color for the name
            }}>
              {selectedLocation.name}
            </h3>
            <button 
              onClick={() => setSelectedLocation(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                width: '30px',
                height: '30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              ×
            </button>
          </div>
          
          {selectedLocation.dcId && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '8px',
              fontSize: isMobile ? '12px' : '13px'
            }}>
              <div style={{ fontWeight: 'bold', color: '#a0aec0' }}>Data Center ID</div>
              <div>{selectedLocation.dcId}</div>
              
              <div style={{ fontWeight: 'bold', color: '#a0aec0' }}>Data Center Owner</div>
              <div>{selectedLocation.dcOwner}</div>
              
              <div style={{ fontWeight: 'bold', color: '#a0aec0' }}>Replica Nodes</div>
              <div>{selectedLocation.replicaNodes}</div>
              
              <div style={{ fontWeight: 'bold', color: '#a0aec0' }}>API Boundary Nodes</div>
              <div>{selectedLocation.apiBoundaryNodes}</div>
              
              <div style={{ fontWeight: 'bold', color: '#a0aec0' }}>Total Nodes</div>
              <div>{selectedLocation.totalNodes}</div>
              
              <div style={{ fontWeight: 'bold', color: '#a0aec0' }}>Node Providers</div>
              <div>{selectedLocation.nodeProviders}</div>
              
              <div style={{ fontWeight: 'bold', color: '#a0aec0' }}>Subnets</div>
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
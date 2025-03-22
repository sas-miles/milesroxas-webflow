import { OrbitControls, View } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';

// Your 3D scene component
const Scene = ({ index = 1 }) => {
  console.error(`Scene component ${index} rendering`);
  // Check if we're in development mode by looking at window.location
  const isDevelopment =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  return (
    <>
      {/* Make background transparent */}
      <color attach="background" args={['transparent']} />
      <ambientLight intensity={1.0} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <directionalLight position={[-5, 5, 5]} intensity={0.7} castShadow />

      {/* Main cube - larger and more vibrant */}
      <mesh
        position={[0, 0, 0]}
        scale={index === 1 ? 1.5 : 1.2}
        rotation={index === 1 ? [0.5, 0.5, 0] : [0.2, 0.8, 0.1]}
        castShadow
        receiveShadow
      >
        <boxGeometry />
        <meshStandardMaterial
          color={index === 1 ? '#ff6700' : '#0070ff'}
          metalness={0.1}
          roughness={0.2}
        />
      </mesh>

      {/* Optional: Only show grid in development */}
      {isDevelopment && <gridHelper args={[10, 10]} />}
    </>
  );
};

// Main Experience component
const ReactFiber = () => {
  console.error('Experience component rendering');
  const [viewRef1, setViewRef1] = useState<{ current: HTMLElement } | null>(null);
  const [viewRef2, setViewRef2] = useState<{ current: HTMLElement } | null>(null);

  // Get the DOM elements once mounted
  useEffect(() => {
    const targetElement1 = document.querySelector('[data-r3f-view="1"]');

    const targetElement2 = document.querySelector('[data-r3f-view="2"]');

    if (targetElement1) {
      setViewRef1({ current: targetElement1 as HTMLElement });

      // Add class for styling if needed
      targetElement1.classList.add('r3f-view-1');

      // Make sure the target element has appropriate styling for 3D content
      if (targetElement1 instanceof HTMLElement) {
        if (!targetElement1.style.position || targetElement1.style.position === 'static') {
          targetElement1.style.position = 'relative';
        }
        targetElement1.style.minHeight = '400px'; // Ensure there's space for the 3D content
      }
    }

    if (targetElement2) {
      setViewRef2({ current: targetElement2 as HTMLElement });

      // Add class for styling if needed
      targetElement2.classList.add('r3f-view-2');

      // Make sure the target element has appropriate styling for 3D content
      if (targetElement2 instanceof HTMLElement) {
        if (!targetElement2.style.position || targetElement2.style.position === 'static') {
          targetElement2.style.position = 'relative';
        }
        targetElement2.style.minHeight = '300px'; // Ensure there's space for the 3D content
      }
    }
  }, []);

  console.error('Current viewRefs:', { view1: viewRef1, view2: viewRef2 });

  // If no views are available, don't render anything
  if (!viewRef1 && !viewRef2) {
    return null;
  }

  return (
    <Canvas
      className="canvas"
      style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        zIndex: 999,
        pointerEvents: 'auto',
        backgroundColor: 'transparent', // Make transparent to show Webflow content behind it
      }}
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{
        alpha: true, // Enable transparency
        antialias: true, // Make edges smoother
      }}
    >
      <OrbitControls />
      {viewRef1 && (
        <View index={1} track={viewRef1}>
          <Scene index={1} />
        </View>
      )}

      {viewRef2 && (
        <View index={2} track={viewRef2}>
          <Scene index={2} />
        </View>
      )}
    </Canvas>
  );
};

export default ReactFiber;

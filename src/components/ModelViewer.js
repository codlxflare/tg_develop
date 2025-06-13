import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  ContactShadows,
  AdaptiveDpr,
  AdaptiveEvents,
  BakeShadows
} from '@react-three/drei';
import * as THREE from 'three';

function Model({ url }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const modelRef = useRef();
  const mixerRef = useRef();
  const [animations, setAnimations] = useState([]);
  
  useEffect(() => {
    console.log('Attempting to load model from:', url);
  }, [url]);

  const { scene, animations: modelAnimations } = useGLTF(url, undefined, 
    (error) => {
      console.error('Error loading model:', error);
      setError(error);
      setLoading(false);
    },
    (progress) => {
      console.log('Loading progress:', progress);
    }
  );
  
  useEffect(() => {
    if (scene) {
      try {
        console.log('Model loaded successfully, processing...');
        
        // Создаем ограничивающий бокс для всей сцены
        const box = new THREE.Box3().setFromObject(scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Вычисляем максимальный размер для масштабирования
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5 / maxDim;
        
        // Центрируем и масштабируем модель
        scene.position.sub(center);
        scene.scale.multiplyScalar(scale);
        
        // Обновляем ограничивающий бокс после трансформаций
        box.setFromObject(scene);
        const newCenter = box.getCenter(new THREE.Vector3());
        
        // Устанавливаем начальную позицию камеры
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 2, 5);
        camera.lookAt(newCenter);

        // Настройка материалов и теней
        scene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.geometry) {
              child.geometry.computeVertexNormals();
            }
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                  if (mat.map) {
                    mat.map.colorSpace = THREE.SRGBColorSpace;
                    mat.map.flipY = false;
                  }
                });
              } else {
                if (child.material.map) {
                  child.material.map.colorSpace = THREE.SRGBColorSpace;
                  child.material.map.flipY = false;
                }
              }
            }
          }
        });

        // Настройка анимаций
        if (modelAnimations && modelAnimations.length > 0) {
          console.log('Found animations:', modelAnimations.length);
          const mixer = new THREE.AnimationMixer(scene);
          mixerRef.current = mixer;
          
          const actions = modelAnimations.map(clip => {
            const action = mixer.clipAction(clip);
            action.setLoop(THREE.LoopRepeat);
            return action;
          });
          
          setAnimations(actions);
          if (actions.length > 0) {
            actions[0].play();
          }
        }

        setLoading(false);
        console.log('Model processing completed');
      } catch (err) {
        console.error('Error processing model:', err);
        setError(err);
        setLoading(false);
      }
    }
  }, [scene, modelAnimations]);

  // Обновление анимации в каждом кадре
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  if (error) {
    console.error('Rendering error state for model:', error);
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }

  if (loading) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="gray" />
      </mesh>
    );
  }

  return <primitive ref={modelRef} object={scene} />;
}

function Controls({ onViewChange, currentView }) {
  const controlsRef = useRef();
  const { camera, gl } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const lastTouchRef = useRef(null);
  const cameraStateRef = useRef({
    position: new THREE.Vector3(0, 2, 5),
    target: new THREE.Vector3(0, 0, 0)
  });

  const cameraPositions = {
    front: { position: [0, 2, 5], target: [0, 0, 0] },
    back: { position: [0, 2, -5], target: [0, 0, 0] },
    left: { position: [-5, 2, 0], target: [0, 0, 0] },
    right: { position: [5, 2, 0], target: [0, 0, 0] },
    top: { position: [0, 5, 0], target: [0, 0, 0] },
    isometric: { position: [5, 5, 5], target: [0, 0, 0] }
  };

  // Эффект для изменения позиции камеры при изменении currentView
  useEffect(() => {
    if (controlsRef.current && currentView) {
      const { position, target } = cameraPositions[currentView];
      camera.position.set(...position);
      controlsRef.current.target.set(...target);
      camera.lookAt(...target);
      cameraStateRef.current.position.copy(camera.position);
      cameraStateRef.current.target.copy(controlsRef.current.target);
    }
  }, [camera, currentView]);

  useEffect(() => {
    if (controlsRef.current) {
      camera.position.copy(cameraStateRef.current.position);
      controlsRef.current.target.copy(cameraStateRef.current.target);
      camera.lookAt(cameraStateRef.current.target);

      const canvas = gl.domElement;
      
      const preventScroll = (e) => {
        if (isDragging) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      const handleTouchStart = (e) => {
        if (e.touches.length === 1) {
          setIsDragging(true);
          document.body.style.overflow = 'hidden';
          lastTouchRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
          };
        }
      };

      const handleTouchMove = (e) => {
        if (isDragging && e.touches.length === 1) {
          e.preventDefault();
          e.stopPropagation();
          
          const touch = e.touches[0];
          const deltaX = touch.clientX - lastTouchRef.current.x;
          const deltaY = touch.clientY - lastTouchRef.current.y;
          
          if (controlsRef.current) {
            controlsRef.current.setAzimuthalAngle(controlsRef.current.getAzimuthalAngle() - deltaX * 0.01);
            controlsRef.current.setPolarAngle(controlsRef.current.getPolarAngle() - deltaY * 0.01);
          }
          
          lastTouchRef.current = {
            x: touch.clientX,
            y: touch.clientY
          };
        }
      };

      const handleTouchEnd = () => {
        setIsDragging(false);
        document.body.style.overflow = '';
        lastTouchRef.current = null;
        
        if (controlsRef.current) {
          cameraStateRef.current.position.copy(camera.position);
          cameraStateRef.current.target.copy(controlsRef.current.target);
        }
      };

      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd);
      canvas.addEventListener('touchcancel', handleTouchEnd);

      return () => {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
        canvas.removeEventListener('touchcancel', handleTouchEnd);
        document.body.style.overflow = '';
      };
    }
  }, [camera, gl, isDragging]);

  useFrame(() => {
    if (controlsRef.current) {
      cameraStateRef.current.position.copy(camera.position);
      cameraStateRef.current.target.copy(controlsRef.current.target);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={1}
      maxDistance={20}
      dampingFactor={0.05}
      rotateSpeed={0.5}
      panSpeed={0.5}
      zoomSpeed={0.5}
      target={cameraStateRef.current.target}
      enableDamping={true}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
      makeDefault
    />
  );
}

function ViewControls({ onViewChange, currentView }) {
  return (
    <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-1 z-0">
      <button
        onClick={() => onViewChange('front')}
        className={`bg-white/90 dark:bg-gray-700/90 p-1.5 rounded-lg shadow-lg hover:bg-white dark:hover:bg-gray-600 transition-colors flex items-center justify-center ${currentView === 'front' ? 'ring-2 ring-blue-500' : ''}`}
        title="Вид спереди"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>
      <button
        onClick={() => onViewChange('back')}
        className={`bg-white/90 dark:bg-gray-700/90 p-1.5 rounded-lg shadow-lg hover:bg-white dark:hover:bg-gray-600 transition-colors flex items-center justify-center ${currentView === 'back' ? 'ring-2 ring-blue-500' : ''}`}
        title="Вид сзади"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14" />
        </svg>
      </button>
      <button
        onClick={() => onViewChange('top')}
        className={`bg-white/90 dark:bg-gray-700/90 p-1.5 rounded-lg shadow-lg hover:bg-white dark:hover:bg-gray-600 transition-colors flex items-center justify-center ${currentView === 'top' ? 'ring-2 ring-blue-500' : ''}`}
        title="Вид сверху"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 22V12h6v10" />
        </svg>
      </button>
      <button
        onClick={() => onViewChange('isometric')}
        className={`bg-white/90 dark:bg-gray-700/90 p-1.5 rounded-lg shadow-lg hover:bg-white dark:hover:bg-gray-600 transition-colors flex items-center justify-center ${currentView === 'isometric' ? 'ring-2 ring-blue-500' : ''}`}
        title="Изометрический вид"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
        </svg>
      </button>
    </div>
  );
}

export default function ModelViewer({ modelUrl }) {
  const [currentView, setCurrentView] = useState('front');
  const containerRef = useRef(null);

  useEffect(() => {
    console.log('ModelViewer mounted with URL:', modelUrl);
  }, [modelUrl]);

  return (
    <div 
      className="relative w-full h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden touch-none" 
      ref={containerRef}
      style={{ 
        touchAction: 'none',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'none'
      }}
    >
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        camera={{ 
          position: [0, 2, 5], 
          fov: 45,
          near: 0.1,
          far: 1000
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <Model url={modelUrl} />
          <Controls onViewChange={setCurrentView} currentView={currentView} />
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.4}
            scale={10}
            blur={2.5}
          />
          <Environment preset="city" />
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <BakeShadows />
        </Suspense>
      </Canvas>
      <ViewControls onViewChange={setCurrentView} currentView={currentView} />
    </div>
  );
} 
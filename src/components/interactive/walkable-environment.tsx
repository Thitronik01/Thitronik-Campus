"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PointerLockControls, Sky, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";

// Steuerungskomponente
function Player() {
    const velocity = useRef(new THREE.Vector3());
    const direction = useRef(new THREE.Vector3());
    const moveForward = useRef(false);
    const moveBackward = useRef(false);
    const moveLeft = useRef(false);
    const moveRight = useRef(false);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            switch (event.code) {
                case "ArrowUp":
                case "KeyW":
                    moveForward.current = true;
                    break;
                case "ArrowLeft":
                case "KeyA":
                    moveLeft.current = true;
                    break;
                case "ArrowDown":
                case "KeyS":
                    moveBackward.current = true;
                    break;
                case "ArrowRight":
                case "KeyD":
                    moveRight.current = true;
                    break;
            }
        };

        const onKeyUp = (event: KeyboardEvent) => {
            switch (event.code) {
                case "ArrowUp":
                case "KeyW":
                    moveForward.current = false;
                    break;
                case "ArrowLeft":
                case "KeyA":
                    moveLeft.current = false;
                    break;
                case "ArrowDown":
                case "KeyS":
                    moveBackward.current = false;
                    break;
                case "ArrowRight":
                case "KeyD":
                    moveRight.current = false;
                    break;
            }
        };

        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("keyup", onKeyUp);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("keyup", onKeyUp);
        };
    }, []);

    useFrame((state, delta) => {
        const { camera } = state;
        
        // Geschwindigkeit dämpfen
        velocity.current.x -= velocity.current.x * 10.0 * delta;
        velocity.current.z -= velocity.current.z * 10.0 * delta;

        direction.current.z = Number(moveForward.current) - Number(moveBackward.current);
        direction.current.x = Number(moveRight.current) - Number(moveLeft.current);
        direction.current.normalize();

        const speed = 40.0;
        if (moveForward.current || moveBackward.current) velocity.current.z -= direction.current.z * speed * delta;
        if (moveLeft.current || moveRight.current) velocity.current.x -= direction.current.x * speed * delta;

        // Kamera bewegen
        camera.translateX(-velocity.current.x * delta);
        camera.translateZ(-velocity.current.z * delta);
        
        // Auf dem Boden bleiben
        camera.position.y = 1.7; 
    });

    return null;
}

// Einfaches Wohnmobil-Modell (Platzhalter)
function CamperModel() {
    return (
        <group position={[0, 1.25, -10]}>
            {/* Karosserie */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[2.3, 2.5, 7]} />
                <meshStandardMaterial color="#f0f0f0" />
            </mesh>
            {/* Alkoven / Dachaufbau */}
            <mesh position={[0, 1.5, 2]} castShadow>
                <boxGeometry args={[2.3, 0.8, 3]} />
                <meshStandardMaterial color="#f0f0f0" />
            </mesh>
            {/* Fenster Front */}
            <mesh position={[0, 0.5, 3.51]}>
                <planeGeometry args={[1.8, 1]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            {/* Räder */}
            <mesh position={[-1, -1.25, 2]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.4, 32]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            <mesh position={[1, -1.25, 2]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.4, 32]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            <mesh position={[-1, -1.25, -2]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.4, 32]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            <mesh position={[1, -1.25, -2]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.4, 32]} />
                <meshStandardMaterial color="#111" />
            </mesh>
        </group>
    );
}

export default function WalkableEnvironment() {
    return (
        <div className="w-full h-[80vh] relative bg-slate-900 rounded-2xl overflow-hidden border border-border shadow-2xl">
            <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md p-4 rounded-xl text-white pointer-events-none">
                <h3 className="font-bold mb-2">Thitronik Walkthrough</h3>
                <p className="text-xs text-slate-300">
                    Klicke ins Bild zum Starten<br />
                    <span className="font-mono bg-white/10 px-1 rounded">WASD</span> zum Bewegen<br />
                    <span className="font-mono bg-white/10 px-1 rounded">Maus</span> zum Umsehen<br />
                    <span className="font-mono bg-white/10 px-1 rounded">ESC</span> zum Beenden
                </p>
            </div>
            
            <Canvas shadows camera={{ position: [0, 1.7, 5], fov: 75 }}>
                <Sky sunPosition={[100, 20, 100]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} castShadow />
                <Environment preset="city" />
                
                {/* Boden */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                    <planeGeometry args={[100, 100]} />
                    <meshStandardMaterial color="#222" />
                </mesh>
                <gridHelper args={[100, 50, "#444", "#333"]} />

                <CamperModel />
                
                <Player />
                <PointerLockControls />
            </Canvas>
        </div>
    );
}

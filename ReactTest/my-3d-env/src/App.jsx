// App.jsx
import React, { useState, useEffect } from 'react';
import { GameCanvas } from './GameCanvas'; // GameCanvas 임포트
import { getOrCreatePlayerInfo } from './utils/constants'; // getOrCreatePlayerInfo 임포트

export default function App() {
    // sessionStorage에서 'enteredGame' 상태를 로드합니다.
    const [enteredGame, setEnteredGame] = useState(() => {
        const storedEnteredGame = sessionStorage.getItem('enteredGame');
        return storedEnteredGame === 'true'; // 문자열 'true'를 불리언 true로 변환
    });
    // localStorage에서 닉네임을 불러와 초기값으로 설정합니다.
    // 만약 이전에 설정된 닉네임이 없다면 '플레이어_' + ID 앞 5자리로 설정합니다.
    const [nickname, setNickname] = useState(() => {
        let storedNickname = localStorage.getItem('myNickname');
        if (!storedNickname) {
            const { id } = getOrCreatePlayerInfo(); // ID는 이 함수에서 가져옵니다.
            storedNickname = `플레이어_${id.substring(0, 5)}`;
        }
        return storedNickname;
    });

    // enteredGame 상태가 변경될 때 sessionStorage에 저장합니다.
    useEffect(() => {
        sessionStorage.setItem('enteredGame', enteredGame.toString());
    }, [enteredGame]);

    // 닉네임 제출 핸들러
    const handleNicknameSubmit = () => {
        localStorage.setItem('myNickname', nickname); // 입력된 닉네임 저장
        setEnteredGame(true); // 게임 입장 상태로 변경
    };

    // 게임 입장 전 닉네임 입력 화면
    if (enteredGame) {
        return <GameCanvas playerNickname={nickname} />; // GameCanvas에 현재 닉네임을 prop으로 전달
    }
<<<<<<< HEAD
    return storedPlayerId;
};

const currentPlayerId = getOrCreatePlayerId();

// --- OtherPlayer 컴포넌트 (RigidBody와 CapsuleCollider 추가) ---
function OtherPlayer({ id, position, rotationY, animationState }) {
    const rigidBodyRef = useRef(); // RigidBody에 대한 ref 추가
    const modelGroupRef = useRef(); // 모델 그룹에 대한 ref 유지

    useFrame(() => {
        if (rigidBodyRef.current && position) {
            // 서버에서 받은 위치 정보를 기반으로 RigidBody의 위치를 직접 설정합니다.
            const newPos = new THREE.Vector3(position.x, position.y, position.z);
            rigidBodyRef.current.setTranslation(newPos, true); // true는 wakeUp을 의미, 다른 객체와 상호작용 가능하게 함
        }

        if (modelGroupRef.current) {
            // 모델의 시각적인 회전만 부드럽게 보간합니다.
            // 물리적인 회전은 RigidBody가 처리하지만, 여기서는 시각적인 일치감을 위해 사용.
            // 필요에 따라 RigidBody의 rotation을 직접 setRotation으로 제어할 수도 있습니다.
            modelGroupRef.current.rotation.y = THREE.MathUtils.lerp(modelGroupRef.current.rotation.y, rotationY + Math.PI, 0.2);
        }
    });

    const safeAnimationState = animationState || {};
=======
>>>>>>> teammate/feature/jaemin

    // 닉네임 입력 UI
    return (
<<<<<<< HEAD
        <RigidBody
            ref={rigidBodyRef}
            position={[position.x, position.y, position.z]} // 초기 위치 설정
            colliders={false} // RigidBody 자체의 자동 충돌체 생성을 끔
            type="kinematicPosition" // 외부에서 위치를 제어할 수 있도록 설정
            enabledRotations={[false, false, false]} // 회전 제한 (필요에 따라 변경)
        >
            {/* 캡슐 충돌체 추가: 플레이어 모델의 대략적인 크기에 맞춥니다. */}
            <CapsuleCollider args={[0.35, 0.4]} /> 

            {/* CharacterModel2를 RigidBody의 자식으로 둡니다. */}
            {/* 모델의 Pivot이 바닥에 오도록 y축 오프셋을 조정합니다. (Player 컴포넌트와 동일) */}
            <group ref={modelGroupRef} position-y={-1.65}>
                <CharacterModel2 {...safeAnimationState} />
            </group>
            
            {/* 플레이어 ID 텍스트는 모델 위에 표시되도록 그룹 외부 또는 모델 그룹 자식으로 둘 수 있습니다. */}
            <Text
                position={[0, 2.6 - 0.725, 0]} // 모델 Y 오프셋을 고려하여 텍스트 위치 조정
                fontSize={0.2}
                color="black"
                anchorX="center"
                anchorY="middle"
                billboard
            >
                {id.substring(0, 5)}
            </Text>
        </RigidBody>
    );
}

// --- Player 컴포넌트 (STOMP 클라이언트 로직을 prop으로 받도록 수정) ---
function Player({ onHudUpdate, objectRefs, stompClientInstance, onSceneObjectsUpdate, onPlayerLocationsUpdate }) {
    const { camera, gl } = useThree();
    const [subscribeKeys, getKeys] = useKeyboardControls();
    const [sitToggle, setSitToggle] = useState(false);
    const [lieToggle, setLieToggle] = useState(false);
    const playerRef = useRef();
    const modelRef = useRef();
    const [isGrounded, setIsGrounded] = useState(false);
    const [viewMode, setViewMode] = useState('firstPerson');
    const [isPunching, setIsPunching] = useState(false);

    const pitch = useRef(0);
    const yaw = useRef(0);

    const { speed, jumpImpulse } = useControls({
        speed: { value: 5, min: 1, max: 2000 },
        jumpImpulse: { value: 3, min: 1, max: 50 }
    });

    const toggleViewPressed = useRef(false);
    
    // Initial player registration when Player component mounts and STOMP is connected
    // This runs only once per Player component mount when stompClientInstance becomes available
    useEffect(() => {
        if (stompClientInstance && stompClientInstance.connected) {
            console.log("[Player] Initial player registration upon mount.");
            const initialPlayerState = {
                id: currentPlayerId,
                position: { x: 0, y: 0, z: 0 },
                rotationY: yaw.current + Math.PI,
                animationState: {
                    isWalking: false, isBackward: false, isLeft: false, isRight: false,
                    isJumping: false, isRunning: false, isSitted: false, isSittedAndWalk: false,
                    isLyingDown: false, isLyingDownAndWalk: false, isPunching: false, isIdle: true
                }
            };
            stompClientInstance.publish({
                destination: '/app/registerPlayer',
                body: JSON.stringify(initialPlayerState)
            });
        }
    }, [stompClientInstance]); // stompClientInstance가 준비되면 실행

    // 'C' (앉기) 및 'Z' (눕기) 토글 로직
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'KeyC') {
                setSitToggle(prev => {
                    const next = !prev;
                    if (next) setLieToggle(false);
                    return next;
                });
            }
            if (e.code === 'KeyZ') {
                setLieToggle(prev => {
                    const next = !prev;
                    if (next) setSitToggle(false);
                    return next;
                });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // 마우스 클릭 (펀치) 로직
    useEffect(() => {
        const handleMouseDown = (e) => {
            if (e.button === 0) setIsPunching(true);
        };
        const handleMouseUp = (e) => {
            if (e.button === 0) setIsPunching(false);
        };

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    // 뷰 모드 전환 (1인칭/3인칭) 로직
    useEffect(() => {
        const unsubscribe = subscribeKeys(
            (s) => s.toggleView,
            (pressed) => {
                if (pressed && !toggleViewPressed.current) {
                    setViewMode((prev) => (prev === 'firstPerson' ? 'thirdPerson' : 'firstPerson'));
                }
                toggleViewPressed.current = pressed;
            }
        );
        return () => unsubscribe();
    }, [subscribeKeys]);

    // 마우스 움직임으로 카메라 회전 로직
    const onMouseMove = useCallback((e) => {
        yaw.current -= e.movementX * 0.002;

        if (viewMode === 'firstPerson') {
            pitch.current -= e.movementY * 0.002;
        } else {
            pitch.current += e.movementY * 0.002;
        }

        pitch.current = THREE.MathUtils.clamp(pitch.current, -Math.PI / 2 + 0.1, Math.PI / 2 - 0.1);
    }, [viewMode]);

    // 캔버스 클릭 시 포인터 락 요청 로직
    useEffect(() => {
        const canvas = gl.domElement;
        const requestPointerLock = () => { canvas.requestPointerLock(); };
        canvas.addEventListener('click', requestPointerLock);
        return () => { canvas.removeEventListener('click', requestPointerLock); };
    }, [gl]);

    // 포인터 락 상태 변경 감지 및 마우스 이벤트 리스너 추가/제거 로직
    useEffect(() => {
        const canvas = gl.domElement;
        const handlePointerLockChange = () => {
            if (document.pointerLockElement === canvas) {
                document.addEventListener('mousemove', onMouseMove);
            } else {
                document.removeEventListener('mousemove', onMouseMove);
            }
        };
        if (document.pointerLockElement === canvas) { // 초기 마운트 시 포인터 락 상태 확인
            document.addEventListener('mousemove', onMouseMove);
        }
        document.addEventListener('pointerlockchange', handlePointerLockChange);
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('pointerlockchange', handlePointerLockChange);
        };
    }, [onMouseMove]);

    // 매 프레임마다 플레이어 및 오브젝트 움직임과 서버 업데이트 로직
    useFrame(() => {
        const keys = getKeys();
        const vel = playerRef.current?.linvel() || { x: 0, y: 0, z: 0 };
        const pos = playerRef.current?.translation() || { x: 0, y: 0, z: 0 };

        // 플레이어 위치 및 애니메이션 정보 서버로 전송 (멀티플레이어 핵심)
        if (stompClientInstance && stompClientInstance.connected) {
            const playerState = {
                id: currentPlayerId,
                position: { x: pos.x, y: pos.y, z: pos.z },
                rotationY: yaw.current + Math.PI, // 3D 모델의 정면을 맞추기 위한 회전 보정
                animationState: {
                    isWalking: keys.forward, isBackward: keys.backward, isLeft: keys.left, isRight: keys.right,
                    isJumping: keys.jump, isRunning: keys.runFast && (keys.forward || keys.left || keys.right || keys.backward),
                    isSitted: sitToggle, isSittedAndWalk: sitToggle && (keys.forward || keys.left || keys.right || keys.backward),
                    isLyingDown: lieToggle, isLyingDownAndWalk: lieToggle && (keys.forward || keys.left || keys.right || keys.backward),
                    isPunching: isPunching,
                    isIdle: !(keys.forward || keys.backward || keys.left || keys.right || keys.jump || keys.runFast || isPunching) && !sitToggle && !lieToggle
                }
            };
            // console.log("[Player] Publishing playerMove:", playerState); // 디버깅 시에만 활성화
            stompClientInstance.publish({
                destination: `/app/playerMove`,
                body: JSON.stringify(playerState)
            });

            // 오브젝트 위치 전송
            const objectPositions = Object.entries(objectRefs.current)
                .map(([id, ref]) => {
                    const objPos = ref.translation();
                    return { id, position: { x: objPos.x, y: objPos.y, z: objPos.z } };
                });

            if (objectPositions.length > 0) {
                // console.log("[Player] Publishing sceneObjects:", objectPositions); // 디버깅 시에만 활성화
                stompClientInstance.publish({
                    destination: '/app/sceneObjects',
                    body: JSON.stringify(objectPositions),
                });
            }
        }

        // 플레이어 이동 로직 (변경 없음)
        const cameraOrientationQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw.current, 0));
        const forwardVector = new THREE.Vector3(0, 0, 1).applyQuaternion(cameraOrientationQ).normalize();
        const rightVector = new THREE.Vector3().crossVectors(forwardVector, new THREE.Vector3(0, 1, 0)).normalize();
        let actualSpeed = speed;

        if (sitToggle && (keys.forward || keys.backward || keys.left || keys.right)) {
            actualSpeed = Math.max(speed * 0.5, 1.5); // 앉은 채 이동
        } else if (lieToggle && (keys.forward || keys.backward || keys.left || keys.right)) {
            actualSpeed = Math.max(speed * 0.15, 1.2); // 누운 채 이동
        } else if (keys.runFast && (keys.forward || keys.backward || keys.left || keys.right)) {
            actualSpeed = speed + 2; // 달리기
        }

        let vx = 0, vz = 0;

        if (keys.forward) {
            vx += forwardVector.x * actualSpeed;
            vz += forwardVector.z * actualSpeed;
        }
        if (keys.backward) {
            vx -= forwardVector.x * actualSpeed;
            vz -= forwardVector.z * actualSpeed;
        }
        if (keys.left) {
            vx -= rightVector.x * actualSpeed;
            vz -= rightVector.z * actualSpeed;
        }
        if (keys.right) {
            vx += rightVector.x * actualSpeed;
            vz += rightVector.z * actualSpeed;
        }

        playerRef.current.setLinvel({ x: vx, y: vel.y, z: vz }, true);

        // 점프 로직
        if (keys.jump && isGrounded && vel.y <= 0.1) {
            playerRef.current.applyImpulse({ x: 0, y: jumpImpulse, z: 0 }, true);
            setIsGrounded(false);
        }

        const playerBodyPos = new THREE.Vector3(pos.x, pos.y, pos.z);
        const headOffset = new THREE.Vector3(0, 0.3, 0);

        // 3인칭 모델 위치 및 회전 업데이트
        if (modelRef.current) {
            modelRef.current.position.copy(playerBodyPos);
            modelRef.current.position.y += -0.725; // Rapier의 RigidBody 중심과 캡슐 모델의 바닥을 맞추기 위한 오프셋
            modelRef.current.visible = viewMode === 'thirdPerson'; // 3인칭일 때만 모델 보이기

            const horizontalMovementLengthSq = vx * vx + vz * vz;
            if (horizontalMovementLengthSq > 0.01) {
                const targetRotationY = Math.atan2(vx, vz);
                modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, targetRotationY, 0.15);
            } else {
                modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, yaw.current, 0.15);
            }
        }

        // 카메라 위치 및 회전 업데이트 (1인칭/3인칭 뷰)
        if (viewMode === 'firstPerson') {
            const cameraPosition = playerBodyPos.clone().add(headOffset);
            camera.position.copy(cameraPosition);
            const cameraRotation = new THREE.Euler(pitch.current, yaw.current + Math.PI, 0, 'YXZ');
            camera.quaternion.setFromEuler(cameraRotation);
        } else { // Third-person camera (3인칭 카메라)
            const dist = 5;
            const phi = Math.PI / 2 - pitch.current;
            const theta = yaw.current + Math.PI;

            const camX = dist * Math.sin(phi) * Math.sin(theta);
            const camY = dist * Math.cos(phi);
            const camZ = dist * Math.sin(phi) * Math.cos(theta);

            const camPos = new THREE.Vector3(playerBodyPos.x + camX, playerBodyPos.y + 1 + camY, playerBodyPos.z + camZ);
            camera.position.copy(camPos);

            camera.lookAt(playerBodyPos.x, playerBodyPos.y + 1, playerBodyPos.z);
        }

        // HUD 상태 업데이트
        onHudUpdate?.(prev => ({
            ...prev,
            viewMode,
            isGrounded,
            position: `(${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)})`,
            velocity: `(${vel.x.toFixed(2)}, ${vel.y.toFixed(2)}, ${vel.z.toFixed(2)})`,
            yaw: yaw.current,
            pitch: pitch.current,
            keys,
        }));
    });

    const keys = getKeys();

    return (
        <>
            <RigidBody
                ref={playerRef}
                position={[0, 1.1, 0]}
                colliders={false}
                enabledRotations={[false, false, false]}
                onCollisionEnter={() => setIsGrounded(true)}
                onCollisionExit={() => setIsGrounded(false)}
            >
                <CapsuleCollider args={[0.35, 0.4]} />
            </RigidBody>

            <CharacterModel
                ref={modelRef}
                isWalking={keys.forward}
                isBackward={keys.backward}
                isLeft={keys.left}
                isRight={keys.right}
                isJumping={keys.jump}
                isRunning={keys.runFast && (keys.forward || keys.left || keys.right || keys.backward)}
                isSittedAndWalk={sitToggle && (keys.forward || keys.left || keys.right || keys.backward)}
                isSitted={sitToggle}
                isLyingDownAndWalk={lieToggle && (keys.forward || keys.left || keys.right || keys.backward)}
                isLyingDown={lieToggle}
                isIdle={!(keys.forward || keys.backward || keys.left || keys.right || keys.jump || keys.runFast || isPunching) && !sitToggle && !lieToggle}
                isPunching={isPunching}
            />
        </>
    );
}

// 플레이어 HUD (Head-Up Display) 컴포넌트
function PlayerHUD({ state }) {
    // state.otherPlayers는 이제 Map 객체
    const otherPlayersArray = state.otherPlayers ? Array.from(state.otherPlayers.values()) : [];
    const otherPlayersInfo = otherPlayersArray
        .filter(p => p.id !== currentPlayerId)
        .map(p => `ID: ${p.id.substring(0, 5)}, Pos: (${p.position?.x?.toFixed(1) || 'N/A'}, ${p.position?.y?.toFixed(1) || 'N/A'}, ${p.position?.z?.toFixed(1) || 'N/A'})`)
        .join('\n');

    return (
        <div style={{
            position: 'absolute',
            top: 20,
            left: 20,
            color: 'white',
            fontSize: 14,
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: 10,
            borderRadius: 8,
            zIndex: 100
        }}>
            <div><strong>Current Player ID:</strong> {currentPlayerId.substring(0, 5)}</div>
            <div><strong>View:</strong> {state.viewMode}</div>
            <div><strong>isGrounded:</strong> {state.isGrounded ? '✅' : '❌'}</div>
            <div><strong>Position:</strong> {state.position}</div>
            <div><strong>Velocity:</strong> {state.velocity}</div>
            <div><strong>Yaw:</strong> {state.yaw?.toFixed(2) ?? 'N/A'}</div>
            <div><strong>Pitch:</strong> {state.pitch?.toFixed(2) ?? 'N/A'}</div>
            <div><strong>Keys:</strong> {state.keys ? Object.entries(state.keys).filter(([, v]) => v).map(([k]) => k).join(', ') : 'N/A'}</div>
            <br />
            <div><strong>-- Other Players --</strong></div>
            {otherPlayersArray.filter(p => p.id !== currentPlayerId).length > 0 &&
                <div>Total Other Players: {otherPlayersArray.filter(p => p.id !== currentPlayerId).length}</div>
            }
            <pre style={{ whiteSpace: 'pre-wrap' }}>{otherPlayersInfo || "No other players"}</pre>
        </div>
    );
}

// --- SceneObject 컴포넌트 (변경 없음) ---
function SceneObject({ obj, objectRefs }) {
    const rigidBodyRef = useRef();

    useEffect(() => {
        if (rigidBodyRef.current) {
            objectRefs.current[obj.id] = rigidBodyRef.current;
        }
        return () => {
            if (objectRefs.current[obj.id] === rigidBodyRef.current) {
                delete objectRefs.current[obj.id];
            }
        };
    }, [obj.id, objectRefs]);

    useEffect(() => {
        if (rigidBodyRef.current && obj.position) {
            const newPos = new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z);
            rigidBodyRef.current.setTranslation(newPos, true);
        }
    }, [obj.position]);

    return (
        <RigidBody
            ref={rigidBodyRef}
            position={[obj.position.x, obj.position.y, obj.position.z]}
            colliders={obj.collider}
        >
            <mesh castShadow receiveShadow>
                {/* obj.type이 'box'이면 boxGeometry를, 아니면 sphereGeometry를 사용합니다. */}
                {obj.type === 'box' ? (
                    <boxGeometry args={[obj.size.x, obj.size.y, obj.size.z]} /> // 박스 크기는 obj.size에서 가져옵니다.
                ) : (
                    <sphereGeometry args={[obj.radius, 32, 32]} /> // 구체 크기는 obj.radius에서 가져옵니다.
                )}
                <meshStandardMaterial color={obj.color} />
            </mesh>
        </RigidBody>
    );
}

// 메인 App 컴포넌트
export default function App() {
    const [hudState, setHudState] = useState({});
    const [sceneObjects, setSceneObjects] = useState([
        {
            id: 'ball1',
            type: 'sphere',
            position: { x: 5, y: 1.5, z: -5 },
            radius: 1,
            color: 'purple',
            collider: 'ball',
        },
        {
            id: 'ball2',
            type: 'sphere',
            position: { x: -5, y: 2.5, z: 5 },
            radius: 1.5,
            color: 'cyan',
            collider: 'ball',
        },
        {
            id: 'ball3',
            type: 'sphere',
            position: { x: 0, y: 3.5, z: 7 },
            radius: 0.8,
            color: 'gold',
            collider: 'ball',
        },
        {
            id: 'ball4',
            type: 'sphere',
            position: { x: 8, y: 1, z: 0 },
            radius: 0.6,
            color: 'red',
            collider: 'ball',
        },
        {
            id: 'ball5',
            type: 'sphere',
            position: { x: -8, y: 1, z: -8 },
            radius: 1.2,
            color: 'lime',
            collider: 'ball',
        },
        {
            id: 'myBox1', // **고유한 ID**를 지정해주세요.
            type: 'box', // **type을 'box'로 설정**하여 SceneObject가 박스를 렌더링하도록 합니다.
            position: { x: 3, y: 0.5, z: -2 }, // 박스의 초기 위치
            size: { x: 2, y: 1, z: 2 }, // **박스의 가로(x), 세로(y), 깊이(z) 크기**를 지정합니다.
            color: 'red', // 박스의 색상
            collider: 'cuboid', // **충돌체 타입도 'box'로 설정**하여 SceneObject가 Rapier의 'cuboid'를 사용하도록 합니다.
        },
    ]);
    const objectRefs = useRef({});

    // STOMP 클라이언트를 App 컴포넌트 상태로 관리 (한 번만 초기화)
    const [stompClient, setStompClient] = useState(null);

    // 웹소켓 연결 및 구독 로직 (App 컴포넌트에서 단 한번 실행)
    useEffect(() => {
        const WS_URL = 'http://localhost:8080/ws';
        const socket = new SockJS(WS_URL);
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = (frame) => {
            console.log("[STOMP] Connected to WebSocket from App.jsx!", frame);
            
            // 플레이어 위치 구독
            client.subscribe('/topic/playerLocations', (message) => {
                // console.log("[STOMP] Received playerLocations message:", message.body); // 디버깅 시에만 활성화
                try {
                    const allPlayerPositions = JSON.parse(message.body);
                    // Map 객체로 변환하여 효율적으로 관리
                    const playerMap = new Map(allPlayerPositions.map(p => [p.id, p]));
                    setHudState(prev => ({
                        ...prev,
                        otherPlayers: playerMap // Map 객체로 저장
                    }));
                } catch (e) {
                    console.error("[STOMP Subscribe] Failed to parse player locations message:", e, message.body);
                }
            });

            // 오브젝트 상태 구독
            client.subscribe('/topic/sceneObjects', (message) => {
                // console.log("[STOMP] Received sceneObjects message:", message.body); // 디버깅 시에만 활성화
                try {
                    const updatedObjects = JSON.parse(message.body);
                    // console.log("[STOMP] Parsed sceneObjects:", updatedObjects); // 디버깅 시에만 활성화
                    handleSceneObjectsUpdate(updatedObjects);
                } catch (e) {
                    console.error("[STOMP Subscribe] Failed to parse scene objects message:", e, message.body);
                }
            });
            
            // 연결 성공 후 stompClient 상태 설정
            setStompClient(client);
        };

        client.onStompError = (frame) => {
            console.error('STOMP Error from App.jsx:', frame);
        };

        client.onDisconnect = () => {
            console.log('[STOMP] Disconnected from WebSocket from App.jsx.');
            setStompClient(null); // 연결 해제 시 클라이언트 상태 null로
        };

        client.activate();

        // 컴포넌트 언마운트 시 웹소켓 연결 해제
        return () => {
            // 새로고침 또는 탭 닫기 전 플레이어 등록 해제 메시지 전송
            const handleBeforeUnload = () => {
                if (client && client.connected) {
                    client.publish({ destination: '/app/unregisterPlayer', body: JSON.stringify({ id: currentPlayerId }) });
                    client.deactivate();
                }
            };
            window.addEventListener('beforeunload', handleBeforeUnload);

            if (client && client.connected) {
                client.publish({ destination: '/app/unregisterPlayer', body: JSON.stringify({ id: currentPlayerId }) });
                client.deactivate();
            }
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []); // 빈 배열: 컴포넌트 마운트 시 단 한 번만 실행

    // 서버에서 받은 오브젝트 상태를 업데이트하는 콜백 함수 (변경 없음)
    const handleSceneObjectsUpdate = useCallback((updatedObjects) => {
        setSceneObjects(prevObjects => {
            const newObjectsMap = new Map(prevObjects.map(obj => [obj.id, obj]));
            updatedObjects.forEach(updatedObj => {
                const currentObj = newObjectsMap.get(updatedObj.id);
                if (currentObj) {
                    newObjectsMap.set(updatedObj.id, { ...currentObj, position: updatedObj.position });
                } else {
                    newObjectsMap.set(updatedObj.id, {
                        ...updatedObj,
                        type: updatedObj.type || 'sphere',
                        radius: updatedObj.radius || 1,
                        color: updatedObj.color || 'gray',
                        collider: updatedObj.collider || 'ball',
                    });
                }
            });
            return Array.from(newObjectsMap.values());
        });
    }, []);


    return (
        <>
            <Leva collapsed={false} />
            <PlayerHUD state={hudState} />

            <KeyboardControls map={controlsMap}>
                <Canvas
                    shadows
                    camera={{ fov: 60, position: [0, 5, 10] }}
                    style={{ width: '100vw', height: '100vh' }}
                    linear={false}
                >
                    {/* 배경색을 어둡게 설정합니다. 완전 검정색이나 아주 어두운 회색을 사용하세요. */}
                    <color attach="background" args={['#8fafdb']} /> {/* 어두운 회색 */}
                    {/* 또는 완전 검정색: <color attach="background" args={['black']} /> */}

                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
                    <Physics gravity={[0, -9.81, 0]}>
                        {/* 바닥 (고정된 물리 객체) */}
                        <RigidBody type="fixed">
                            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                                <planeGeometry args={[100, 100]} />
                                <meshStandardMaterial color="green" />
                            </mesh>
                        </RigidBody>

                        {/* 맵 경계 벽들 (투명한 고정 물리 객체) */}
                        <RigidBody type="fixed" position={[0, 500, -50]}>
                            <mesh>
                                <boxGeometry args={[100, 1000, 1]} />
                                <meshStandardMaterial transparent opacity={0} />
                            </mesh>
                        </RigidBody>
                        <RigidBody type="fixed" position={[0, 500, 50]}>
                            <mesh>
                                <boxGeometry args={[100, 1000, 1]} />
                                <meshStandardMaterial transparent opacity={0} />
                            </mesh>
                        </RigidBody>
                        <RigidBody type="fixed" position={[50, 500, 0]}>
                            <mesh>
                                <boxGeometry args={[1, 1000, 100]} />
                                <meshStandardMaterial transparent opacity={0} />
                            </mesh>
                        </RigidBody>
                        <RigidBody type="fixed" position={[-50, 500, 0]}>
                            <mesh>
                                <boxGeometry args={[1, 1000, 100]} />
                                <meshStandardMaterial transparent opacity={0} />
                            </mesh>
                        </RigidBody>

                        {/* 현재 플레이어 컴포넌트: stompClient를 prop으로 전달 */}
                        {stompClient && ( // stompClient가 초기화된 후에만 Player 렌더링
                            <Player
                                onHudUpdate={setHudState}
                                objectRefs={objectRefs}
                                stompClientInstance={stompClient} // stompClient 인스턴스 전달
                                onSceneObjectsUpdate={handleSceneObjectsUpdate}
                            />
                        )}

                        {/* 다른 플레이어들 렌더링 */}
                        {hudState.otherPlayers && Array.from(hudState.otherPlayers.values()).map((player) => (
                            player.id !== currentPlayerId && (
                                <OtherPlayer
                                    key={player.id}
                                    id={player.id}
                                    position={player.position}
                                    rotationY={player.rotationY}
                                    animationState={player.animationState}
                                />
                            )
                        ))}

                        {/* 물리 상호작용을 위한 구체 오브젝트들 (SceneObject 컴포넌트로 대체) */}
                        {sceneObjects.map((obj) => (
                            <SceneObject
                                key={obj.id}
                                obj={obj}
                                objectRefs={objectRefs}
                            />
                        ))}

                    </Physics>
                </Canvas>
            </KeyboardControls>
        </>
    );
=======
        <div
            className="w-screen h-screen bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: "url('/background-image.jpg')" }} // 배경 이미지 경로 설정
        >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-10 max-w-lg w-full text-center shadow-2xl border border-white/20">
                <h1 className="text-5xl font-extrabold text-white mb-6 drop-shadow-lg">
                    🕹️ 멀티플레이어 3D 게임
                </h1>
                <p className="text-lg text-gray-100 mb-8">
                    게임에 입장할 닉네임을 입력하세요.
                </p>
                <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="닉네임을 입력하세요"
                    maxLength={10} // 닉네임 최대 길이 제한
                    className="w-full p-3 mb-4 text-center text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleNicknameSubmit();
                        }
                    }}
                />
                <button
                    onClick={handleNicknameSubmit}
                    className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-xl shadow-lg transition-transform transform hover:scale-105 active:scale-95"
                >
                    🚪 게임 입장하기
                </button>
            </div>
        </div>
    );
>>>>>>> teammate/feature/jaemin
}
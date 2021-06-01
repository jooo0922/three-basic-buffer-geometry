'use strict';

import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';

function main() {
  // create WebGLRenderer
  const canvas = document.querySelector('#canvas');
  const renderer = new THREE.WebGLRenderer({
    canvas
  });

  // create camera
  const fov = 75;
  const aspect = 2;
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 5;

  // create scene
  const scene = new THREE.Scene;

  // create directional light
  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  // 이전에는 built-in geometry로 정육면체 박스 지오메트리를 생성했지만, 이제 사용자 지정 BufferGeometry로 생성해볼거임.
  // 우선, 만들고자 하는 geometry의 각 vertex(꼭지점)의 BufferAttribute들(position, normal, color, uv)을 직접 지정해서 배열로 정리해놓아야 함.
  /**
   * 참고로 uv란 무엇일까?
   * 
   * uv란, 물체에 입히려고 하는 텍스처 상의 가로축 좌표값을 u, 세로축 좌표값을 v, 합쳐서 uv라고 표현함.
   * 왜 uv라고 표현하냐면, 3D 공간상에서 이미 x, y, z로 좌표값을 표현하고 있기 때문에, 그것을 제외한 다른 미지수값으로써 u, v를 활용한 것일 뿐임.
   * 
   * 그럼 특정 vertex에 uv값을 지정한다는 게 어떤 의미일까?
   * uv는 텍스처 상에서의 좌표값인데, 그거를 3D 공간상의 어떤 물체의 vertex를 정의할 때 지정한다는 뜻은,
   * '이 텍스처를 해당 물체에 입혀줄 때, 해당 uv 좌표값 지점을 이 vertex(꼭지점)에 붙여주새요' 라는 뜻임.
   * 
   * 예를 들어, 물체A의 어떤 버텍스B의 uv를 (1, 0)으로 지정하면,
   *  물체A에 텍스처를 씌울 때, 텍스처의 (1, 0)부분이 버텍스B 부분에 대응하도록 씌워질 것임.
   */
  const vertices = [
    // 앞쪽
    {
      pos: [-1, -1, 1],
      norm: [0, 0, 1],
      uv: [0, 0],
    }, // 0
    {
      pos: [1, -1, 1],
      norm: [0, 0, 1],
      uv: [1, 0],
    }, // 1
    {
      pos: [-1, 1, 1],
      norm: [0, 0, 1],
      uv: [0, 1],
    }, // 2
    // { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 1], },
    // { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 0], },
    {
      pos: [1, 1, 1],
      norm: [0, 0, 1],
      uv: [1, 1],
    }, // 3

    // 오른쪽
    {
      pos: [1, -1, 1],
      norm: [1, 0, 0],
      uv: [0, 0],
    }, // 4
    {
      pos: [1, -1, -1],
      norm: [1, 0, 0],
      uv: [1, 0],
    }, // 5
    // { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 1], },
    // { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 0], },
    {
      pos: [1, 1, 1],
      norm: [1, 0, 0],
      uv: [0, 1],
    }, // 6
    {
      pos: [1, 1, -1],
      norm: [1, 0, 0],
      uv: [1, 1],
    }, // 7

    // 뒤쪽
    {
      pos: [1, -1, -1],
      norm: [0, 0, -1],
      uv: [0, 0],
    }, // 8
    {
      pos: [-1, -1, -1],
      norm: [0, 0, -1],
      uv: [1, 0],
    }, // 9
    // { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 1], },
    // { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 0], },
    {
      pos: [1, 1, -1],
      norm: [0, 0, -1],
      uv: [0, 1],
    }, // 10
    {
      pos: [-1, 1, -1],
      norm: [0, 0, -1],
      uv: [1, 1],
    }, // 11

    // 왼쪽
    {
      pos: [-1, -1, -1],
      norm: [-1, 0, 0],
      uv: [0, 0],
    }, // 12
    {
      pos: [-1, -1, 1],
      norm: [-1, 0, 0],
      uv: [1, 0],
    }, // 13
    // { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 1], },
    // { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 0], },
    {
      pos: [-1, 1, -1],
      norm: [-1, 0, 0],
      uv: [0, 1],
    }, // 14
    {
      pos: [-1, 1, 1],
      norm: [-1, 0, 0],
      uv: [1, 1],
    }, // 15

    // 상단
    {
      pos: [1, 1, -1],
      norm: [0, 1, 0],
      uv: [0, 0],
    }, // 16
    {
      pos: [-1, 1, -1],
      norm: [0, 1, 0],
      uv: [1, 0],
    }, // 17
    // { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 1], },
    // { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 0], },
    {
      pos: [1, 1, 1],
      norm: [0, 1, 0],
      uv: [0, 1],
    }, // 18
    {
      pos: [-1, 1, 1],
      norm: [0, 1, 0],
      uv: [1, 1],
    }, // 19

    // 하단
    {
      pos: [1, -1, 1],
      norm: [0, -1, 0],
      uv: [0, 0],
    }, // 20
    {
      pos: [-1, -1, 1],
      norm: [0, -1, 0],
      uv: [1, 0],
    }, // 21
    // { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 1], },
    // { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 0], },
    {
      pos: [1, -1, -1],
      norm: [0, -1, 0],
      uv: [0, 1],
    }, // 22
    {
      pos: [-1, -1, -1],
      norm: [0, -1, 0],
      uv: [1, 1],
    }, // 23
  ];
  // 총 36개의 vertex값들을 정의하여 담아놓은 배열.
  // 왜 정육면체가 꼭지점이 36개냐? 면 6개 * 면 하나당 삼각형 2개 * 삼각형 하나당 꼭지점 3개 = 36개니까...

  // 다음으로 이 vertex 배열을 position, normal, uv 값들끼리만 따로 모아놓은 3개의 평행 배열로 바꿔줘야 함.
  // 왜 그렇게 바꿔줘야 하나면, BufferGeometry에서 각각의 값들만 따로 모아놓은 배열들로 받기 때문에..
  const positions = [];
  const normals = [];
  const uvs = [];
  /**
   * for (variable of iterable) {
   *  statement
   * }
   * 
   * for...of 구문은 반복되는 열거가능한(enumerable) 속성이 있는 객체에 대하여 반복문을 실행하는데,
   * 이 때, 각 반복문이 호출될 때마다 열거가능한 속성이 있는 객체 내의 각각의 속성들을 variable에 할당해서(potato라고 써도 되겠지?)
   * 그거를 for loop 내부에서 실행해줌.
   */
  for (const vertex of vertices) {
    positions.push(...vertex.pos); // ...(spread operator)는 배열 또는 오브젝트 내의 값들을 하나하나 낱개로 가져와서 position에 차곡차곡 push해줌.
    normals.push(...vertex.norm);
    uvs.push(...vertex.uv);
  }

  // BufferGeometry를 만들고, 각 배열들로 BufferAttribute 인스턴스를 생성한 뒤 그거를 앞에서 만든 BufferGeometry에 추가해 줌.
  const geometry = new THREE.BufferGeometry();
  const positionNumComponents = 3;
  const normalNumComponents = 3;
  const uvNumComponents = 2; // BufferAttribute를 생성할 때 하나의 꼭지점에 대해 각각의 배열에서 몇 개의 요소를 사용해야 하는건지 지정해준 값들.
  geometry.setAttribute(
    'position', // BufferAttribute를 생성할 때 Three.js가 원하는 속성 이름을 써줘야 함.
    new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents) // BufferAttribute는 순수 배열이 아닌 형식화 배열을 인자로 받기 때문에 각 배열을 Float32Array로 변환해 줌
  ); // 형식화 배열이란 배열처럼 생긴 객체이고, 원시 이진 데이터에 접근하는 메커니즘을 제공하는데, 이렇게 하면 자바스크립트 엔진이 형식화 배열을 더 쉽고 빠르게 조작할 수 있다고 함...
  geometry.setAttribute(
    'normal',
    new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents)
  );
  geometry.setAttribute(
    'uv',
    new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents)
  );

  /**
   * 중복되는 vertex data를 제거해서 사용하기
   * 
   * 우리가 처음에 작성한 vertices 배열은 꼭지점이 너무 많은데 값들이 완전히 중복되는 꼭지점들이 몇 개 있지?
   * 중복되는 2개의 꼭지점 데이터들 중 1개는 지워주고, 지워진 꼭지점 데이터를 BufferGeometry에서 참조할 때, 
   * 지워지지 않은 1개의 꼭지점 데이터의 인덱스로 참조하게끔 바꾸는 게 더 나을것 같다.
   * 
   * 중복되는 꼭지점들을 지워주면 총 24개의 꼭지점 데이터가 남게 되는데,
   * 여기서 지워진 꼭지점 데이터를 인덱스로 참조하려면 
   * BufferGeometry.setIndex 메소드로 지워진 꼭지점 데이터의 개수를 포함한 36개의 인덱스값을 넘겨줘야 한다.
   * 
   * 이렇게 해주면 BufferGeometry는 지정된 36개의 인덱스값을 이용하여 꼭지점 데이터에 접근할 수 있다.
   */
  geometry.setIndex([
    0, 1, 2, 2, 1, 3, // 앞쪽
    4, 5, 6, 6, 5, 7, // 오른쪽
    8, 9, 10, 10, 9, 11, // 뒤쪽
    12, 13, 14, 14, 13, 15, // 왼쪽
    16, 17, 18, 18, 17, 19, // 상단
    20, 21, 22, 22, 21, 23, // 하단
  ]);

  // load texture
  const loader = new THREE.TextureLoader();
  const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/star.png');

  // 위에서 만든 Buffer Geometry와 로드한 텍스처를 할당한 퐁-머티리얼로 큐브 메쉬를 만들어주는 함수
  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({
      color,
      map: texture
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube); // 생성된 메쉬들은 미리미리 씬에 다 추가해놓기

    cube.position.x = x; // 전달받은 x값으로 x좌표값을 이동시켜서 큐브 사이에 간격을 띄워 줌.
    return cube; // 메쉬 객체를 리턴해줘서 메쉬 객체가 담긴 cubes 배열을 만들고 그걸로 animate 함수에서 for loop를 돌려 애니메이션을 계산해줄거임 
  }

  // 큐브 메쉬를 모아놓은 배열 생성
  const cubes = [
    makeInstance(geometry, 0x88FF88, 0),
    makeInstance(geometry, 0x8888FF, -4),
    makeInstance(geometry, 0xFF8888, 4)
  ];

  // resize
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  // animate
  function animate(t) {
    t *= 0.001; // 초 단위로 변환

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    cubes.forEach((cube, index) => {
      const speed = 1 + index * 0.1;
      const rotate = t * speed;
      cube.rotation.x = rotate;
      cube.rotation.y = rotate;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

main();
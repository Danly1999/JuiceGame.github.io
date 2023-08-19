            
            import * as THREE from 'three';
            import { DemoShader } from './DemoShader.js';
            import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
            import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
            
            
        let mixer;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera( 45, 300 /200, 1, 2000 );
        camera.position.set( 100, 200, 300 );
        const renderer = new THREE.WebGLRenderer();
        scene.background = new THREE.Color( 0xa0a0a0 );
        renderer.setSize( 300, 200 );
        document.getElementById("two2").appendChild( renderer.domElement );

        const geometry = new THREE.BoxGeometry( 10, 10 ,10);


        //const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const textureLoader = new THREE.TextureLoader();
        const texture =textureLoader.load('./three.js-master/examples/textures/colors.png')
        const material = new THREE.ShaderMaterial({
        uniforms: 
        {
            scale: {
                value: 0,
            },
            _Time: {
                value: 0,
            },
            uTexture: { value: texture }

        },
            vertexShader: DemoShader.vertexShader,
            fragmentShader: DemoShader.fragmentShader
        });

        const clock = new THREE.Clock();
        function tick(){
        const elapsedTime = clock.getElapsedTime();
        material.uniforms._Time.value = elapsedTime;
        // ...
        }
        
        const cube = new THREE.Mesh( geometry, material );
        scene.add( cube );
        const loader = new FBXLoader();
				loader.load( './three.js-master/examples/models/fbx/Samba Dancing.fbx', function ( object ) {

					mixer = new THREE.AnimationMixer( object );

					const action = mixer.clipAction( object.animations[ 0 ] );
					action.play();

					object.traverse( function ( child ) {

						if ( child.isMesh ) {

							child.castShadow = true;
							child.receiveShadow = true;
                            child.material = material;

						}

					} );

					scene.add( object );

				} );
        
        camera.position.z = 5;
        const controls = new OrbitControls(camera,renderer.domElement);
        function animate() {
            requestAnimationFrame( animate );
            tick();
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            const delta = clock.getDelta();

            if ( mixer ) mixer.update( delta );
            
            renderer.render( scene, camera );
        }

        animate();
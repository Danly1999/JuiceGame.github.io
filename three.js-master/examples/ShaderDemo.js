            
            import * as THREE from 'three';
            import { DemoShader } from './DemoShader.js';
            import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
            import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
            
            
        let mixer;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
        camera.position.set( 0, 0, 0 );
        const renderer = new THREE.WebGLRenderer();
        scene.background = new THREE.Color( 0xFF8080 );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.getElementById("background").appendChild( renderer.domElement );

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
        
        const loader = new FBXLoader();
				loader.load( './three.js-master/examples/models/fbx/Samba Dancing.fbx', function ( object ) {



					object.traverse( function ( child ) {

						if ( child.isMesh ) {

							child.castShadow = true;
							child.receiveShadow = true;
                            child.material = material;

						}

					} );

					scene.add( object );

				} );
        
        camera.position.z = 100;
        const controls = new OrbitControls(camera,renderer.domElement);
        function animate() {
            requestAnimationFrame( animate );
            tick();
            const delta = clock.getDelta();

            if ( mixer ) mixer.update( delta );
            
            renderer.render( scene, camera );
        }

        animate();
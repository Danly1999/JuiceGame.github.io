import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

import { RGBShiftShader } from 'three/addons/shaders/RGBShiftShader.js';
import { DotScreenShader } from 'three/addons/shaders/DotScreenShader.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { LuminosityShader } from 'three/addons/shaders/LuminosityShader.js';
import { SobelOperatorShader } from 'three/addons/shaders/SobelOperatorShader.js';
//import model from './modle.js';
const guiUse = 
{
    r : 50,
    num : 100
}

const geometry = new THREE.BufferGeometry();
const particles = new THREE.BufferGeometry();
const pointVertices = new Float32Array(guiUse.num*3);
const lineVertices = new Float32Array(guiUse.num*3);
const colors = new Float32Array( guiUse.num *3 );
let lines;
let polints;

const renderer1 = new THREE.WebGLRenderer({antialias:true,alpha:true});
const renderer2 = new THREE.WebGLRenderer({antialias:true,alpha:true});

//抗锯齿固定设置
renderer1.setPixelRatio(window.devicePixelRatio);
renderer1.setClearColor(0x444444);
renderer1.setSize( 300, 200 );

renderer2.setPixelRatio(window.devicePixelRatio);
renderer2.setClearColor(0x444444);
renderer2.setSize( 300, 200 );
const stats = new Stats();
//document.getElementById("webgl").appendChild( stats.domElement );
document.getElementById("two").appendChild( renderer1.domElement );
document.getElementById("two3").appendChild( renderer2.domElement );


//document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();

drawLine();

const camera = new THREE.PerspectiveCamera( 45, 300 / 200, 1, 2000 );
camera.position.set( 0, 0, -100 );


// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );

//调整窗口尺寸
// window.onresize = function()
// {
//     renderer.setSize( window.innerWidth, window.innerHeight );
//     camera.aspect = window.innerWidth/window.innerHeight;
//     camera.updateProjectionMatrix();
// }


const gui = new GUI();
gui.add(guiUse,'r',0,100).name("r");
gui.add(guiUse,'num',0,200).name("num");
// gui.addColor(material,'color').onChange(function(value)
// {
//     mesh.material.color.set(value);
// })
let composer;
composer = new EffectComposer( renderer1 );
composer.addPass( new RenderPass( scene, camera ) );
const effectGrayScale = new ShaderPass( LuminosityShader );
composer.addPass( effectGrayScale );

const effectSobel = new ShaderPass( SobelOperatorShader );
effectSobel.uniforms[ 'resolution' ].value.x = window.innerWidth * window.devicePixelRatio;
effectSobel.uniforms[ 'resolution' ].value.y = window.innerHeight * window.devicePixelRatio;
composer.addPass( effectSobel );

const effect1 = new ShaderPass( DotScreenShader );
effect1.uniforms[ 'scale' ].value = 4;
composer.addPass( effect1 );

const effect2 = new ShaderPass( RGBShiftShader );
effect2.uniforms[ 'amount' ].value = 0.0015;
composer.addPass( effect2 );

const effect3 = new OutputPass();
composer.addPass( effect3 );




//旋转相机
const controls = new OrbitControls(camera,renderer1.domElement);
const controls2 = new OrbitControls(camera,renderer2.domElement);


const clock = new THREE.Clock()

animate();
function animate() {
    stats.update();
    requestAnimationFrame( animate );
    camera.lookAt( scene.position );
    let vertexpos = 0;
    for (let index = 0; index < guiUse.num; index++) {
        const speed = new THREE.Vector3( - 1 + Math.random() * 2, - 1 + Math.random() * 2, - 1 + Math.random() * 2 );
        //const rangex = Math.range(0,1);

        pointVertices[ index * 3 ]     += speed.x;
        pointVertices[ index * 3 + 1 ] += speed.y;
        pointVertices[ index * 3 + 2 ] += speed.z;


        lineVertices[ vertexpos++ ] = pointVertices[ index * 3 ];
        lineVertices[ vertexpos++ ] = pointVertices[ index * 3 +1];
        lineVertices[ vertexpos++ ] = pointVertices[ index * 3 +2];
        lineVertices[ vertexpos++ ] = pointVertices[ index * 3 +3];
        lineVertices[ vertexpos++ ] = pointVertices[ index * 3 +4];
        lineVertices[ vertexpos++ ] = pointVertices[ index * 3 +5];

    }
    lines.geometry.setDrawRange( 0, guiUse.num/2 );
    lines.geometry.attributes.position.needsUpdate = true;
    polints.geometry.attributes.position.needsUpdate = true;
    //geometry.setAttribute("position",new THREE.BufferAttribute( vertices, 3 ).setUsage( THREE.DynamicDrawUsage ));
    //particles.setAttribute("position",new THREE.BufferAttribute( vertices, 3 ).setUsage( THREE.DynamicDrawUsage ));
    renderer2.render( scene, camera );
    composer.render();


}
function drawLine() 
{
    for (let i = 0; i < guiUse.num; i++) {
        const x = Math.random() * guiUse.r - guiUse.r / 2;
        const y = Math.random() * guiUse.r - guiUse.r / 2;
        const z = Math.random() * guiUse.r - guiUse.r / 2;
        const colorx = new THREE.Color( "rgb(255, 0, 0)");
        const colory = new THREE.Color( "rgb(255, 255, 255)");
        const colorz = new THREE.Color().lerpColors(colory,0.5);
        
        pointVertices[ i * 3 ] = x;
        pointVertices[ i * 3 + 1 ] = y;
        pointVertices[ i * 3 + 2 ] = z;

    }
    geometry.setAttribute("position",new THREE.BufferAttribute(  pointVertices, 3 ).setUsage( THREE.DynamicDrawUsage ));
    particles.setAttribute("position",new THREE.BufferAttribute( lineVertices, 3 ).setUsage( THREE.DynamicDrawUsage ));

    const material = new THREE.LineBasicMaterial
    ({
        //vertexColors : true,
        //side:THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity : 0.3
        
    })
    const pMaterial = new THREE.PointsMaterial( {
        color: 0xFFFFFF,
        size: 10,
        blending: THREE.AdditiveBlending,
        transparent: true,
        sizeAttenuation: false
    } );
    lines = new THREE.LineSegments(geometry,material);
    polints = new THREE.Points(particles,pMaterial);
    scene.add(lines);
    scene.add(polints);
}

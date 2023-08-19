import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

import { CineShader } from './PostprocessingShaders/CineShader.js';
import { ProteanCloudsShader } from './PostprocessingShaders/ProteanCloudsShader.js';
import { ButtomShader } from './PostprocessingShaders/ButtomShader.js';
import { ColourfulSmoke } from './PostprocessingShaders/ColourfulSmoke.js';
import { tilesShader } from './PostprocessingShaders/tilesShader.js';
import { PrettyHipShader } from './PostprocessingShaders/PrettyHipShader.js';

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
const canvas = document.createElement('canvas');
renderer.setSize( window.innerWidth, window.innerWidth );
document.getElementById("live").appendChild( renderer.domElement,canvas );



let composer = new EffectComposer( renderer );
const effect1 = new ShaderPass( PrettyHipShader );
//effect1.uniforms[ 'iTime' ].value = 4;
//effect1.uniforms[ 'iMouse' ].value = new THREE.Vector2(0,0);
composer.addPass( effect1 );

var mouseX;
var mouseY;
document.addEventListener('mousemove', onMouseMove);
function onMouseMove(event) 
{
    var deltaX = event.clientX - mouseX;
    mouseX = event.clientX;
    var deltaY = event.clientY - mouseY;
    mouseY = event.clientY;

    effect1.uniforms.iMouse.value.x = event.clientX;
    effect1.uniforms.iMouse.value.y = event.clientY;

}


const clock = new THREE.Clock();
function tick()
{
    const elapsedTime = clock.getElapsedTime();
    effect1.uniforms.iTime.value = elapsedTime;
// ...
}

function animate() {
    requestAnimationFrame( animate );
    tick();
    composer.render();
}
window.onresize = function()
{
    renderer.setSize( window.innerWidth, window.innerWidth );
}

animate();
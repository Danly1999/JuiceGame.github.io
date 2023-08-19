const DemoShader = {

	name: 'DemoShader',

	vertexShader: /* glsl */`
    varying vec3 vPosition;
    varying vec2 vUV;
    void main() {

        vPosition = position;
        vUV = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,

	fragmentShader: /* glsl */`

    varying vec2 vUV; // uv
    uniform float scale; // uv
    uniform float _Time; // uv
    uniform sampler2D uTexture; // uv

    void main() { 
        vec4 textureColor = texture2D(uTexture, vUV);
        gl_FragColor = textureColor;
    }`

};

export { DemoShader };

// import { initBuffers } from "./init-buffer.js";
import { drawScene } from "./draw-scene.js";
// import { DoublePendulum } from "./pendulum.js";

function testSpeed() {
    // warmup
    let pendulums = [...Array(1000)].map((x, i) => new FastDoublePendulum())
    

    for (let i = 0; i < 10; i++) {
        pendulums.forEach(p => p.tick())
        let coords = pendulums.map(p => p.getCoords())
    }
    
    pendulums = [...Array(1000)].map((x, i) => new FastDoublePendulum())
    const start = performance.now()

    for (let i = 0; i < 10; i++) {
        pendulums.forEach(p => p.tick())
        let coords = pendulums.map(p => p.getCoords())
    }

    const elapsedTime = performance.now() - start;
    return Math.floor((1000/60)/elapsedTime*10000);
}

const nPendulums = testSpeed();
document.querySelector('#count').textContent = nPendulums;

const colorValues = getColorBuffer(nPendulums)

const stats = new Stats();
stats.showPanel( 0 );
document.body.appendChild( stats.dom );



main();

function main() {
    const canvas = document.querySelector('#glcanvas');

    // const pendulum1 = new DoublePendulum({theta1: 0.5*Math.PI})
    // const pendulum2 = new DoublePendulum({theta1: 0.75*Math.PI})

    const pendulums = [...Array(nPendulums)].map((x, i) => new FastDoublePendulum({theta1: 0.75*Math.PI + i*1e-3/nPendulums, theta2: 0.75*Math.PI, RK: 4}))
    //const pendulums = [new FastDoublePendulum({RK: 4}), new FastDoublePendulum({RK: 2})]

    const gl = canvas.getContext("webgl");

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorValues), gl.STATIC_DRAW)


    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.")
        return;
    };
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    varying lowp vec4 vColor;

    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
    }
    `;

    const fsSource = `
    varying lowp vec4 vColor;

    void main() {
        gl_FragColor = vColor;
    }
    `

    function initShaderProgram(gl, vsSource, fsSource) {
        const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
        
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert(
              `Unable to initialize the shader program: ${gl.getProgramInfoLog(
                shaderProgram
              )}`
            );
            return null;
          }

        return shaderProgram;
    }

    function loadShader(gl, type, source) {
        const shader = gl.createShader(type);

        gl.shaderSource(shader, source);

        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(
              `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
            );
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
            vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
        }
    }


    function tick(time) {
        stats.begin()
        // const buffers = initBuffers(gl);
        pendulums.forEach(p => p.tick())

        // function initColorBuffer(gl) {
        //     const colors = [...Array(32*4)].map(x => 1.0)

        //     const colorBuffer = gl.createBuffer();
        //     gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        //     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

        //     return colorBuffer;
        // }

        const positionBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = pendulums.map(p => {
            const coords = p.getCoords();
            return [0, 0, coords.x1, coords.y1, coords.x2, coords.y2]
        }).flat()


        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        
        const buffers = {
            position: positionBuffer,
            color: colorBuffer
        }

        drawScene(gl, programInfo, buffers, nPendulums);

        stats.end();
        requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
}


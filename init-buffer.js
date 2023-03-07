import { DoublePendulum } from "./pendulum.js";

function initBuffers(gl) {
    // const colorBuffer = initColorBuffer(gl);
    const positionBuffer = initPositionBuffer(gl);

    return {
        position: positionBuffer,
        // color: colorBuffer,
    }
}

function initPositionBuffer(gl) {
    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [...Array(1)].map(x => { 
        const theta1 = 2*Math.PI * Math.random();
        const theta2 = 2*Math.PI * Math.random();
        return [0, 0, Math.cos(theta1), Math.sin(theta1), Math.cos(theta1) + Math.cos(theta2), Math.sin(theta1) + Math.sin(theta2)]
    }).flat()

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positionBuffer;
}

// function initColorBuffer(gl) {
//     const colors = [...Array(32*4)].map(x => 1.0)

//     const colorBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

//     return colorBuffer;
// }

export { initBuffers }
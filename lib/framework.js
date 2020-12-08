"use strict";

class Mesh {
  constructor(name, vertices, indices, vao) {
    this.name = name;
    this.vertices = vertices;
    this.indices = indices;
    this.vao = vao;
  }

  // Getter
  get numElements() {
    return this.indices.length;
  }

  get drawMode() {
    return gl.TRIANGLES;
  }
}

class Mesh2DFromParams {
  constructor(name, colors, vertices, indices) {
    this.vertexPositions = vertices;
    this.vertexColors = colors;
    this.indices = indices;

    this.geometry = InitFromData(
      name, //name
      {
        positions: this.vertexPositions,
        colors: this.vertexColors,
      },
      this.indices
    );

    this.vao = this.geometry.vao;
  }

  // Getter
  get numElements() {
    return this.indices.length;
  }

  get drawMode() {
    //return gl.LINE_LOOP;
    return gl.LINE_STRIP;
  }
}

const drawCircle = (raza) => {
  let center = [0, 0, 0];
  let vertices = [];
  let indexes = [];
  let iterator = 0;
  for (; iterator <= 2 * Math.PI; iterator += 0.1) {
    vertices.push(raza * Math.cos(iterator) + center[0]);
    vertices.push(raza * Math.sin(iterator) + center[1]);
    vertices.push(center[2]);
  }

  for (iterator = 2; iterator < vertices.length; iterator++) {
    indexes.push(0);
    indexes.push(iterator - 1);
    indexes.push(iterator);
  }

  indexes.push(0);
  indexes.push(vertices.length - 1);
  indexes.push(1);

  return {
    vertices,
    indexes,
  };
};

class Mesh2DCircle {
  constructor(name, colors, radius) {
    const res = drawCircle(radius);
   // console.log(res);
    this.vertexPositions = res.vertices;
    this.vertexColors = colors;
    this.indices = res.indexes;

    this.geometry = InitFromData(
      name, //name
      {
        positions: this.vertexPositions,
        colors: this.vertexColors,
      },
      this.indices
    );

    this.vao = this.geometry.vao;
  }

  // Getter
  get numElements() {
    return this.indices.length;
  }

  get drawMode() {
    //return gl.LINE_LOOP;
    return gl.TRIANGLE_FAN;
  }
}

class Mesh2dShuriken extends Mesh2DFromParams {}

class Mesh2DArrow extends Mesh2DFromParams {}



class Mesh2D {
  constructor(name, color, left_bottom_corner = [0, 0], length = 2) {
    this.vertexPositions = [
      left_bottom_corner[0],
      left_bottom_corner[1],
      0,
      left_bottom_corner[0] + length,
      left_bottom_corner[1],
      0,
      left_bottom_corner[0] + length,
      left_bottom_corner[1] + length,
      0,
      left_bottom_corner[0],
      left_bottom_corner[1] + length,
      0,
    ];
    this.vertexColors = [
      color[0],
      color[1],
      color[2],
      color[0],
      color[1],
      color[2],
      color[0],
      color[1],
      color[2],
      color[0],
      color[1],
      color[2],
    ];
    this.indices = [0, 1, 2, 3, 4];

    this.geometry = InitFromData(
      name, //name
      {
        positions: this.vertexPositions,
        colors: this.vertexColors,
      },
      this.indices
    );

    this.vao = this.geometry.vao;
  }

  // Getter
  get numElements() {
    return this.indices.length;
  }

  get drawMode() {
    return gl.LINE_LOOP;
  }
}

function followMouse(canvas, event, playerX, playerY) {
  // let rect =  event.getBoundingClientReact();
  // let x = event.clientX - rect.left;
  // let y = event.clientY - rect.top;
  let x = event.screenX;
  let y = window.screen.availHeight - event.screenY ;

  if( x <= playerX) {
     angularStep = Math.sign(y-playerY)*Math.PI/2;
  } else {
    angularStep = Math.atan((y - playerY) / (x - playerX));
  }
  return {angularStep, x, y};
}

const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl2");

const vsGLSL = `#version 300 es
in vec4 position;
in vec3 color;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
uniform mat4 modelView;

out vec3 v_color;

void main() {
    gl_Position = projection * view * model * position;
    v_color = color;
}
`;

const fsGLSL = `#version 300 es
precision highp float;

in vec3 v_color;

out vec4 color;

void main() {
    color = vec4(v_color.rgb, 1);
}
`;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vsGLSL);
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  throw new Error(gl.getShaderInfoLog(vertexShader));
}

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fsGLSL);
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  throw new Error(gl.getShaderInfoLog(fragmentShader));
}

const prg = gl.createProgram();
gl.attachShader(prg, vertexShader);
gl.attachShader(prg, fragmentShader);
gl.linkProgram(prg);
if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
  throw new Error(gl.getProgramInfoLog(prg));
}

// NOTE! These are only here to unclutter the diagram.
// It is safe to detach and delete shaders once
// a program is linked though it is arguably not common.
// and I usually don't do it.
gl.detachShader(prg, vertexShader);
gl.deleteShader(vertexShader);
gl.detachShader(prg, fragmentShader);
gl.deleteShader(fragmentShader);

const positionLoc = gl.getAttribLocation(prg, "position");
const colorLoc = gl.getAttribLocation(prg, "color");
const normalLoc = gl.getAttribLocation(prg, "normal");
const texcoordLoc = gl.getAttribLocation(prg, "texcoord");

const projectionLoc = gl.getUniformLocation(prg, "projection");
const modelViewLoc = gl.getUniformLocation(prg, "modelView");
const modelLoc = gl.getUniformLocation(prg, "model");
const viewLoc = gl.getUniformLocation(prg, "view");
const diffuseLoc = gl.getUniformLocation(prg, "diffuse");
const decalLoc = gl.getUniformLocation(prg, "decal");
const diffuseMultLoc = gl.getUniformLocation(prg, "diffuseMult");
const lightDirLoc = gl.getUniformLocation(prg, "lightDir");

// above this line is initialization code
// --------------------------------------
// below is rendering code.

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.clearColor(0.5, 0.7, 1.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);

gl.useProgram(prg);

const projection = m4.perspective(
  (60 * Math.PI) / 180, // fov
  gl.canvas.clientWidth / gl.canvas.clientHeight, // aspect
  0.1, // near
  10 // far
);
gl.uniformMatrix4fv(projectionLoc, false, projection);

// draw center cube

let modelView = m4.identity();
modelView = m4.translate(modelView, 0, 0, -8);
//modelView = m4.xRotate(modelView, 0.5);
//modelView = m4.yRotate(modelView, 0.5);

gl.uniformMatrix4fv(viewLoc, false, modelView);

let model = m4.identity();

gl.uniformMatrix4fv(modelLoc, false, model);

//gl.uniformMatrix4fv(modelViewLoc, false, modelView);

gl.uniform4fv(diffuseMultLoc, [0.7, 1, 0.7, 1]);

// gl.drawElements(
//     gl.TRIANGLES,
//     36,                // num vertices to process
//     gl.UNSIGNED_SHORT, // type of indices
//     0,                 // offset on bytes to indices
// );

function InitFromData(name, vertices, indices) {
  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  //positions
  var vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(vertices.positions),
    gl.STATIC_DRAW
  );
  // set vertex position attribute
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);

  //colors
  var vbo1 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo1);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(vertices.colors),
    gl.STATIC_DRAW
  );
  // set vertex color attribute
  gl.enableVertexAttribArray(colorLoc);
  gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);

  var ibo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

  gl.bindVertexArray(null);

  return new Mesh(name, vertices, indices, vao);
}

function RenderMesh2D(mesh, mm) {
  gl.bindVertexArray(mesh.vao);
  let modelMatrix = [
    mm[0],
    mm[1],
    mm[2],
    0,
    mm[3],
    mm[4],
    mm[5],
    0,
    0,
    0,
    mm[8],
    0,
    mm[6],
    mm[7],
    0,
    1,
  ];
  gl.uniformMatrix4fv(modelLoc, false, modelMatrix);

  //render
  gl.drawElements(
    mesh.drawMode, // Primitive type
    mesh.numElements, // num vertices to process
    gl.UNSIGNED_SHORT, // type of indices
    0 // offset on bytes to indices
  );
}

const TransposeMat3 = function (mat) {
  return [
    mat[0],
    mat[3],
    mat[6],
    mat[1],
    mat[4],
    mat[7],
    mat[2],
    mat[5],
    mat[8],
  ];
};

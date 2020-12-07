//forme custom
let length = 3;
let left_bottom_corner = [1,0,0];
let vertices = [
          left_bottom_corner[0],left_bottom_corner[1],0,
          left_bottom_corner[0]+length,left_bottom_corner[1],0,
          left_bottom_corner[0]+length,left_bottom_corner[1]+length,0,
          left_bottom_corner[0],left_bottom_corner[1]+length,0
        ];
let indices = [0, 1, 2, 3, 4];
let color = [1,1,0];
let colors = [
      color[0],color[1],color[2],
      color[0],color[1],color[2],
      color[0],color[1],color[2],
      color[0],color[1],color[2]
    ];

let unit = 0.1;
let vertices_arrow = [
  0, unit, 0,
  0, -unit, 0,
  11 * unit, - unit, 0,
  11 * unit, unit, 0,
  (11+6) * unit,0 , 0,
  11 * unit, -3 * unit, 0,
  11 * unit, 1.5 * unit, 0
]

let indices_arrow = [1, 1, 2,
                     1, 2, 3,
                     4, 5, 6];

let shuriken_vertices = [
  0, 0, 0,
  -1, 1, 0,
  -1, 0, 0,

  -1, -1, 0,
  0, -1, 0,

  1, -1, 0,
  1, 0, 0,

  1, 1, 0,
  0, 1, 0
  ]

let shuriken_indices = [0, 1, 2, 0, 3, 4, 0, 5, 6, 0, 7, 8, 0]

let vertices_line_baloon = [
  0, 0, 0,
  -1, -0.5, 0,
  1, -1, 0,
  -1, -1.5, 0,
  1, -2, 0
]

let inidces_line_baloon = [0, 1, 2, 3, 4]

const newArrow = (x, y, angle) => {
  let arrow = {};
  arrow.x = x;
  arrow.y = y;
  arrow.angle = angle;
  arrow.getModelMatrix = () => {
    let modelMatrix = m3.identity();
    modelMatrix = m3.multiply(modelMatrix, Translate(arrow.x, arrow.y));
    modelMatrix = m3.multiply(modelMatrix, Rotate(arrow.angle));
    return modelMatrix;
  }
  arrow.update = (deltaTime) => {
    arrow.x+= Math.cos(arrow.angle) * deltaTime;
    arrow.y+=Math.sin(arrow.angle) * deltaTime;
  }
  return arrow;
}


let baloane = [];
let timeToSpawnABallon = 1;

const addBalloon = (vectorBaloane, xSpawnPos) => {
  let balon = {};
  let xScale = 0.8, yScale = 1;
  balon.xScale = xScale;
  balon.yScale = yScale;
  balon.x = xSpawnPos;
  balon.y = 0;
  balon.hasCollided = false;
  balon.getModelMatrix = (name) => {
    if(name === 'cerc'){
      let modelMatrix = m3.identity();
      modelMatrix = m3.multiply(modelMatrix,Translate(balon.x, balon.y));
      modelMatrix = m3.multiply(modelMatrix,Scale(balon.xScale, balon.yScale));
      return modelMatrix;  
    } else {
      let modelMatrix = m3.identity();
      modelMatrix = m3.multiply(modelMatrix,Translate(balon.x, balon.y - 0.3 ));
      modelMatrix = m3.multiply(modelMatrix,Scale(balon.xScale - 0.65, balon.yScale - 0.65));
      return modelMatrix;  
    }
    // console.log(modelMatrix)
  }
  balon.update = (deltaTimeSeconds) => {
    if(balon.hasCollided){
      if(balon.xScale <= 0) {
        balon.yScale = 0;  
      } else if (balon.xScale > 0) {   
         balon.xScale -= deltaTimeSeconds / 2;
         balon.yScale -= deltaTimeSeconds / 4;
      }
      balon.y -= deltaTimeSeconds * 2;
    } else {
      balon.y += deltaTimeSeconds;
    }
  }
  balon.isOutofScreen = () => {
    if(balon.y > 5 || balon.y < 0)
	    return true;
	  else
	    return false;
  }

  vectorBaloane.push(balon);
}

let shurikene = [];
let timeToSpawnAShuriken = 1;

const addShuriken = (vectorShurikene, ySpawnPos) => {
  let shuriken = {};
  let xScale = yScale = 0.3;
  let defaultAngle = 1;
  shuriken.xScale = xScale;
  shuriken.yScale = yScale;
  shuriken.x = 4;
  shuriken.y = ySpawnPos;
  shuriken.angle = defaultAngle; 
  shuriken.hasCollided = false;
  shuriken.getModelMatrix = () => {
    modelMaxtrix = m3.identity();
    modelMaxtrix = m3.multiply(modelMaxtrix,Translate(shuriken.x,shuriken.y));
    modelMaxtrix = m3.multiply(modelMaxtrix,Scale(shuriken.xScale, shuriken.yScale));
    modelMaxtrix = m3.multiply(modelMaxtrix,Rotate(shuriken.angle));
    return modelMaxtrix
  }
  shuriken.update = (deltaTimeSeconds) => {
    if (shuriken.hasCollided) {
      shuriken.xScale /= 2;
      shuriken.yScale /= 2;
    } else {
      shuriken.x -= deltaTimeSeconds;
      shuriken.angle += deltaTimeSeconds;
    }
  }
  shuriken.isOutofScreen = () => {
    if (shuriken.x > 10 || shuriken.y < 4) 
      return true;
    else 
      return false;
  }
  vectorShurikene.push(shuriken);
}

//arrow
let arrow = new Mesh2DArrow('arrow', [0,0,0], vertices_arrow, indices_arrow);

//baloons
let baloon = new Mesh2DCircle('cerc', [1, 0, 0], 0.5);
let line_baloon = new Mesh2DFromParams('line_baloon', [0, 0, 0], vertices_line_baloon, inidces_line_baloon);
let yellow_baloon = new Mesh2DCircle('yBaloon', [0, 0, 0], 0.7)

//shuriken
let shurikenSuprem = new Mesh2dShuriken('shurikenSuprem', [0, 0, 1], shuriken_vertices, shuriken_indices)

let modelMaxtrix = m3.identity();

const Translate = function(translateX, translateY)
{
  return TransposeMat3([
    1, 0, translateX,
    0, 1, translateY,
    0, 0, 1
  ])
}

const Scale = function(scaleX, scaleY)
{
  return TransposeMat3([
    scaleX, 0, 0,
    0, scaleY, 0,
    0, 0, 1
  ]);
}

const Rotate = function(radians)
{
  return TransposeMat3([
    Math.cos(radians), -Math.sin(radians), 0,
    Math.sin(radians), Math.cos(radians), 0,
    0, 0, 1
  ]);
}

//const geometry = new THREE.FontGeometry("Hello There", {font: font, size: 80})
var then = 0;

let arrow_x = -5;
let arrow_y = 0;

let angularStep = 0;
let mouse_x = 0;
let mouse_y = 0;

let vectorArrow = [];

var Update = function(now) {
  if(isNaN(now)) now=0
  now *= 0.001; 
  
  let deltaTime = now - then;
  then = now;
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  let canvasElem = document.querySelector("canvas"); 
  
  canvasElem.addEventListener("mousemove", function(event) 
  {
    var result = followMouse(canvasElem, event, arrow_x, arrow_y);
    angularStep =result.angularStep;
    mouse_x = result.x;
    mouse_y = result.y;
    
  });
     
  //console.log("angularStep " +angularStep + " coordx " + mouse_x + " coordy "  + mouse_y);
  
  modelMaxtrix = m3.identity();
  modelMaxtrix = m3.multiply(modelMaxtrix,Translate(arrow_x, arrow_y));
  modelMaxtrix = m3.multiply(modelMaxtrix, Rotate(angularStep))
  RenderMesh2D(arrow,modelMaxtrix);

  canvas.onmouseup = function (ev){
   let currentAngle = angularStep;
   let nArrow = newArrow(arrow_x, arrow_y, currentAngle);
   vectorArrow.push(nArrow);
   console.log(vectorArrow);
  }

  vectorArrow.forEach(arrow => {
    arrow.update(deltaTime);
  });
  vectorArrow.forEach(sageata => {
    RenderMesh2D(arrow, sageata.getModelMatrix()); 
  });
  //console.log(vectorArrow);
  

  //balon    
    timeToSpawnABallon -= deltaTime * 1.5;
    if(timeToSpawnABallon < 0) {
      let min = 1;
      let max = 10;
      addBalloon(baloane, Math.floor(Math.random() * (max - min + 1) + min));
      timeToSpawnABallon = 1;
    }
    
    baloane.forEach(balon => {
      balon.update(deltaTime);
    });
    
    baloane.forEach(balon => {
      RenderMesh2D(baloon, balon.getModelMatrix('cerc'));
      RenderMesh2D(line_baloon, balon.getModelMatrix('linie'));
    });
	
  baloane = baloane.filter(balon => !balon.isOutofScreen());

  //shuriken
  timeToSpawnAShuriken -= deltaTime / 3;
  if (timeToSpawnAShuriken < 0) {
    let min = -3;
    let max = 4;
    addShuriken(shurikene, Math.floor(Math.random() * (max - min + 1) + min));
    timeToSpawnAShuriken = 1;
  }
  shurikene.forEach(sh => {
    sh.update(deltaTime);
  });

  shurikene.forEach(shuriken => {
    RenderMesh2D(shurikenSuprem, shuriken.getModelMatrix());
  });

 // shurikene = shurikene.filter(shuriken => !shuriken.isOutofScreen);

  requestAnimationFrame(Update);
}

function onInputUpdate(event) {

    if (event.key == 'w') {
        arrow_y +=0.1;
    }

    if (event.key == 's') {
        arrow_y -=0.1;
    }

}
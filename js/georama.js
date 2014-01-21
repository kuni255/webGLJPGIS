// definition of global variables
var renderer, scene, rndrFrame, camera, controls, axis, terrain, surfColor;
var directionalLight, gmlContent,terrrain, textureImgFile;
var readyProc = new Array(2);
var texureImgFile, textureImgFileOnFs, textureImgData;

window.addEventListener("load", function(){
  $("#applyButton").attr('disabled', true);
  $("#gmlFile").on('change', handleFileSelect);
  $("#inpColor").on('change', handleColorChg);
  //$("#imgFile").on('change', handleImgFileSelect);
  $("#applyButton").on('click', applyChgForGeo);
  threeStart();
});


function threeStart(){
  initThree();
  initCamera();
  mkAxis();
  initLight();
  loop();
}


/////////////////////////////////////
// Initialization of three.js      //
/////////////////////////////////////
function initThree(){
  rndrFrame = document.getElementById('rndrFrame');
  rndr = new THREE.WebGLRenderer();
  if (!rndr) alert('Failed initialization of renderer!!');
  
  rndr.setSize(rndrFrame.clientWidth, rndrFrame.clientHeight);
  rndrFrame.appendChild(rndr.domElement);
  rndr.setClearColor(0x000000, 1.0);
  scene = new THREE.Scene();
}

function mkAxis(){
  axis = new THREE.AxisHelper(50);
  scene.add(axis);
  axis.position.set(0, 0, 0);
}

/////////////////////////////////////
// Initialization of camera        //
/////////////////////////////////////
function initCamera(){
  camera = new THREE.PerspectiveCamera(45,
          rndrFrame.clientWidth/rndrFrame.clientHeight, 1, 10000);
  camera.position.set(50, 0, 50);
  camera.up.set(0, 0, 1);
  camera.lookAt({x: 50, y: 0, z: 0});
  
  controls = new THREE.TrackballControls(camera);
}

function initLight(){
  directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.0);
  directionalLight.position.set(50,50, 100);
  scene.add(directionalLight);
}

function loop(){
  controls.update();
  rndr.render(scene, camera);
  requestAnimationFrame(loop);
}

function onceDraw(){
 rndr.clear();
 rndr.render(scene, camera);
}

////////////////////////////////////////////////////////
/////////////// Processing GML file ////////////////////
////////////////////////////////////////////////////////
function handleFileSelect(evt){
  var gmlFile = evt.target.files[0];
  var gmlReader = new FileReader();
  gmlReader.readAsText(gmlFile, 'shift_JIS');
  gmlReader.onload = gmlFileLoaded;
}

function gmlFileLoaded(evt){
  gmlContent = event.target.result;
  updateSurfColor();
  $("#applyButton").attr('disabled', false);
}

function handleImgFileSelect(evt){
  textureImgFile = evt.target.files[0];
  var imgFileReader = new FileReader();
  imgFileReader.readAsBinaryString(textureImgFile);
  imgFileReader.onload = imgFileLoaded;
}

function handleColorChg(evt){
  updateSurfColor();
  $("#applyButton").attr('disabled', false);
}

function updateSurfColor(){
  surfColor = $("#inpColor").val();
  surfColor = surfColor.replace("#","0x");
  surfColor = Number(surfColor);
}

function imgFileLoaded(evt){
  var ret;
  textureImgData = evt.target.result;
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
  if(!window.requestFileSystem) alert('This browser does not support fileSystem!!');
  window.requestFileSystem(window.TEMPORARY, 1024*1024, initFs, errHandler);
  //window.requestFileSystem(window.PERSISTENT, 1024*1024, initFs, errHandler);
  readyProc[1] = 1;
  inputCompChk();
}

function initFs(fs){
  textureImgFileOnFs = 'tmp2.png';
  console.log(fs);
  fs.root.getFile(textureImgFileOnFs, {create: true}, function(fileEnt){
    fileEnt.createWriter( function(fileWriter){
      fileWriter.onwriteend = function(e){
        console.log('Write successed');
      }
      
      fileWriter.onerror = function(e){
        console.log('Write failed ', e.toString());
      }
    
      var blob = new Blob([textureImgData], {type: "image/png"});
      fileWriter.write(blob);
    }, errHandler)
  }, errHandler);
}

function inputCompChk(){
  var i;
  for(i=0;i<readyProc.length;i++) if(!readyProc[i]) return;
  $("#applyButton").attr('disabled', false);
}

function applyChgForGeo(){
  var prevTerrain;

  var gmlDEM = new GMLDEM(gmlContent, 5.0);
  gmlDEM.setNaValue(0.0);
  gmlDEM.setGrdPoints(0.0);
  if(terrain) scene.remove(terrain.getTerrain());
  terrain = new terrainSurf(gmlDEM, surfColor);
  terrain.chgScale(1.0, 1.0, 1.0);
  
  
  //terrain.setTexture("./texture/test.png");
  //terrain.setTexture(textureImgFileOnFs);
  
  scene.add(terrain.getTerrain());
  
  $("#applyButton").attr('disabled', true);
}

function errHandler(e){
  console.log('errHandler is called!!', e.message);
}

function terrainSurf(DEM, color){
  this.geometry =  new THREE.Geometry();
  this.material =  new THREE.MeshLambertMaterial({color: color});
  this.setDEM(DEM);
  this.mkGeometry();
  this.mkTerrain();
}

terrainSurf.prototype.geometry;
terrainSurf.prototype.material;
terrainSurf.prototype.terrain;
terrainSurf.prototype.DEM;
terrainSurf.prototype.texture;

terrainSurf.prototype.mkGeometry = function(){
  var x,y,z;
  var idx;
  var i,j;
  var maxGrdIdx, grdPoints, meshSize;
  
  maxGrdIdx = this.DEM.getMaxGrdIdx()
  grdPoints = this.DEM.grdPoints;
  meshSize  = this.DEM.getMeshSize();
  
  idx=0;
  for(i=0;i<=maxGrdIdx[0];i++){
    for(j=maxGrdIdx[1];j>=0;j--){
      y = grdPoints[i][j][0];
      x = (maxGrdIdx[1]*meshSize) - grdPoints[i][j][1];
      z = grdPoints[i][j][2];
      this.geometry.vertices[idx] = new THREE.Vector3(x,y,z) ;
      if(idx<=2){
         //console.log('i= ', i, 'j= ', j, 'idx= ',  idx);
         //console.log(this.geometry.vertices[idx]);
      }
      idx++;
    }
  }
  
  
  idx=0;
  for(i=0;i<maxGrdIdx[0];i++){
    for(j=0;j<maxGrdIdx[1];j++){
      // cell's each grid point index
      NWIdx = j + i*(maxGrdIdx[1] + 1);
      NEIdx = NWIdx + (maxGrdIdx[1] + 1);
      SWIdx = NWIdx + 1;
      SEIdx = NEIdx + 1;
      // uv
      NWuv = new THREE.Vector2( i/maxGrdIdx[0], (maxGrdIdx[1]-j) / maxGrdIdx[1] );
      NEuv = new THREE.Vector2((i+1)/maxGrdIdx[0], (maxGrdIdx[1]-j) / maxGrdIdx[1]);
      SWuv = new THREE.Vector2(i/maxGrdIdx[0], (maxGrdIdx[1]-(j+1)) / maxGrdIdx[1]);
      SEuv = new THREE.Vector2((i+1)/maxGrdIdx[0], (maxGrdIdx[1]-(j+1)) / maxGrdIdx[1]);
      
      // NE triangle
      this.geometry.faces[idx] =  new THREE.Face3(NWIdx, SEIdx, NEIdx);
      // uv
      this.geometry.faceVertexUvs[0].push( [NWuv, SEuv, NEuv] );
      if(i<=0 && j<=2){
        //console.log(this.geometry.faces[idx]);
        //console.log(this.geometry.vertices[NWIdx]);
        //if(j==0) console.log(NWuv, SEuv, NEuv)
      }
      idx++;
      // SW triangle
      this.geometry.faces[idx] =  new THREE.Face3(NWIdx, SWIdx, SEIdx);
      // uv
      this.geometry.faceVertexUvs[0].push( [NWuv, SWuv, SEuv] );
      idx++;
    }
  }
  
  this.geometry.computeFaceNormals();
  this.geometry.computeCentroids();
  
}
terrainSurf.prototype.setDEM = function(DEM){ this.DEM = DEM;}
terrainSurf.prototype.getDEM = function(){ return this.DEM; }

terrainSurf.prototype.mkTerrain = function(){
  this.terrain = new THREE.Mesh(this.geometry, this.material);
}
terrainSurf.prototype.getTerrain = function(){ return this.terrain; }

terrainSurf.prototype.setTexture = function(textureImgFile){
  this.texture = THREE.ImageUtils.loadTexture(textureImgFile);
  this.material.map = this.texture;
}

terrainSurf.prototype.chgScale = function(scX, scY, scZ){
  this.terrain.scale = new THREE.Vector3(scX, scY, scZ);
}
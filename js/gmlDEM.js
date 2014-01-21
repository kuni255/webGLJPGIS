function GMLDEM(gmlContentsStr, meshSize){
  var grdIdx;
  
  this.gmlContentsStr = gmlContentsStr;
  this.setMaxGrdIdx();
  this.setAxisLabels();
  this.setMeshSize(meshSize);
}

GMLDEM.prototype.naValue = -9999;
GMLDEM.prototype.meshSize = 1;
GMLDEM.prototype.maxGrdIdx = new Array();
GMLDEM.prototype.axisLabels = new Array();
GMLDEM.prototype.grdPoints = new Array();
GMLDEM.prototype.seqRule = new Array();

GMLDEM.prototype.setMeshSize = function(meshSize){ this.meshSize = meshSize;}
GMLDEM.prototype.getMeshSize = function(){ return Number(this.meshSize);}

GMLDEM.prototype.setSeqRule = function(){
  var tmp;
  tmp = $(this.gmlContentsStr).find('gml\\:sequenceRule').attr('order');
  this.seqRule[0] = tmp.substr(0,2);
  this.seqRule[1] = tmp.substr(2,2);
}
GMLDEM.prototype.getSeqRule = function(){ return this.seqRule; }
GMLDEM.prototype.setNaValue = function(naValue){ this.naValue = naValue;}
GMLDEM.prototype.getNaValue = function(){ return this.naValue ;}
GMLDEM.prototype.setMaxGrdIdx = function(){
  this.maxGrdIdx = $(this.gmlContentsStr).find('gml\\:high').text().split(' ');
  this.maxGrdIdx[0] = Number(this.maxGrdIdx[0]);
  this.maxGrdIdx[1] = Number(this.maxGrdIdx[1])
}
GMLDEM.prototype.getMaxGrdIdx = function(){ return this.maxGrdIdx ; }

GMLDEM.prototype.setAxisLabels = function(){
  this.axisLabels = $(this.gmlContentsStr).find('gml\\:axisLabels').text().split(' ');
}
GMLDEM.prototype.getAxisLabels = function(){ return this.axisLabels;}

GMLDEM.prototype.setGrdPoints = function(){
  var elev, curElev, line, meshSize;
  var curIdx,i,j,len,tmp;
  var x, y, maxGrxIdx;
  
  elev = new Array();
  line = $(this.gmlContentsStr).find('gml\\:tupleList').text().split('\n');
  naValue = this.getNaValue();
  maxGrdIdx = this.getMaxGrdIdx();
  meshSize = this.getMeshSize();
  
  curIdx=0;
  for(i=0;i<line.length-1;i++){
      tmp = line[i].split(",");
      if(tmp.length == 2){
         elev[curIdx] = tmp;
         if(elev[curIdx][0] == "データなし"){ elev[curIdx][1] = naValue; }
         curIdx++;
      }
  }
  curIdx--;
  while(((maxGrdIdx[0]+1)*(maxGrdIdx[1]+1)-1) > curIdx){
    curIdx++;
    elev[curIdx] = ["データなし",naValue];
  }
 
  for(i=0;i<=maxGrdIdx[0];i++){
    x = meshSize*i;
    this.grdPoints[i] = new Array();
    for(j=maxGrdIdx[1]; j>=0;j--){
      y = meshSize*j;
      curIdx = i + (maxGrdIdx[0]+1) * (maxGrdIdx[1]-j);
      curElev = elev[curIdx][1];
      this.grdPoints[i][j] = [x,y,curElev];
      //if(i<=1 && j>=(maxGrdIdx[1]-2)) console.log( 'DEM', this.grdPoints[i][j]);
    }
  }
}

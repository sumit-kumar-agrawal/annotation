
let imageUserDataModel = require('./scripts/model/ImageUserDataModel');
let metaInfoModel = require('./scripts/model/MetaInfoModel');
let objImgDataUtils = new imageUserDataModel();
let objMetaInfo = new metaInfoModel();

//console.log(objImgDataUtils.writeImageMeta(objMetaInfo.imgWholeMetaInfo()));

console.log(objImgDataUtils.getMetaFileData('01092017034646'));
var user_data = function(){
	
	//this.prob = objUserDataUtils.getUserDataProp();		
}


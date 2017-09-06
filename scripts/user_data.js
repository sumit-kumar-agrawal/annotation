
let imageUserDataModel = require('./scripts/model/ImageUserDataModel');
let metaInfoModel = require('./scripts/model/MetaInfoModel');
let objImgDataUtils = new imageUserDataModel();
let objMetaInfo = new metaInfoModel();


/*** For Write Operation 
 * First need to call objMetaInfo.getWriteMetaInfo(), so we can get neccessary attributes for write
 * Second call - objImgDataUtils.writeImageMeta(write_meta_info) for writing data
 * TODO : For compare and dimensin and upload data history - method is ready but might need to modify during actual implementation
 * Note: This only write the meta information, copy file w.r.t asset folder mechanish will be in placed of annotation file
*/


// let write_meta_info = objMetaInfo.getWriteMetaInfo();
// write_meta_info.name = "IMG-"+ objImgDataUtils.curr_date_with_time;
// write_meta_info.description = "sumit testing UTC"
// write_meta_info.type = "image"
// write_meta_info.extension = objImgDataUtils.getImageExtention();
// console.log(objImgDataUtils.writeImageMeta(write_meta_info));


/*** For Update Operation
 * General updation will be perform on state, name, and desc. Need to write compare image data logic for modify
 ********/
/*
let update_img_meta_infor = objMetaInfo.updateMetaInfo({state: '4',name: 'Move to Step 4 ', description: 'Need to test update for update'});
console.log(objImgDataUtils.updateImageMeta('02092017203221',update_img_meta_infor));
*/

/*****For Read Operartion****/
//console.log(objImgDataUtils.readImageMetaFileFromID('02092017203221'));

/********For Delete Data********** */
//console.log(objImgDataUtils.deleteImageMeta('04092017103913'));

/***For all images record for histroy*
 * Format of data return {status:"success", message: "", data: all_meta_files_data}
 */
//console.log(objImgDataUtils.getUserDataImageRecords());

// For Copy Image from Temp to Destination
/*
objImgDataUtils.createUserDataFolder(); // will create user data folder if not exist
objImgDataUtils.createCurrentDateFolder();
objImgDataUtils.createImageAssetFolder();
console.log(objImgDataUtils.copyImgAsset({dest_path: objImgDataUtils.getImageAssetPath(objImgDataUtils.curr), name:"IMG-" + objImgDataUtils.curr_date_with_time}));
*/

var user_data = function(){
	//this.prob = objUserDataUtils.getUserDataProp();		
}
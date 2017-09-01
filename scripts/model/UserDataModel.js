let osUtils = require('./../utils/OSUtils');
let dateUtils = require('../utils/DateUtils');

const objOSUtil = new osUtils();
const objDateUtils = new dateUtils();

class UserDataModel{

	constructor($dir_name = 'user_data', $curr_date = objDateUtils.ddmmyyyy(), $curr_time = objDateUtils.hhmmss()){
		this.fs = require('fs');
		this.delimiter =  objOSUtil.delimiter();
		this.user_data_dir_name = $dir_name;
		this.curr_date = $curr_date;
		this.curr_date_with_time = $curr_date + $curr_time;
		this.asset_file_ext = '.meta'
	}

	getUserDataDirName(){
		return this.user_data_dir_name;
	}

	
	createUserDataFolder(){
		let path = "." + this.delimiter + this.user_data_dir_name;
		if(!this.isFolderExist(path)){
			this.fs.mkdirSync(path);
			return path;
		}else{
			return false;
		}
		
	}

	isFolderExist($path){
		return (this.fs.existsSync($path)) ? true : false ;
	}

	isFileExist($path){
		return (this.fs.existsSync($path)) ? true : false ;
	}

	createCurrentDateFolder($date = this.curr_date){
		let path = this.getDateFolderPath($date);
		if(!this.isFolderExist(path)){
			this.fs.mkdirSync(path);
			return path;
		}else{
			return false;
		}
	}

	getDateFolderPath($date = this.curr_date){
		return "." + this.delimiter + this.user_data_dir_name + this.delimiter + $date;
	}

	createAssetFolder($asset_type, $folder_date = this.curr_date){
		let path = this.getAssetFolderPath($asset_type, $folder_date);
		if(!this.isFolderExist(path)){
			this.fs.mkdirSync(path);
			return path;
		}else{
			return false;
		}
	}

	getAssetFolderPath($asset_type, $folder_date = this.curr_date){
		return  this.getDateFolderPath($folder_date) +  this.delimiter + $asset_type;
	}

	createAssetMetaFile($asset_type, $ext = this.asset_file_ext, $folder_date = this.curr_date, $date_and_time = this.curr_date_with_time,$mode="w"){
		let path = this.getAssetMetaFilePath($asset_type,$ext, $folder_date, $date_and_time);
		if(!this.isFileExist(path)){
			this.fs.openSync(path,'w+');
			return path;
		}else{
			return false;
		}
	}

	getAssetMetaFilePath($asset_type, $prefix, $folder_date = this.curr_date, $date_and_time = this.curr_date_with_time, $ext = this.asset_file_ext){
		return this.getAssetFolderPath($asset_type,$folder_date) +  this.delimiter + $prefix + $date_and_time + $ext;
	}

}
module.exports = UserDataModel;
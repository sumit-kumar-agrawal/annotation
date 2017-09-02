const osUtils = require('./../utils/OSUtils');
const dateUtils = require('../utils/DateUtils');
const emptyDir = require('empty-dir');

const objOSUtil = new osUtils();
const objDateUtils = new dateUtils();

class UserDataModel{

	constructor(dir_name = 'user_data', curr_date = objDateUtils.ddmmyyyy(), curr_time = objDateUtils.hhmmss()){
		this.fs = require('fs');
		this.delimiter =  objOSUtil.delimiter();
		this.user_data_dir_name = dir_name;
		this.curr_date = curr_date;
		this.curr_date_with_time = curr_date + curr_time;
		this.curr_date_and_time =  objDateUtils.yyyy_mm_dd_hh_mm_ss();
		this.curr_date_with_utc = objDateUtils.date_utc();
		this.asset_file_ext = '.meta'
	}

	getUserDataDirName(){
		return this.user_data_dir_name;
	}

	getUserDataDirPath(){
		return "." + this.delimiter + this.	getUserDataDirName();
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

	isFolderExist(path){
		return (this.fs.existsSync(path)) ? true : false ;
	}

	isFileExist(path){
		return (this.fs.existsSync(path)) ? true : false ;
	}

	createCurrentDateFolder(date = this.curr_date){
		let path = this.getDateFolderPath(date);
		if(!this.isFolderExist(path)){
			this.fs.mkdirSync(path);
			return path;
		}else{
			return false;
		}
	}

	getDateFolderPath(date = this.curr_date){
		return "." + this.delimiter + this.user_data_dir_name + this.delimiter + date;
	}

	createAssetFolder(asset_type, folder_date = this.curr_date){
		let path = this.getAssetFolderPath(asset_type, folder_date);
		if(!this.isFolderExist(path)){
			this.fs.mkdirSync(path);
			return path;
		}else{
			return false;
		}
	}

	getAssetFolderPath(asset_type, folder_date = this.curr_date){
		return  this.getDateFolderPath(folder_date) +  this.delimiter + asset_type;
	}

	createAssetMetaFile(asset_type, ext = this.asset_file_ext, folder_date = this.curr_date, date_and_time = this.curr_date_with_time,mode="w+"){
		let path = this.getAssetMetaFilePath(asset_type,ext, folder_date, date_and_time);
		if(!this.isFileExist(path)){
			try{
				this.fs.openSync(path,mode);
				return path;
			}catch(err){
				console.log(err);
			}	return false;
			
		}else{
			return false;
		}
	}

	getAssetMetaFilePath(asset_type, prefix, folder_date = this.curr_date, date_and_time = this.curr_date_with_time, ext = this.asset_file_ext){
		return this.getAssetFolderPath(asset_type,folder_date) +  this.delimiter + prefix + date_and_time + ext;
	}

	getMetaFilePathFromMetaId(meta_id, asset_type, prefix, ext = this.asset_file_ext){
		let folder_date = meta_id.substring(0, 8);
		let file_date_with_time = meta_id;
		let file_path = this.getAssetMetaFilePath(asset_type,prefix,folder_date,file_date_with_time);
        return file_path;
	}

	readAssetMetaData(file_path){
		let currnt_file_data;
		try {
			let file_data = this.fs.readFileSync(file_path);
			currnt_file_data = {message:"", error: false, data: JSON.parse(file_data)};
		}catch(err){
			currnt_file_data =  {message: err, error: true, data:{}};
		}
		return currnt_file_data;
	}

	getUserDataRecords(asset_type, asset_file_prefix){
		let all_meta_files_data = [];
		try{
			if(this.isFolderExist(this.getUserDataDirPath()) && !emptyDir.sync(this.getUserDataDirPath())){
				let all_date_folders = this.fs.readdirSync(this.getUserDataDirPath());
				all_date_folders.forEach((date_folder) => {
					let asset_date_path = this.getAssetFolderPath(asset_type, date_folder);
					if(this.isFolderExist(asset_date_path) && !emptyDir.sync(asset_date_path)){
						let all_asset_files = this.fs.readdirSync(asset_date_path);
						all_asset_files.forEach((asset_file) => {
							if(asset_file.includes(this.asset_file_ext)) {
								let meta_id = asset_file.split('-')[1].split(".")[0];
								let meta_file_path = this.getMetaFilePathFromMetaId(meta_id, asset_type, asset_file_prefix);
								if(this.isFileExist(meta_file_path)){
									let meta_content = this.readAssetMetaData(meta_file_path);
									if(!meta_content.error){
										/***
										 * As of now whole meta file data is returing, you can pass your set of data
										*/
										all_meta_files_data.push(meta_content.data);
									}
								}	    
							}
						});
					}	
				});
			}	
			return {status:"success", message: "", data: all_meta_files_data};
		}catch(error){
			return {status:"error", message: error};
		}
	}

}
module.exports = UserDataModel;
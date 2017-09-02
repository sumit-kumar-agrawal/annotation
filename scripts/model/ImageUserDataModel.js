const UserDataModel = require('./UserDataModel');
const metaInfo = require('./MetaInfoModel');
var objMetaInfo;

class ImageUserDataModel extends UserDataModel{
    
    constructor(dir_name = "user_data", user = 'Guest'){
        super(dir_name);
        this.asset_folder_type = 'images';
        this.asset_file_prefix = 'IMG-';
        this.comp_asset_file_prefix = 'COMP-';
        this.user = user;
        objMetaInfo = new metaInfo(this.curr_date_with_time,this.curr_date_and_time, this.curr_date_with_utc, this.user);
    }

    /**** 
     * Use: Return extension of the asset default is png
    */
    getImageExtention(ext = 'png'){
        let extension;
        switch (ext) {
            case 'png':
                extension = 'png';
            break;
            case 'jpeg':
                extension = 'jpeg';
            break;
        }
        return extension;
    }

    /**** 
     * Use: To get whole meta info of Image
    */
    getWholeImgeMeta(){
        return objMetaInfo.imgWholeMetaInfo();
    }

    /**** 
     * Use: Get Image asset path
     * return : ./user_data/02092017/images
    */

    getImageAssetPath(curr_date = this.curr_date){
        return this.getAssetFolderPath(this.asset_folder_type, curr_date)
    }

    /**** 
     * Use: Get Complete Image Asset Path
     * return : ./user_data/02092017/images/IMG-02092017232323.meta
    */

    getImageAssetFilePath(curr_date = this.curr_date, curr_date_with_time = this.curr_date_with_time){
        return this.getAssetMetaFilePath(this.asset_folder_type, this.asset_file_prefix, curr_date, curr_date_with_time);
    }

    /**** 
     * Use: Get Complete Image Asset Path From MetaID
     * return : ./user_data/02092017/images/IMG-02092017232323.meta
    */

    getImgMetaPathFromMetaID(meta_id){
        return this.getMetaFilePathFromMetaId(meta_id, this.asset_folder_type, this.asset_file_prefix);
    }

    /**** 
     * Use: Will Create Image Asset folder
     * Format : ./user_data/02092017/images
    */

    createImageAssetFolder(){
        this.createAssetFolder(this.asset_folder_type);
    }

    /**** 
     * Use: Will Create Image Asset File
     * Format : ./user_data/02092017/images/IMG-02092017232323.meta
    */

    createImageMetaFile(){
        return this.createAssetMetaFile(this.asset_folder_type, this.asset_file_prefix);
    }

    /**** 
     * Use: Read File Data Through File Path
     * Format : Success : {message:"", error: false, data: JSON.parse(file_data)}; 
     * Error: {message:error, error: true, data: {}};
     * 
    */

    readImageMetaFileData(file_path){
        return this.readAssetMetaData(file_path);
    }

    /**** 
     * Use: Read File Data Through Meta ID
     * Format : Success : {message:"", error: false, data: JSON.parse(file_data)}; 
     * Error: {message:error, error: true, data: {}};
     * 
    */

    readImageMetaFileFromID(meta_id){
        let file_path = this.getImgMetaPathFromMetaID(meta_id);
        return this.readImageMetaFileData(file_path);
    }

   
    /** 
     * This method will check user data foloder existence if not then create
     * Will check current data folder exist? if not then create
     * Will create and write meta file of the image
    */
    writeImageMeta(img_data = {}){
        // TODO : Need to move this part into promise methology
        this.createUserDataFolder(); // will create user data folder if not exist
        this.createCurrentDateFolder();
        this.createImageAssetFolder();
        let img_meta_file = this.createImageMetaFile();
        
        //write data mechanism in file
        let curr_date = this.curr_date;
        let curr_date_time = this.curr_date_with_time;
        let meta_file_id = this.asset_file_prefix + curr_date_time;
        
        let arg_obj = {
            common_meta_data: img_data, 
            asset_file_prefix: this.asset_file_prefix, 
            path: this.getImageAssetPath(curr_date) + this.delimiter + img_data.name + '.' + this.getImageExtention(),
        };

        let image_data = objMetaInfo.writeMetaInfo(arg_obj)
        image_data = Object.assign(image_data, objMetaInfo.imageWidtHeightInfo(arg_obj), objMetaInfo.compareImgMetaInfo(arg_obj),objMetaInfo.uploadMetaInfo(arg_obj));
        
        let currnt_file_data;
        if(!objMetaInfo.isEmpty(image_data)){
            try {
                this.fs.writeFileSync(img_meta_file,JSON.stringify(image_data));
                currnt_file_data = this.readImageMetaFileData(img_meta_file);
            }catch(err){
                currnt_file_data =  {message: err, error: true, data:{}};
            }    
        
        }else{
            currnt_file_data = image_data;
        }
        return currnt_file_data;
    }

    /** 
     * This method will update Image Asset Meta
    */
    updateImageMeta(meta_id,img_update_data){
        let currnt_file_data = this.readImageMetaFileFromID(meta_id).data;
        let date_user_info = objMetaInfo.dateModifyMetaInfo();
        currnt_file_data = Object.assign(currnt_file_data,date_user_info);

        if(!objMetaInfo.isEmpty(currnt_file_data)){
            currnt_file_data.state = (img_update_data.state == undefined) ? "" : img_update_data.state;
            currnt_file_data.name = (img_update_data.name == undefined) ? "" : img_update_data.name;
            currnt_file_data.description = (img_update_data.description == undefined) ? "" : img_update_data.description;
        }

        try {
            let file_path = this.getImgMetaPathFromMetaID(meta_id);
            this.fs.writeFileSync(file_path,JSON.stringify(currnt_file_data));
            currnt_file_data = this.readImageMetaFileData(file_path);

        }catch(err){
            currnt_file_data =  {message: err, error: true, data: currnt_file_data};
        }    
        return currnt_file_data; 
    }

    /** 
     * This method will delete Image Asset Meta
     * TODO : Need to check if last file is being deleted then folder also be deleted
    */    
    deleteImageMeta(meta_id){
        let path = this.getImgMetaPathFromMetaID(meta_id);
        try{
            this.fs.unlinkSync(path);
            return {status: 'success', message: ""};
        }catch(error){
            return {status: 'error', message:error};
        }
        
    }

    getUserDataImageRecords(){
       return this.getUserDataRecords(this.asset_folder_type, this.asset_file_prefix)
    }

}
module.exports = ImageUserDataModel;
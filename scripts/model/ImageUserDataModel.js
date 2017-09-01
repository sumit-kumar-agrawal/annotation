let UserDataModel = require('./UserDataModel');
let metaInfo = require('./MetaInfoModel');
var objMetaInfo;

class ImageUserDataModel extends UserDataModel{
    
    constructor($dir_name = "user_data", $user = 'Guest'){
        super($dir_name);
        this.asset_folder_name = 'images';
        this.asset_file_prefix = 'IMG-';
        this.comp_asset_file_prefix = 'COMP-';
        this.user = $user;
        objMetaInfo = new metaInfo();
    }

    getWholeImgeMeta(){
        return objMetaInfo.imgWholeMetaInfo();
    }

    getImageAssetPath($curr_data = this.curr_date){
        return getAssetFolderPath(this.asset_folder_name, $curr_date)
    }

    getImageAssetFilePath($curr_date = this.curr_date, $curr_date_with_time = this.curr_date_with_time){
        return this.getAssetMetaFilePath(this.asset_folder_name, this.asset_file_prefix, $curr_date, $curr_date_with_time);
    }

    createImageAssetFolder(){
        this.createAssetFolder(this.asset_folder_name);
    }

    createImageMetaFile(){
        return this.createAssetMetaFile(this.asset_folder_name, this.asset_file_prefix);
    }
    /** 
     * This method will check user data foloder existence if not then create
     * Will check current data folder exist? if not then create
     * Will create and write meta file of the image
    */
    writeImageMeta($img_data = {}){
        // TODO : Need to move this part into promise methology
        this.createUserDataFolder(); // will create user data folder if not exist
        this.createCurrentDateFolder();
        this.createImageAssetFolder();
        let img_meta_file = this.createImageMetaFile();

        //write data mechanism in file
        let curr_date = this.curr_date;
        let curr_date_time = this.curr_date_with_time;
        let meta_file_id = this.asset_file_prefix + curr_date_time;

        let arg_obj = {img_data: $img_data, 
            asset_file_prefix: this.asset_file_prefix, 
            curr_date_time: this.curr_date_with_time, 
            created_at: curr_date, 
            user: this.user, 
            type: 'image',
            extension: 'png'
        };

        let image_data = objMetaInfo.getCommonMetaForWrite(arg_obj)
        
        if(!objMetaInfo.isEmpty(image_data)){
            //write data into file
            this.fs.writeFileSync(img_meta_file,JSON.stringify(image_data))
        }

        try {
            let currnt_file_data = this.fs.readFileSync(img_meta_file);
            return JSON.parse(currnt_file_data);
        } catch(err){
            return {message: err, error: true};
        }    
        
        //
    }

    writeWidthHeightImgMeta($meta_id, $arg_width_height_img = {}){
        //write compate data info in file
        if(!objMetaInfo.isEmpty($arg_width_height_img)){
            //write upload data info in file
            console.log("ssssssssss")
        }    
    }

    writeCompareImgMeta($meta_id, $arg_comp_img = {}){
        //write compate data info in file
        if(!objMetaInfo.isEmpty($arg_comp_img)){
            //write upload data info in file
            console.log("ssssssssss")
        }    
    }

    writeUploadImgMeta($meta_id, $arg_upload_meta = {}){
        if(!objMetaInfo.isEmpty($arg_upload_meta)){
            //write upload data info in file
            console.log("ssssssssss")
        }    
    }

    updateImageMeta($filename){

    }

    getMetaFileData($meta_id){
        //value.substring(0, index)
        let folder_date = $meta_id.substring(0, 8);
        let file_date_with_time = $meta_id;
        let file_path = this.getImageAssetFilePath(folder_date,file_date_with_time);
        try {
            let currnt_file_data = this.fs.readFileSync(file_path);
            return JSON.parse(currnt_file_data);
        } catch(err){

            return {message: err, error: true};
        }
    }

    
}
module.exports = ImageUserDataModel;
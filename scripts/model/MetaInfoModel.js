class MetaInfo{
    constructor(){

    }

    isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    commonMetaInfo(){
        let common_prop = {
            id: "",
            name: "",
            description: "",
            type: "",
            size: "",
            state: "",
            extension: "",
            created_by: "",
            modified_by: "",
            created_at: "",
            created_at_utc: "",
            modified_at: "",
            modified_at_utc: "",
            
        };
        return common_prop;
    }

    imageWidtHeightInfo(){
        let image_prop = {dimension:{
            width: "",
            height: "",
        }};
        return image_prop;
    }

    compareImgMetaInfo(){
        let compare_image_prop = {compare_img:{
                id: "",
                name: "",
                type: "",
                size: "",
                width: "",
                height: "",
                extension: ""
        }};
        return compare_image_prop;
    }

    uploadMetaInfo(){
        let upload_data = {upload_info: {
                uploaded_on: "",
                uploaded_time: "",
                status: ""
            }};
         return upload_data;   
            
    }

    imgWholeMetaInfo(){
        let img_whole_meta = Object.assign(this.commonMetaInfo(), this.imageWidtHeightInfo(),this.compareImgMetaInfo(), this.uploadMetaInfo());
        return img_whole_meta;
    }

    getCommonMetaForWrite(arg_obj){
        let img_data = arg_obj["img_data"];
        if (img_data["id"] == '' && img_data["id"] != undefined){
            img_data["id"] = arg_obj["asset_file_prefix"] + arg_obj["curr_date_time"];
        }

        if (img_data["extension"] == '' && img_data["extension"] != undefined){
            img_data["extension"] = arg_obj["extension"];
        }

        if (img_data["name"] == '' && img_data["name"] != undefined){
            img_data["name"] = arg_obj["asset_file_prefix"] + arg_obj["curr_date_time"] + "." + img_data["extension"];
        }
        
        if (img_data["description"] == '' && img_data["description"] != undefined){
            img_data["description"] = '';
        }

        if (img_data["type"] == '' && img_data["type"] != undefined){
            img_data["type"] = arg_obj["type"];
        }

        if (img_data["size"] == '' && img_data["size"] != undefined){
            img_data["size"] = '';
        }

        if (img_data["state"] == '' && img_data["state"] != undefined){
            img_data["state"] = '';
        }
        
        if (img_data["created_by"] == '' && img_data["created_by"] != undefined){
            img_data["created_by"] = arg_obj["user"];
        }

        if (img_data["modified_by"] == '' && img_data["modified_by"] != undefined){
            img_data["modified_by"] = arg_obj["user"];
        }

        if (img_data["created_at"] == '' && img_data["created_at"] != undefined){
            img_data["created_at"] = arg_obj["created_at"];
        }

        if (img_data["modified_at"] == '' && img_data["modified_at"] != undefined){
            img_data["modified_at"] = arg_obj["created_at"];
        }

        if (img_data["created_at_utc"] == '' && img_data["created_at_utc"] != undefined){
            img_data["created_at_utc"] = arg_obj["created_at"];
        }

        if (img_data["modified_at_utc"] == '' && img_data["modified_at_utc"] != undefined){
            img_data["modified_at_utc"] = arg_obj["created_at"];
        }
        return img_data;

    }

}
module.exports = MetaInfo;

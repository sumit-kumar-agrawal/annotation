class MetaInfo{
    constructor(curr_date_with_time, curr_date_and_time, curr_date_utc, user){
        this.curr_date_and_time = curr_date_and_time;
        this.curr_date_utc = curr_date_utc;
        this.curr_date_with_time = curr_date_with_time;
        
        this.user = user;
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
            path: "",
            
        };
        common_prop = Object.assign(common_prop, thsi.dateCreatedMetaInfo(), this.dateModifyMetaInfo());
        return common_prop;
    }

    imageWidtHeightInfo(arg_obj){
        let image_prop = {dimension:{
            width: (arg_obj.width == undefined) ? "" : arg_obj.width,
            height: (arg_obj.height == undefined) ? "" : arg_obj.height,
        }};
        return image_prop;
    }

    compareImgMetaInfo(arg_obj){
        
        let compare_image_prop = {compare_img:{
                id: (arg_obj.id == undefined) ? "" : arg_obj.id,
                name: (arg_obj.name == undefined) ? "" : arg_obj.name,
                type: (arg_obj.type == undefined) ? "" : arg_obj.type,
                size: (arg_obj.size == undefined) ? "" : arg_obj.size,
                width: (arg_obj.width == undefined) ? "" : arg_obj.width,
                height: (arg_obj.height == undefined) ? "" : arg_obj.height,
                extension: (arg_obj.extension == undefined) ? "" : arg_obj.extension
        }};
        return compare_image_prop;
    }

    uploadMetaInfo(arg_obj){
        let upload_data = {upload_info: {
                uploaded_on: (arg_obj.uploaded_on == undefined) ? "" : arg_obj.uploaded_on,
                uploaded_time: (arg_obj.uploaded_time == undefined) ? "" : arg_obj.uploaded_time,
                status: (arg_obj.status == undefined) ? "" : arg_obj.status,
            }};
         return upload_data;   
            
    }

    imgWholeMetaInfo(){
        let img_whole_meta = Object.assign(this.commonMetaInfo(), this.imageWidtHeightInfo(),this.compareImgMetaInfo(), this.uploadMetaInfo());
        return img_whole_meta;
    }

    dateCreatedMetaInfo(){
        return {created_by: this.user,created_at: this.curr_date_and_time, created_at_utc: this.curr_date_utc}
    }
    dateModifyMetaInfo(){
        return {modified_at: this.curr_date_and_time, modified_at_utc: this.curr_date_utc, modified_by: this.user}
    }

    getWriteMetaInfo(){
        return {
            name: "",
            description: "",
            type: "",
            size: "",
            state: "",
            extension: ""
        }
    }

    createMetaId(arg_obj){
        return {id: arg_obj.asset_file_prefix + this.curr_date_with_time};
    }

    writeMetaInfo(arg_obj){
        let comm_meta_data = arg_obj.common_meta_data;
        let write_meta_info = {
                name: (comm_meta_data.name == undefined) ? "" : comm_meta_data.name,
                description: (comm_meta_data.description == undefined) ? "" : comm_meta_data.description,
                type: (comm_meta_data.type == undefined) ? "" : comm_meta_data.type,
                size: (comm_meta_data.size == undefined) ? "" : comm_meta_data.size,
                state: (comm_meta_data.state == undefined) ? "" : comm_meta_data.state,
                extension: (comm_meta_data.extension == undefined) ? "" : comm_meta_data.extensionextension,
                path: (arg_obj.path == undefined) ? "" : arg_obj.path,
        }
        write_meta_info = Object.assign(this.createMetaId(arg_obj), write_meta_info,this.dateCreatedMetaInfo(),this.dateModifyMetaInfo());
        return write_meta_info;
    }

    updateMetaInfo(arg_obj){
        return {
                state: (arg_obj.state == undefined) ? "" : arg_obj.state, 
                name: (arg_obj.name == undefined) ? "" : arg_obj.name, 
                description: (arg_obj.description == undefined) ? "" : arg_obj.description, 
        }
    }
   
}
module.exports = MetaInfo;

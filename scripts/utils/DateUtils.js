class DateUtils {
    constructor(){
        this.d = new Date(); 
    }
    today(format=true) {
        //let d = new Date();
        if (format) {
            return this.month(this.d) + '_' + this.date(this.d) + '_' + this.year(this.d);
        } else {
            return this.month(this.d) + this.date(this.d) + this.year(this.d);
        }
    }

    
    yyyymmdd() {
        //let d = new Date();
        return this.year(this.d) + this.month(this.d) + this.date(this.d);
    }

    ddmmyyyy(){
        //let d = new Date();
        return this.date(this.d) + this.month(this.d) + this.year(this.d);
    }

    year(d) {
        return d.getFullYear().toString();
    }

    month(d) {
        return (0+(d.getMonth() + 1).toString()).slice(-2);
    }

    date(d) {
        return (0+d.getDate().toString()).slice(-2);
    }

    hhmmss(arg = '') {
        let d;
        if(arg == ""){
            //d = new Date();
            d = this.d;
        }else{
          d = arg;  
        }
        
        return (0+(d.getHours()).toString()).slice(-2) + (0+(d.getMinutes()).toString()).slice(-2) + (0+(d.getSeconds()).toString()).slice(-2);
    }

    yyyy_mm_dd_hh_mm_ss(){
        //let d = new Date()
        return this.year(this.d) +'-'+ this.month(this.d) + '-' + this.date(this.d) + ' ' +  this.hhmmss(this.d);
    }

    

    date_with_time(format = 'ddmmyyyy'){
        var date;
        switch (format) {
            case 'ddmmyyyy':
                date = this.ddmmyyyy();
            break;
            case 'yyyymmdd':
                date = this.yyyymmdd();
            break;
        }
        return date + hhmmss();
    }

    date_utc(){
       return this.d;
    }
    
};
module.exports = DateUtils;
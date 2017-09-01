class DateUtils {
    today(format=true) {
        let d = new Date();
        if (format) {
            return this.month(d) + '_' + this.date(d) + '_' + this.year(d);
        } else {
            return this.month(d) + this.date(d) + this.year(d);
        }
    }

    
    yyyymmdd() {
        let d = new Date();
        return this.year(d) + this.month(d) + this.date(d);
    }

    ddmmyyyy(){
        let d = new Date();
        return this.date(d) + this.month(d) + this.year(d);
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

    hhmmss() {
        let d = new Date();
        return (0+(d.getHours()).toString()).slice(-2) + (0+(d.getMinutes()).toString()).slice(-2) + (0+(d.getSeconds()).toString()).slice(-2);
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
};
module.exports = DateUtils;
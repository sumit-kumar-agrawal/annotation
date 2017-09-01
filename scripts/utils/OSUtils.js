class OSUtils {
    constructor() {
        this.OSModule = require('os');
        this.path = require('path');
    }

    delimiter() {
        return this.isWindows() ? '\\' : '/';
    }

    isWindows() {
        return this.OSModule.type() == 'Windows_NT';
    }

    getAppRootPath(){
        return this.path.resolve('.');
    }
}

module.exports = OSUtils;

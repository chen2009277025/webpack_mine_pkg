/**
 * Created by chenjianhui on 16/4/27.
 *
 * 文件操作工具类
 */

var baseDir = __dirname;
var Class = require(baseDir+"/Class.js");
const fs = require('fs');

var IconClassMap = {
    css:{
        iconOpen:"cssIcon_open",
        iconClose:"cssIcon_close"
    },
    js:{
        iconOpen:"jsIcon_open",
        iconClose:"jsIcon_close"
    }
};

var FSManage = Class.extend({
    /***
     * 移除文件
     * @param path
     * @param callback
     */
    removeFileOrDir: function (path, callback) {
        var  _self = this;
        if (!fs.existsSync(path)) {
            return 0;
        }
        try {
            var state = fs.statSync(path);
            if (state.isFile()) {
                fs.unlinkSync(path);
            } else if (state.isDirectory()) {
                _self.removeDir(path);
            }
            if (callback) {
                callback();
            }
            return 1;
        } catch (e) {
            console.log(e);
            return 9;
        }
    },
    /***
     * 递归删除文件夹里面的内容
     * @param path
     * @returns {boolean}
     */
    removeDir:function(path){
        var  _self = this;
       var list =  fs.readdirSync(path),filename;
       try{
           list.forEach(function(filename){
               file_path = path + "/" + filename;
               var state = fs.statSync(file_path);
               if (state.isFile()) {
                   fs.unlinkSync(file_path);
               } else if (state.isDirectory()) {
                   _self.removeDir(file_path);
               }
           });
           fs.rmdirSync(path);
           return true;
       }catch(e){
           console.log(e);
           return false;
       }
    },
    /***
     * 新建文件
     * @param file
     * @param callback
     */
    makeFile: function (file,callback) {
        if (fs.existsSync(file)) {
            return 0;
        }
        try {
            fs.openSync(file, "w+");
            if (callback) {
                callback();
            }
            return 1;
        } catch (e) {
            console.log(e);
            return 9;
        }
    },
    /***
     * 新建文件夹
     * @param file
     * @returns {number}
     */
    makeDir:function(file){
        if (fs.existsSync(file)) {
            return 0;
        }
        try{
            fs.mkdirSync(file);
            return 1;
        }catch(e){
            console.log(e);
        }
    },
    /***
     * 写文件
     * @param file
     * @returns {number}
     */
    writeFile: function (file,data,callback) {
        //if (!fs.existsSync(file)) {
        //    return 0;
        //}
        try {
            fs.writeFileSync(file, data,"utf-8");
            if (callback) {
                callback();
            }
            return 1;
        } catch (e) {
            console.log(e);
            return 9;
        }
    },
    /***
     * 读取目录结构
     * @param path
     * @returns {Array}
     */
    readDir: function (path) {
        var _self = this;
        var fileList = [];
        var file_path = "";
        try {
            var dirList = fs.readdirSync(path);
            if (dirList && dirList.length) {
                dirList.forEach(function (filename) {
                    file_path = path + "/" + filename;
                    var state = fs.statSync(file_path);
                    if (state.isFile()) {
                        fileList.push({
                            type: "file",
                            name: filename,
                            ext: fsUtils.checkFileExt(filename),
                            path: file_path,
                            iconSkin:fsUtils.checkFileIcon(filename)
                        });
                    } else if (state.isDirectory()) {
                        if (filename != "exports") {
                            //导出数据不做遍历
                            fileList.push({
                                type: "dir",
                                name: filename,
                                ext: fsUtils.getFolderType(filename),
                                children: _self.readDir(file_path),
                                path: file_path,
                                iconSkin:"dir"
                            });
                        }
                    }
                })
            }
        } catch (e) {
            console.log(e);
        }
        return fileList;
    },
    /***
     * 读取文件内容
     * @param filepath
     * @returns {string}
     */
    readFile: function (filepath) {
        var fileData = "";
        try {
            if (!fs.existsSync(filepath)) {
                return "";
            }
            fileData = fs.readFileSync(filepath, 'utf-8');
            return fileData;
        } catch (e) {
            console.log(e);
            return "";
        }

    },
    /***
     * 拷贝文件
     * @param src //需要拷贝的文件
     * @param dst //目标路径
     */
    copyFile: function (src, dst) {
        if (!src || !dst) {
            return;
        }
        var filename = src.substring(src.lastIndexOf("/") + 1);
        try {
            fs.writeFileSync(dst + "/" + filename, fs.readFileSync(src));
        } catch (e) {
            console.log(e);
        }
    },
    /***
     * 拷贝文件夹
     * @param src
     * @param dst
     */
    copyDir: function (src, dst) {
        var _self = this;
        var file_path = "";
        var basePathName = src.substring(src.lastIndexOf("/") + 1);
        try {
            //首先要在目标目录下建一个新的文件夹
            dst = dst + "/" + basePathName;
            fs.mkdirSync(dst);
            var dirList = fs.readdirSync(src);
            if (dirList && dirList.length) {
                dirList.forEach(function (filename) {
                    file_path = src + "/" + filename;
                    var state = fs.statSync(file_path);
                    if (state.isFile()) {//如果是文件则拷贝文件
                        _self.copyFile(file_path, dst);
                    } else if (state.isDirectory()) {//如果是文件夹则递归
                        _self.copyDir(file_path, dst);
                    }
                })
            }
        } catch (e) {
            console.log(e);
        }
    }
});

/***
 * 文件辅助
 * @type {{checkFileExt: Function, getFolderType: Function}}
 */
var fsUtils = {
    /**
     * 获得文件类型
     * @param file
     * @returns {*}
     */
    checkFileExt: function (file) {
        var fileExt;
        fileExt = file.substring(file.lastIndexOf(".") + 1);
        if(!fileExt){
            fileExt = "txt";
        }
        return fileExt;
    },
    /**
     * 获得文件图标类型
     * @param file
     * @returns {*}
     */
    checkFileIcon: function (file) {
        var fileExt;
        fileExt = file.substring(file.lastIndexOf(".") + 1);

        switch (fileExt){
            case "css":
                fileExt = "css";
                break;
            case "js":
                fileExt = "js";
                break;
            case "fhtml":
                fileExt = "fhtml";
                break;
            default:
                fileExt = "txt";
                break;
        }
        return fileExt;
    },
    /**
     * 获得文件夹类型
     * @param path
     * @returns {string}
     */
    getFolderType: function (folderName) {
        var folderType = "default";

        if (/css|stylesheet|stylesheets/.test(folderName.toLowerCase())) {
            folderType = "css";
        } else if (/[js|javascript|javascripts]/.test(folderName.toLowerCase())) {
            folderType = "js";
        } else if (/[img|image|images]/.test(folderName.toLowerCase())) {
            folderType = "img";
        }
        return folderType;
    }
}

module.exports = new FSManage();

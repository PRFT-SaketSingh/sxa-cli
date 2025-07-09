const config = require(global.rootPath + '/gulp/config');
const path = require('path');
const request = require('request');
const fs = require('fs');
const colors = require('colors');

module.exports = function (file) {
    var conf = config.serverOptions,
        name = path.basename(file.path),
        dirName = path.dirname(file.path),
        relativePath = path.relative(global.rootPath, dirName),
        filePath = relativePath;
    if (relativePath.length == 0) {
        filePath = global.rootPath
    }
    prom = new Promise((resolve, reject) => {
        let url = [conf.server,
        conf.uploadScriptPath,
            '?user=',
        config.user.login,
            '&password=',
        config.user.password,
            '&script=',
        conf.projectPath,
        conf.themePath,
            '/',
            relativePath,
            '&sc_database=master&apiVersion=media&scriptDb=master'
        ].join('');
        var formData = {
            file: fs.createReadStream(filePath + '/' + name),
        };
        var a = request.post({
            url: url,
            formData: formData,
            agentOptions: {
                rejectUnauthorized: false
            }
        }, function (err, httpResponse, body) {
            resolve();
            if (err) {
                if (process.env.debug == 'true') {
                    return console.log(('upload of ' + name + ' failed:' + err).red);
                } else {
                    return;
                }

            }
            if (httpResponse.statusCode !== 200) {
                if (process.env.debug == 'true') {
                    console.log(('Status code:' + httpResponse.statusCode).red);
                    console.log(('Answer:' + httpResponse.body).red);
                }
                return
            } else {
                if (process.env.debug == 'true') {
                    return console.log(('Uploading of ' + name + ' was successful!').green);
                } else {
                    return
                }
            }
        });
    });
    return prom;
}
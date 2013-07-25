var path = require('path')
var fs = require('fs')

var logger = require('./logger').getLog()

exports.home = process.platform === 'win32' ? process.env.USERPROFILE : process.env.HOME

exports.split = function(str) {
    return str ? str.split(',') : []
}


/**
 * extract config from commander
 */
exports.getCfg = function(commander) {
    var cfg = {}
    commander.options.forEach(function(item) {
        var key = camelcase(item.name())
        if(key in commander) {
            if (typeof commander[key] !== 'function') {
                cfg[key] = commander[key]
            }
        }
    })
    return cfg
}

function camelcase(flag) {
    return flag.split('-').reduce(function(str, word){
        return str + word[0].toUpperCase() + word.slice(1);
    });
}


/**
 * read json config file
 */
exports.readCfgFile = function(p) {
    try {
        return require(path.resolve(p))
    } catch(e) {
        logger.debug('Fail to read config file<' + p + '>')
    }
}


exports.isUrl = function(p) {
    /* jshint -W092 */
    return /^https?:\/\//.test(p)
}


/**
 * see if specified adapter is a keyword
 */
exports.isKeyword = function(p) {
    return p.indexOf('.') === -1 && p.indexOf(path.sep) === -1
}


exports.isExistedFile = function(p){
    //  if path contains query string
    var reg = /\?|#/
    if (reg.test(p)) {
        p = p.split(reg)[0]
    }

    return p && fs.existsSync(p) && fs.statSync(p).isFile()
}


/**
 * mix properties from src to target
 * multiple src be allowed
 * e.g. var target = mix(target, src1, src2, src3)
 */
exports.mix = function(target, src, overwrite) {
    target = target || {}
   /*
    * NOTE
    *
    * can't modify overwrite directly!!!
    *
    * if you assign a new value to overwrite
    * when method in the same file call mix()
    * arguments is not modified
    * but if one method out of this file call it
    * arguments will be modified
    */
    var ow
    var len = arguments.length
    var srcEnd = len - 1
    var lastArg = arguments[len - 1]

    if ( typeof lastArg === 'boolean' || typeof lastArg === 'number') {
        ow = lastArg
        srcEnd--
    } else {
        ow = false
    }

    for (var i = 1; i <= srcEnd; i++) {
        var current = arguments[i] || {}
        for (var j in current) {
            if (ow || typeof target[j] === 'undefined') {
                target[j] = current[j]
            }
        }
    }

    return target
}


exports.getExternalIpAddress = function() {
    var interfaces = require('os').networkInterfaces()
    var addresses = []
    Object.keys(interfaces).forEach(function(name) {
        var iface = interfaces[name]
        for (var i in iface) {
            var node = iface[i]
            if (node.family === 'IPv4' && node.internal === false) {
                addresses = addresses.concat(node)
            }
        }
    })
    if (addresses.length > 0) {
        return addresses[0].address
    }
}

exports.logger = require('./logger')

'use strict';

var fs = require('fs')
var path = require('path')
var tracer = require('tracer')
var colors = require('colors')
var dateFormat = require('dateformat')
var _ = require('underscore')

_.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
}

var debug = process.argv.some(function(arg) {
    return arg === '--verbose'
})

var levels = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
var level = 'INFO'

if (debug) {
    level = 'DEBUG'
}

var conf = {
    root : 'logs',
    logPathFormat : '{{root}}/{{date}}.log'
}

function LogFile(date) {
    this.date = date;
    this.path = _.template(conf.logPathFormat, {root:conf.root, date:date})

    if (!fs.existsSync(path.dirname(this.path))) {
        fs.mkdirSync(path.dirname(this.path))
    }

    this.stream = fs.createWriteStream(this.path, {
        flags: 'a',
        encoding: 'utf8'
    })
}

LogFile.prototype.write = function(str) {
    this.stream.write(str + '\n');
}

LogFile.prototype.destroy = function() {
    if (this.stream) {
        this.stream.end()
        this.stream.destroySoon()
        this.stream = null
    }
}

var logFile

function _push2File(str) {
    var now = dateFormat(new Date(), 'yyyymmdd')

    if (logFile && logFile.date !== now) {
        logFile.destroy()
        logFile = null
    }

    if (!logFile) {
        logFile = new LogFile(now)
    }

    logFile.write(str)
}


var logger = tracer.colorConsole({
    methods : ['debug', 'info', 'warn', 'error', 'fatal'],
    level: 'debug',
    format: [
        '{{title}} {{file}}:{{line}} | {{message}}', //default format
        {
            fatal: '{{message}} (in {{file}}:{{line}})\nCall Stack:{{stacklist}}'
        }
    ],
    preprocess: function(data) {
        if (data.title === 'fatal') {
            var callstack = '', len = data.stack.length
            for (var i = 0; i < len; i++) {
                callstack += '\n' + data.stack[i]
            }
            data.stacklist = callstack
            data.title = data.title.toUpperCase()
        }
    },
    filters: [{
        info : colors.green,
        warn : colors.yellow,
        error : [colors.red]
    }],
    transport: function(data) {
        var title = data.title.toUpperCase()
        if (levels.indexOf(title) >= levels.indexOf(level)) {
            console.log(data.output)
        }

        if (logger.push2File) {
            _push2File(getMsg(title, data))
        }

        if (title === 'FATAL') {
            process.exit(0)
        }
    }
})

function getMsg(title, data) {
    var msg = getPrefix(title, data) +  ' | '

    if (title !== 'FATAL') {
        return msg + data.message
    } else {
        return msg + '[' + data.stacklist.split('\n').join(',') + ']'
    }
}

function getPrefix(title, data) {
    var msg = padding(title, 5) + ' ' + dateFormat(new Date(), 'yyyy-mm-dd hh:MM:ss') +
        ' ' + padding(data.file, 12, true) + ':' + padding(data.line, 4)
    return padding(msg, 38)
}

function padding(msg, num, isRight) {
    msg = msg.split('')

    for (var i = msg.length, len = num; i < len; i++) {
        if (isRight) {
            msg.unshift(' ')
        } else {
            msg.push(' ')
        }
    }
    return msg.join('')
}

logger.push2File = !/totoro$/.test(process.argv[1])

module.exports = logger

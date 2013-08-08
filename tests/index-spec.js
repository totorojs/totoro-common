'use strict';

var expect = require('expect.js')
var commander = require('commander')

var common = require('../index')


describe('totoro-common', function(){

    describe('split', function() {
        it('should return a split array if a string is passed in', function() {
            var str = 'mac/chrome/10.0.0.1,firefox,sarafi/3.0'
            var rt = common.split(str)
            expect(rt.length).to.be(3)
            expect(rt[0]).to.be('mac/chrome/10.0.0.1')
        })

        it('should return an empty array if not a string is passed in', function() {
            expect(common.split().length).to.be(0)
            expect(common.split(false).length).to.be(0)
            expect(common.split([1,2,3]).length).to.be(0)
            expect(common.split({key:'value'}).length).to.be(0)
        })
    })

    describe('getCfg', function() {
        it('should extract command line options from commander object', function() {
            commander
                .description('a commander')
                .option('--nick [s]', 'a name')
                .option('--favorite [s]', 'a favorite')
                .parse(['node', 'scriptpath', '--nick=fool2fish', '--favorite=imax'])
            var rt = common.getCfg(commander)
            expect(Object.keys(rt).length).to.be(2)
            expect(rt.nick).to.be('fool2fish')
            expect(rt.favorite).to.be('imax')
        })
    })

    describe('readCfgFile', function() {

    })

    describe('writeCfgFile', function() {

    })

    describe('camelcase', function() {
        it('should turn aa-bb-cc into aaBbCc', function() {
            expect(common.camelcase('totoro')).to.be('totoro')
            expect(common.camelcase('totoro-server')).to.be('totoroServer')
            expect(common.camelcase('totoro-Common')).to.be('totoroCommon')
        })

    })

    describe('unCamelcase', function() {
        it('should turn aaBbCc into aa-bb-cc', function() {
            expect(common.unCamelcase('totoro')).to.be('totoro')
            expect(common.unCamelcase('totoroServer')).to.be('totoro-server')
            expect(common.unCamelcase('TotoroCommon')).to.be('-totoro-common')
        })
    })

    describe('isUrl', function() {

    })

    describe('isKeyword', function() {

    })

    describe('isExistedFile', function() {

    })

    describe('mix', function() {

    })

    describe('getExternalIpAddress', function() {

    })
})

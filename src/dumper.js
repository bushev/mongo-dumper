'use strict';

var assert = require('assert');
var childProcess = require('child_process');

function Dumper(dumpSettings) {
    assert.notEqual(dumpSettings, null);
    assert.notEqual(dumpSettings.hosts, null);

    this.hosts = dumpSettings.hosts;
    this.authentication = dumpSettings.authentication;
    this.db = dumpSettings.db;
    this.output = dumpSettings.output;
};

Dumper.prototype.dump = function(){
    var mongodump = childProcess.exec(this.buildCommand(), function (error, stdout, stderr) {
        if (error) {
            console.log(error.stack);
            console.log('Error code: '+error.code);
            console.log('Signal received: '+error.signal);
        }
        console.log('Child Process STDOUT: '+stdout);
        console.log('Child Process STDERR: '+stderr);

    });

    mongodump.on('exit', function (code) {
       console.log('Child process exited with exit code '+code);
    });
}

Dumper.prototype.buildCommand = function(){
    var command = 'mongodump';

    command += ' --host ' + this.hosts;

    if(this.authentication){
        command += ' --authenticationDatabase ' + this.authentication.database;
        command += ' --username ' + this.authentication.user;

        if(this.authentication.password){
            command += ' --password ' + this.authentication.password;
        }
    }

    if(this.db){
        command += ' --db ' + this.db;
     
        if(this.db.collection){
            command += ' --collection ' + this.db.collection;

            if(this.query){
                command += ' --query ' + this.query;
            }
        }
    }

    command += ' --oplog ';

    if(this.output){
        command += ' --out ' + this.output;
    }    

    return command;
}

module.exports = Dumper;
var expect = require('chai').expect,
  fs = require('fs'),
  path = require('path'),
  sinon = require('sinon'),
  jaunt = require('../index');

describe('#jaunt', function () {
  it('is not a directory', function () {
    sinon.stub(fs, 'stat', function (dir, callback) {
      callback(null, { isDirectory: function () { return false; } })
    });

    sinon.stub(fs, 'readdir', function (dir, callback) { });

    jaunt('notADir', function (err, data) {
      expect(data.filenames[0]).to.equal('notADir');
      expect(data.dirnames).to.be.empty;
    });
  });

  it('is not a file or a directory', function () {
    sinon.stub(fs, 'stat', function (dir, callback) {
      callback({ errno: -1 })
    });

    sinon.stub(fs, 'readdir', function (dir, callback) { });

    jaunt('notADir', function (err, data) {
      expect(err.errno).to.equal(-1);
      expect(data).to.be.undefined;
    });
  });

  it('is an empty directory', function () {
    sinon.stub(fs, 'stat', function (dir, callback) {
      callback(null, { isDirectory: function () { return true; } })
    });

    sinon.stub(fs, 'readdir', function (dir, callback) {
      callback(null, [])
    });

    jaunt('EmptyDir', function (err, data) {
      expect(data.dirnames[0]).to.equal('EmptyDir');
      expect(data.filenames).to.be.empty;
    });
  });

  it('is a directory with files', function () {
    var dirName = 'DirName';

    sinon.stub(fs, 'stat', function (dir, callback) {
      callback(null, { isDirectory: function () { return dir == dirName; } })
    });

    sinon.stub(fs, 'readdir', function (dir, callback) {
      callback(null, ['file1.txt', 'file2.txt'])
    });

    jaunt(dirName, function (err, data) {
      expect(data.dirnames[0]).to.equal(dirName);
      expect(data.filenames).to.have.lengthOf(2);
    });
  });

  it('is a directory with subdirectories', function () {
    var dirName = 'DirName';

    sinon.stub(fs, 'stat', function (dir, callback) {
      callback(null, { isDirectory: function () { return dir.length < dirName.length + 2; } })
    });

    sinon.stub(fs, 'readdir', function (dir, callback) {
      callback(null, [dir + '1', dir + '2'])
    });

    sinon.stub(path, 'resolve', function (dir, file) {
      return file;
    });

    jaunt(dirName, function (err, data) {
      expect(data.dirnames).to.have.lengthOf(3);
      expect(data.filenames).to.have.lengthOf(4);
    });

    path.resolve.restore();
  });

  afterEach(function () {
    fs.readdir.restore();
    fs.stat.restore();
  });
});
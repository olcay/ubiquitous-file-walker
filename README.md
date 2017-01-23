Ubiquitous File Walker
=========

A function that can retrieve the contents of a given target path and all its subdirectories.

## Installation

```shell
  npm install ubiquitous-file-walker --save
```

## Usage

```js
  var jaunt = require('ubiquitous-file-walker');

  jaunt('E:\\foo', function(err, data){
    if(err == null){
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log("Error: %j", err);
    }
  });
```

## Tests

```shell
  npm test
```

## Contributing

Add unit tests for any new or changed functionality.

## Release History

* 0.1.1 Handled file permission error
* 0.1.0 Initial release
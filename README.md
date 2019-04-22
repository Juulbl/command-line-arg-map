# command-line-arg-map
Library that maps command line arguments to a easily readable map.
An array or string can be used as parameters for the constructor and toCommand function.

The command-line argument map contains a command and an args property:
```javascript
{
    "command": [],
    "args": {}
}
```
- **command**: All arguments given before the first flag.
- **args**: All flags with their given values, this can eigher be null, a single value or an array. When an argument's value is undefined it means that it has not been set and if it is null, it is set without a value. In every other case it returns the given value.

**Map example**
```javascript
{
    "command": [ //All items before the arguments.
        "program",
        "command"
    ],
    "args": {
        "-s": null, //This flag is set without a value.
        "--source": null, //This flag is set without a value.
        "-f": undefined, //This flag is not set or given a value.
        "--flag": undefined, //This flag is not set or given a value.
        "-v": "1.0.0", //This flag is given a single value.
        "--lang": "eng", //This flag is given a single value.
        "-i": [ //This flag is set with multiple items.
            "./input/dir/",
            "./input/dir1/"
        ],
        "--output": [ //This flag is set with multiple items.
            "./output/dir/",
            "./output/dir1/"
        ]
    }
}
```

### Install
```
npm install --save command-line-arg-map
```

## Import package
Normal javascript
```javascript
let CommandMap = require('command-line-arg-map');
```

ES6
```javascript
import CommandMap from 'command-line-arg-map';
```

## How to use

**String as value**
```javascript

let value = "node index.js -s -f -i ./test/dir/file.ext ./test/dir/file1.ext ./test/dir/file2.ext -o ./test/dir/out.ext -v 1.0.0 --flag --lang=eng --flags 1 2 3";

let command = new CommandMap(value);

console.log(command);
```

**Array as value**
```javascript

let value = ["node", "index.js", "-s", "-f", "-i", "./test/dir/file.ext", "./test/dir/file1.ext", "./test/dir/file2.ext", "-o", "./test/dir/out.ext", "-v", "1.0.0", "--flag", "--lang=eng", "--flags", "1", "2", "3"];

let command = new CommandMap(value);

console.log(command);
```

**Nodejs command line as value**
Script:
```javascript
let command = new CommandMap(process.argv);

console.log(command);
```
Command:
```
node index.js -s -f -i ./test/dir/file.ext ./test/dir/file1.ext ./test/dir/file2.ext -o ./test/dir/out.ext -v 1.0.0 --flag --lang=eng --flags 1 2 3
```

**Output**
```javascript
{
    "commands": [
        "node",
        "index.js"
    ],
    "args": {
        "-s": null,
        "-f": null,
        "-i": [
            "./test/dir/file.ext",
            "./test/dir/file1.ext",
            "./test/dir/file2.ext"
        ],
        "-o": "./test/dir/out.ext",
        "-v": "1.0.0",
        "--flag": null,
        "--lang": "eng",
        "--flags": [ 
            "1",
            "2",
            "3"
        ]
    }
}
```

## Accessing the command
Script:
```javascript
let value = "node index.js -s -f -i ./test/dir/file.ext ./test/dir/file1.ext ./test/dir/file2.ext -o ./test/dir/out.ext -v 1.0.0 --flag --lang=eng --flags 1 2 3";

let command = new CommandMap(value);

console.log(command.getCommands());
```
Output:
```javascript
["node", "index.js"]
```

## Getting arguments

There are a couple of ways to retreive arguments when a command map is created.

**Argument functions**
When only one argument is given to the getArg function, it will return the value of that argument.
```javascript
let value = "node index.js -s ./source/dir/";

let command = new CommandMap(value);

console.log(command.getArg("-s"));
```
Output:
```javascript
"./source/dir/"
```
-----------
-----------
When multiple flags can be used for the same argument, the getArg function can be used with the posible flags as parameters. This functions will return the value of the first flag that is not null or undefined.
```javascript
let value = "node index.js -s ./source/dir/";

let command = new CommandMap(value);

console.log(command.getArg("-s", "--source"));
```
Output:
```javascript
"./source/dir/"
```
-----------
When no arguments are given to the getArgs function it will return all arguments found in the command.
```javascript
let value = "node index.js -s -f -i ./test/dir/file.ext ./test/dir/file1.ext ./test/dir/file2.ext -o ./test/dir/out.ext -v 1.0.0 --flag --lang=eng --flags 1 2 3";

let command = new CommandMap(value);

console.log(command.getArgs());
```
Output:
```javascript
{
    "-s": null,
    "-f": null,
    "-i": [
        "./test/dir/file.ext",
        "./test/dir/file1.ext",
        "./test/dir/file2.ext"
    ],
    "-o": "./test/dir/out.ext",
    "-v": "1.0.0",
    "--flag": null,
    "--lang": "eng",
    "--flags": [ 
        "1",
        "2",
        "3"
    ]
}
```
-----------
Multiple arguments can be requested using the getArgs function. This function will return a map containing all the requested arguments.
```javascript
let value = "node index.js -s -f -i ./test/dir/file.ext ./test/dir/file1.ext ./test/dir/file2.ext -o ./test/dir/out.ext -v 1.0.0 --flag --lang=eng --flags 1 2 3";

let command = new CommandMap(value);

console.log(command.getArgs("-s", "-p", "-i", "--lang"));
```
Output:
```javascript
{
    "-s": null,
    "-p": undefined,
    "-i": [
        "./test/dir/file.ext",
        "./test/dir/file1.ext",
        "./test/dir/file2.ext"
    ],
    "--lang": "eng"
}
```
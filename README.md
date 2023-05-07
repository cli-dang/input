# @cli-dang/input

___

###### Command Line Interface design framework. ESModule

___

## Index of Contents

___

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
  - [simple implementation in one file](#simple-implementation-in-one-file)
- [JetBrains OSS Licence](#jetbrains-oss-license)

___

## Description

___

**@cli-dang/input v4.x**

Framework to build cli applications:

- Simple to use and to configure.
- Accept key->value `(opts)` as argument.
- Automatic version and help command.
- --flag='hello' style of input
- --global-flags
- prioritize flag execution
- callbacks and callbacks rest-parameters
- type checks for --flag arguments
- set flags conflict

___

## Installation

```shell
npm install @cli-dang/input
```
___

## Usage

### simple implementation in one file.

initialize the project
```shell
npm init -y

npm pkg set type="module"; # mandatory to specify esModule
 
npm install @cli-dang/input

echo '{"some": "Jason", "data":["0", "1"]}' >> ./test.json

touch ./index.js
```

> ⚠ remember to give index.js file executable permission

```shell
chmod u+x ./index.js
```

**file index.js**
```javascript
#!/usr/bin/env node --no-warnings

import { readFile } from 'node:fs/promises'
import { Command, entry_point } from '@cli-dang/input'
import { extname } from 'node:path'

process.title = 'read-filename' // Optional give your cli a name.

// The very entry point of the cli application
const app = async (parsed) => {

  // The read command callback function
  const read_cb = async (data) => {

    let exitCode = 0

    // Get the filename
    const filename = `${process.cwd()}/${data.flag['--filename'] || data.flag['-f']}`

    // only json files are allowed
    if(extname(filename) !== '.json'){
      console.error('only json file')
      process.exit(1)
    }

    // It reads the file, and if the readFile fails, it returns a json string with the error message given.
    const content = await readFile(filename, { encoding: 'utf-8' }).catch(error => {
      exitCode = 1

      return `{"error":"${ error.message }"}`
    })

    // It converts to object the give json data.
    let json_data
    try{
      json_data = JSON.parse(content)
    }catch ( error ) {
      json_data = `{"error":"${error.message}"}`
      exitCode = 1
    }

    console.log(json_data)
    process.exit(exitCode)
  };

  // Instantiate a new Command and pass to the constructor the parsed argument
  const read = new Command(parsed)

  /**
   *  Define your first command
   *
   *  1. name your command
   *  2. pass the read callback function
   *  3. give it a description & usage to populate the help system
   *
   *  READ COMMAND
   */
  await read.define('read', read_cb, {
    description: 'read a file and print the content',
    usage: './index.js read --filename=test.json'
  })

  /**
   * Define the flag --filename[-f]
   *
   * 1. define the names with a string[] one for short and one for long:
   *    '--filename', '-f'
   * 2. populate descriptor argument
   * 3. give it a description & usage to the descriptor to populate the help system
   *
   * READ --FILENAME FLAG
   */
  await read.flag(['--filename', '-f'], {
    short: '-f',
    long: '--filename',
    type: 'string',
    void: false,
    check: true,
    description: 'ONLY relative path to the current working dir of the app, ⚠️ no slash or dot needed!',
    usage: './index.js read --filename=test.json'
  })

  // This will intercept the given data and execute the routines
  await read.intercept()
};

// - entry_point will process the process.argv data and gives back the object version to app function
await entry_point(process.argv, app).catch(error => console.error(error))

```

the Command class automatically creates two commands:

- **help:**  
  to access the doc entries, you need to pass:  
  - key->value (opts) to the --view flag to retrieve the doc for the flag  
    where `key` is the `command-name` & `value` is the `flag-name`  
    - example `./index.js help --view=read:--filename` to retrieve the flag doc  
  - just the name of the command to the --view flag to retrieve the doc for the command
    - example `./index.js help --view=read` to retrieve the command doc


- **version**:  
  the command version relays to the `package.json` file entry `version` 

**let's run the app and all its functionalities**

```shell
# usage
./index.js read --filename='test.json' # will print the object
./index.js read --filename='test.js' # will print 'only json files'
./index.js read --filename='no-file.json' # will print the ENOENT error message

# automatic commands help & version
./index.js version # will print the version
./index.js help --view=read:--filename # will print the doc entry for the --filename flag
./index.js help --view=read:-f # same same as above

```


___

## JetBrains OSS License

___

I want to thank JetBrains to grant me the Open Source Software license for all their products. This opportunity gives me
strength to keep on going with my studies and personal project.  
To learn more about this opportunity, have a look
at [Licenses for Open Source Development - Community Support](https://www.jetbrains.com/community/opensource/).

_Thank you_

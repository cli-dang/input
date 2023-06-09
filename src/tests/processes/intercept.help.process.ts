#!/usr/bin/env node

import { Command } from '../../lib/input/command.js'

const result: Command = new Command( { object: { help:undefined, '--view':{ 'name':'get' }  }, keys: [ 'help' ]  } )
await result.define( 'name', undefined )
await result.flag( 'get', { short:'get', description:'get it', usage: '#boom boom' } )
await result.intercept()
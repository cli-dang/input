#!/usr/bin/env node

import { Command } from '../../lib/input/command.js'
const result = new Command( { object: { name:undefined, get:'this' }, keys: [ 'name', 'get' ] } )
await result.define( 'name', ( data ) => {
  process.stdout.write( JSON.stringify( data ) )
} )
await result.flag( 'get', { short:'get', description:'get it', usage: '#boom boom' } )
await result.intercept()
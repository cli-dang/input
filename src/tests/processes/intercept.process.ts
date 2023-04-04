#!/usr/bin/env node

import { Command } from '../../lib/input/command'
const result = new Command()
result.define( 'name', ( data ) => {
  process.stdout.write( JSON.stringify( data ) )
} )
await result.flag( 'get', { short:'get', description:'get it', usage: '#boom boom' } )
await result.intercept( { object: { name:undefined, get:'this' }, keys: [ 'name', 'get' ] } )
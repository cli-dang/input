#!/usr/bin/env node

import { Command } from '../../lib/input/command.js'

if( process.argv[ 2 ] === 'version' ){
  const result: Command = new Command( { object: { version: undefined }, keys: [ 'version' ] }, true )
  await result.intercept()
}else {
  const result: Command = new Command( { object: { version: undefined }, keys: [ 'version' ] } )
  await result.intercept()
}

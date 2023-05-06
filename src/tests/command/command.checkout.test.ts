import * as assert from 'assert'
import * as tttt from 'trythistrythat'
import { Command } from '../../lib/input/command.js'

export default async ( id ) => {
  let success = true
  let message: undefined | string

  const UNITName = '@cli-dang/input.command.checkout'
  let result: Error | Command

  const x = () => {/**/}

  try {
    result = new Command( { object: { 'init': undefined }, keys: [ 'init' ] } )
    await result.define( 'name', x )
    assert.deepStrictEqual( await result.checkout( 'name' ), { flags: {}, cb: x, arguments: undefined } )
  } catch ( error ) {
    result = error
  }

  try {
    result = new Command( { object: { 'init': undefined }, keys: [ 'init' ] } )
    await result.define( 'name', x )
    await result.define( 'last name', x )
    assert.deepStrictEqual( await result.checkout(), {
      name: {
        flags: {},
        cb: x, arguments: undefined,
      },
      'last name': {
        flags: {},
        cb: x, arguments: undefined,
      }
    } )
  } catch ( error ) {
    result = error
  }

  try {
    result = new Command( { object: { 'init': undefined }, keys: [ 'init' ] } )
    await result.define( 'name', x )
    assert.deepStrictEqual( await result.checkout( 'jade' ), undefined )
  } catch ( error ) {
    result = error
  }

  if ( result instanceof Error ) {
    tttt.failed( UNITName )
    success = false
    message = result.message
  }

  tttt.end( id, success, UNITName, message )
}
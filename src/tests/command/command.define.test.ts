import * as assert from 'assert'
import * as tttt from 'trythistrythat'
import { Command } from '../../lib/input/command'

export default async ( id ) => {

  const UNITName = '@cli-dang/input.command.define help'

  const command =  new Command()

  command.define( 'init', <cb>( data, ...rest_args ) => {

    let success = true
    let message: undefined | string
    let result:Error|undefined = undefined

    try {
      assert.deepStrictEqual( data.object[ '--bare' ], rest_args[ 0 ] )
    } catch ( error ) {
      result = error
    }

    if ( result instanceof Error ) {
      tttt.failed( UNITName )
      success = false
      message = result.message
    }

    tttt.end( id, success, UNITName, message )
  }, undefined, false, undefined, [ { data:'to_sanitise', } ] )

  await command.flag( '--bare', { short:'--bare', type:'opts' } )
  await command.intercept( {
    object: { init: undefined, '--bare':{ data:'to_sanitise' }  },
    keys: [
      'init',
      '--bare'
    ],

  } )

}

export async function global_command_flag( id ) {

  const UNITName = '@cli-dang/input.command.define global command flag'


  const command =  new Command()

  command.define( '--init', <cb>( data ) => {

    let success = true
    let message: undefined | string
    let result:Error|undefined = undefined

    try {
      assert.deepStrictEqual( data.object[ '--init' ], 'hello' )
    } catch ( error ) {
      result = error
    }

    if ( result instanceof Error ) {
      tttt.failed( UNITName )
      success = false
      message = result.message
    }

    tttt.end( id, success, UNITName, message )
  }, undefined, true, 'string' )

  command.define( 'command', () => {/*empty*/} )

  await command.intercept( {
    object: { '--init': 'hello', command: undefined  },
    keys: [
      '--init', 'command'
    ],

  } )

}
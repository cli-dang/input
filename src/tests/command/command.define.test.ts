import * as assert from 'assert'
import * as tttt from 'trythistrythat'
import { Command } from '../../lib/input/command.js'
import { Dang } from "@cli-dang/decors"

export default async ( id ) => {

  const UNITName: string = '@cli-dang/input.command.define help'

  const command: Command = new Command( {
    object: { init: undefined, '--bare':{ data:'to_sanitise' }  },
    keys: [
      'init',
      '--bare'
    ],

  } )

  const commandCallBack: Input.CommandCallBack = ( data: Input.ParsedArgv, ...rest_args ): void => {

    let success: boolean = true
    let message: undefined | string
    let result: Error|undefined = undefined

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
  }

  await command.define( 'init', commandCallBack, undefined, false, undefined, [ { data:'to_sanitise', } ] )

  await command.flag( '--bare', { short:'--bare', type:'opts' } )
  await command.intercept()

}

export async function global_command_flag( id ) {

  const UNITName: string = '@cli-dang/input.command.define global command flag'
  const command: Command = new Command( {
    object: { '--init': 'hello', command: undefined  },
    keys: [
      '--init', 'command'
    ],

  } )

  await command.define( '--init', ( data: Input.ParsedArgv ): void => {

    let success: boolean = true
    let message: undefined | string
    let result: Error|undefined = undefined

    try {
      assert.deepStrictEqual( data.object[ '--init' ], 'hello' )
      assert.deepStrictEqual( data.object[ 'command' ], undefined )
      assert.deepStrictEqual( data.keys, [ '--init', 'command' ] )
    } catch ( AssertionError ) {
      result = AssertionError
    }

    if ( result instanceof Error ) {
      tttt.failed( UNITName )
      success = false
      message = result.message
    }

    tttt.end( id, success, UNITName, message )
  }, undefined, true, 'string' )

  await command.define( 'command', (): void => {/*empty*/} )

  await command.intercept()

}

export async function define_same_command( id ): Promise<void>{

  const UNITName: string = '@cli-dang/input.command.define same command Rejects'

  const command: Command = new Command( {
    object: { '--init': 'hello', command: undefined  },
    keys: [
      '--init', 'command'
    ],

  } )

  await command.define( 'init', (): void => {/*empty*/} )

  let success: boolean = true
  let message: undefined | string = undefined

  try{
    await assert.rejects(
      command.define( 'init', (): void => {/*empty*/} ),
      ( error:Error ): boolean => {

        assert.deepStrictEqual( error.message, 'command [init] already defined.' )

        return true
      },
      Dang.red( 'define.command should have failed' )
    )
  }catch ( AssertionError ) {

    tttt.failed( UNITName )
    success = false
    message = AssertionError.message
  }

  tttt.end( id, success, UNITName, message )

}
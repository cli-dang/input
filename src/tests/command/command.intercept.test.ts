import * as assert from 'assert'
import * as tttt from 'trythistrythat'
import { Command } from '../../lib/input/command.js'
import { execFile } from 'child_process'

export default async ( id ): Promise<void> => {

  const UNITName: string = '@cli-dang/input.command.intercept help'

  execFile( `${process.cwd()}/tests/processes/intercept.help.process.js`, ( error, stdout ) => {
    let success: boolean = true
    let message: undefined | string

    let result: Error | Command
    try {
      assert.deepStrictEqual( stdout, 'get it\n#boom boom\n' )
    } catch ( error ) {
      result = error
    }

    if ( result instanceof Error ) {
      tttt.failed( UNITName )
      success = false
      message = result.message
    }

    tttt.end( id, success, UNITName, message )
  } )

}

export async function intercept_data( id ){

  const UNITName = '@cli-dang/input.command.intercept data'

  execFile( `${process.cwd()}/tests/processes/intercept.process.js`, ( error, stdout ) => {
    let success = true
    let message: undefined | string

    if( error ) {
      message = error.message
      tttt.failed( UNITName )
      success = false
    }

    else{

      let result: Error
      try {
        assert.deepStrictEqual( JSON.parse( stdout ), { object:{ get:'this' }, keys:[], command: 'name', flag: {}, flag_returns: {} } )
      } catch ( error ) {
        result = error
      }

      if ( result instanceof Error ) {
        tttt.failed( UNITName )
        success = false
        message = result.message
      }}


    tttt.end( id, success, UNITName, message )
  } )

}
import * as tttt from 'trythistrythat'
import { execFile } from "child_process"
import assert from "assert"
// @ts-ignore: @test
import packageJSON from '../../package.json' assert {type: 'json'}


export default async ( id:string ): Promise<void> => {

  const UNITName: string = '@cli-dang/input.command.intercept version'

  execFile( `${process.cwd()}/tests/processes/intercept.version.process.js`, ( error, stdout ) => {
    let success: boolean = true
    let message: undefined | string

    let result: Error
    try {
      assert.deepStrictEqual( stdout, packageJSON.version )
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

export  async function v_per_version( id:string ): Promise<void> {

  const UNITName: string = '@cli-dang/input.command.intercept v per version'

  execFile( `${process.cwd()}/tests/processes/intercept.version.process.js`, [ 'version' ], ( error, stdout ) => {
    let success: boolean = true
    let message: undefined | string

    let result: Error
    try {
      assert.deepStrictEqual( stdout, `v${ packageJSON.version }` )
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

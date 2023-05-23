import * as assert from 'assert'
import * as tttt from 'trythistrythat'
import { Command } from '../../lib/input/command.js'

export default async ( id: string ): Promise<void> => {

  const name: string = 'flag rejects alias > 2'
  let success: boolean = true
  let message: string | undefined = undefined

  const TestCommand: Command = new Command( { keys: [ 'test', '--test' ], object: { test: undefined } } )
  await TestCommand.define( 'test', () => {/*empty*/} )

  try {
    //@ts-ignore: @test
    await assert.rejects( TestCommand.flag( [ '--test', '-t', 'third-alias-rejects' ], { short: '-t' } ), ( error ) => {
      assert.deepStrictEqual( error, 'alias can be max 2, one for the short and one for the long.' )
      message = error

      return true
    } )
  } catch ( AssertionError ) {

    success = false
    message = AssertionError.message
  }

  if ( success )
    tttt.end( id, true, name, message )
  else {
    tttt.failed( name )
    tttt.end( id, false, name, message )
  }
}

export async function rejects_alias_length_0( id: string ): Promise<void> {

  const name: string = 'flag rejects alias === 0'
  let success: boolean = true
  let message: string | undefined = undefined

  const TestCommand: Command = new Command( { keys: [ 'test', '--test' ], object: { test: undefined } } )
  await TestCommand.define( 'test', () => {/*empty*/} )

  try {
    //@ts-ignore: @test
    await assert.rejects( TestCommand.flag( [], { short: '-t' } ), ( error ) => {
      assert.deepStrictEqual( error, 'alias expressed in an array, must have at least one entry.' )
      message = error

      return true
    } )
  } catch ( AssertionError ) {

    success = false
    message = AssertionError.message
  }

  if ( success )
    tttt.end( id, true, name, message )
  else {
    tttt.failed( name )
    tttt.end( id, false, name, message )
  }
}
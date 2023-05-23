import { AssertionError } from 'assert'
import * as tttt from 'trythistrythat'
import { entry_point } from '../lib/input/entry_point.js'

export default async ( id ): Promise<void> => {

  let success: boolean = true
  let message: string
  const UNITName: string = '@cli-dang/input.entry_point rejects no arguments given'
  let actual: Error

  const result: boolean | AssertionError = await tttt.deepStrictEqual( async (): Promise<TTTT.ResolversType> => {

    // @ts-ignore: @test
    actual = await entry_point().catch( error => error )
    const expected: boolean = true

    return tttt.resolvers( actual instanceof Error, expected )
  } )

  if ( result instanceof Error ) {
    tttt.failed( UNITName )
    success = false
    message = result.message
  } else
    message = actual.message

  tttt.end( id, success, UNITName, message )
}

export async function entry_point_no_rejects( id ): Promise<void> {

  let success: boolean = true
  let message: undefined | string
  const UNITName: string = '@cli-dang/input.entry_point does NOT rejects'

  const result: boolean | AssertionError = await tttt.deepStrictEqual( async () => {

    const asyncFunction: Input.LogicParameter = async ( argv: Input.ParsedArgv ) => {
      const argv_entry: [ string, unknown ][] = Object.entries( argv )
      if ( argv_entry.length === 0 )
        await Promise.reject( new Error( 'empty object' ) )
    }

    const actual: undefined | Error = await entry_point( [ 'hello' ], asyncFunction )

    return tttt.resolvers( actual, undefined )
  } )

  if ( result instanceof Error ) {
    tttt.failed( UNITName )
    success = false
    message = result.message
  }

  tttt.end( id, success, UNITName, message )
}
import * as tttt from 'trythistrythat'
import { AssertionError } from 'assert'
import { entry_point } from '../lib/input/entry_point'
import { OftypesError } from 'oftypes'

export default async ( id ) => {
  let success = true
  let message:undefined|string
  const UNITName = '@cli-dang/input.entry_point rejects no arguments given'
  let actual: undefined|OftypesError = undefined

  const result:boolean|AssertionError = await tttt.deepStrictEqual( async() => {

    // @ts-ignore
    actual = await entry_point().catch( error => error )
    const expected = true

    return tttt.resolvers( actual instanceof Error, expected )
  } )

  if( result instanceof Error ){
    tttt.failed( UNITName )
    success = false
    message = result.message
  }else
    message = actual.message

  tttt.end( id, success, UNITName, message )
}

export async function entry_point_no_rejects ( id ){
  let success = true
  let message:undefined|string
  const UNITName = '@cli-dang/input.entry_point does NOT rejects'

  const result:boolean|AssertionError = await tttt.deepStrictEqual( async() => {
    const asyncFunction:LogicParameter = async( _argv: ParsedArgv ) => {/*void function*/}

    const actual = await entry_point( [ 'hello' ], asyncFunction )
    const expected = undefined

    return tttt.resolvers( actual, expected )
  } )

  if( result instanceof Error ){
    tttt.failed( UNITName )
    success = false
    message = result.message
  }

  tttt.end( id, success, UNITName, message )
}
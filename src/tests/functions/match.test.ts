import * as tttt from 'trythistrythat'
import match from '../../lib/input/functions/match'
import { OftypesError } from 'oftypes'

export default async ( id ) => {
  let success = true
  let message:undefined|string
  const UNITName = '@cli-dang/input.options.function.match rejects \nfrom @cli-dang/object.string_object()'
  let actual: undefined|OftypesError = undefined

  const result:boolean|Error = await tttt.deepStrictEqual( async() => {

    actual = await match( 'file' ).catch( error => error )
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
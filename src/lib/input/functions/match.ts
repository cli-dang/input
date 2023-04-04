import { Dang } from '@cli-dang/decors'
import { OftypesError } from 'oftypes'
import { string_to_object } from '@cli-dang/object'

export default async function match( pattern:string, single = false ):Promise<OftypesError | object>{

  return string_to_object( pattern, single ? ':' : '|' ).catch( error => {
    return new OftypesError( ` [@cli-dang/object.string_to_object] ${ Dang.red( error.message ) }` )
  } )
}

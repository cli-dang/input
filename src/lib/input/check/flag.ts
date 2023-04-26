import { null_, number_, oftype_, OftypesError, resolvers } from 'oftypes'
import { true_false } from '@cli-dang/boolean'

export default async function* check_flag<CheckFlag extends never> ( data:CheckFlag, name:string, is_void = true, type: string ):AsyncGenerator<string|object|number|boolean|null>{

  const void_truthy = ():boolean => true
  const void_falsy = ():OftypesError => new OftypesError( `♠ ${name} doesn't accept any value` )

  const data_type_check: string|object|number|boolean|null = is_void
    ? await null_( data, await resolvers( void_truthy, void_falsy ) ) as boolean|OftypesError
    : await arg_type_check( data, name, type )

  yield data_type_check

}

type ArgDataType = string|object|number|boolean|null|OftypesError
type DataType = string|object|number|boolean|null

async function arg_type_check<type>( data: type, name: string, type: string )
    : Promise<ArgDataType>{

  let data_:DataType = data as never

  if( data_ === undefined )
    return new OftypesError( `♠ ${name} can't be undefined` )

  const bool:Error|boolean = await true_false( data_ ).catch( error => error )
  if( ! ( bool instanceof Error )  )
    data_ = bool

  if( await number_( data_ ) )
    data_ = Number( data_ )

  /**
   * - void flag or any other given type.
   *
   * @example
   *
   * const app = new Command()
   *
   * // add a command to the process, and one flag
   * app.define('command')
   * await app.flag('--flag', {short:'--flag', type:'null', check: true, void: false})
   *
   * // execute the command from shell
   * 'process command --flag'
   * 'process command --flag=3000'
   */
  if( type === 'null' || data_ === null )
    return data_

  // @todo parse any opts value to set properly its type string|number|boolean. keep it simple!
  if( type === 'opts' )
    return data_
  else{
    if( await oftype_( data_ ) === type.charAt( 0 ).toUpperCase() + type.slice( 1 ) )
      return data_
  }

  return new OftypesError( `♠ ${name} doesn't accept any other type than: ${type}` )
}
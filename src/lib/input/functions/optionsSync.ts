import { string_to_objectSync } from './string_to_objectSync'

export function optionsSync( pattern:string ):OptionsType|string{

  try {
    const json_pattern = JSON.parse( pattern )
    if ( json_pattern && typeof json_pattern === 'object' )
      return pattern

  }
  catch ( error ) { /*continue*/ }

  /**
   * @ flag options should match the pattern
   * [--flag=option1:value1|option2:value2]
   * | <-- the pipe symbol is mandatory when passing a group of options to a flag.
   *
   * @type {RegExp}
   */

  const matches = Array.from( pattern.matchAll( /(.*)[|](.*)/g ), matches => matches[ 0 ] )

  let matches_single:RegExpMatchArray[]|boolean = false

  if (  matches.length === 0 ) {

    matches_single = Array.from( pattern.matchAll( /[^:]+/g ), matches => matches )

    if ( matches_single.length > 2 || matches_single.length === 0 )

      return pattern

  }

  return string_to_objectSync( matches[ 0 ] || pattern, !!matches_single )
}
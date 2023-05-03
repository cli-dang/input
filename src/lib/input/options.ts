import { number_, OftypesError } from 'oftypes'
import match from './functions/match.js'
import { error_message_text } from './functions/text/error_message.js'

export async function options( pattern: string, reference_to_flag: string ): Promise<OftypesError | Input.OptionsType> {

  let parsed_options: Input.OptionsType | undefined | OftypesError = undefined
  if ( await number_( pattern ) )
    parsed_options = error_message_text( pattern, reference_to_flag )

  else {
    /**
     * @ flag options should match the pattern
     * [--flag=option1:value1|option2:value2]
     * | <-- the pipe symbol is mandatory when passing a group of options to a flag.
     */
    const options_reg_expression: RegExp = /(.*)[|](.*)/g
    const matches: string[] = Array.from( pattern.matchAll( options_reg_expression ), ( matches: RegExpMatchArray ) => matches[ 0 ] )

    let matches_single: RegExpMatchArray[] | boolean = false

    if ( matches.length === 0 ) {

      const options_single_reg_expression = /[^:]+/g

      matches_single = Array.from( pattern.matchAll( options_single_reg_expression ), ( matches: RegExpMatchArray ) => matches )

      if ( matches_single.length > 2 || matches_single.length === 0 )
        parsed_options = error_message_text( pattern, reference_to_flag )

    }

    if ( !parsed_options )
      parsed_options = await match( matches[ 0 ] || pattern, !!matches_single ).catch( error => error )

  }

  return new Promise( ( resolve, reject ) => {
    if ( parsed_options instanceof Error )
      reject( parsed_options )

    resolve( parsed_options )
  } )
}

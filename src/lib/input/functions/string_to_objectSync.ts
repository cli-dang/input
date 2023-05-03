export function string_to_objectSync( pattern: string, single: boolean ): string | Input.OptionsType {

  const scalpel: string = single
    ? ':'
    : '|'

  const option_value_reg_expression: RegExp = new RegExp( `(.*)[${scalpel}](.*)`, 'g' )
  const body_array_expression: string[] = Array.from( pattern.matchAll( option_value_reg_expression ), ( body_value_matches: RegExpMatchArray ) => body_value_matches[ 0 ] )

  if ( typeof body_array_expression[ 0 ] === 'undefined' )

    return pattern

  const body_array: string[] = body_array_expression[ 0 ].replaceAll( scalpel, ':' )
    .split( ':' )
  if ( body_array.length % 2 !== 0 )
    return pattern

  const even: number = 0
  const property_value: Array<string[]> = []

  for ( const key in body_array ) {

    if ( even + parseInt( key ) % 2 === 0 ) {
      let value_: string = <string> body_array[ parseInt( key ) + 1 ]
      value_ = value_.length === 0
        ? undefined
        : value_
      property_value.push( Array.of( body_array[ parseInt( key ) ], value_ ) )
    }
  }

  return Object.fromEntries( property_value )
}

export function string_to_objectSync( pattern: string, single: boolean ):string|OptionsType{

  const scalpel = single ? ':' : '|'

  const option_value_reg_expression = new RegExp( `(.*)[${scalpel}](.*)`, 'g' )
  const body_array_expression = Array.from( pattern.matchAll( option_value_reg_expression ), body_value_matches => body_value_matches[ 0 ] )

  if ( typeof body_array_expression[ 0 ] === 'undefined' )

    return pattern

  const body_array = body_array_expression[ 0 ].replaceAll( scalpel, ':' )
    .split( ':' )
  if ( body_array.length % 2 !== 0 )
    return pattern

  const even = 0
  const property_value = []

  for ( const key in body_array ) {

    if ( even + parseInt( key ) % 2 === 0 ) {
      let value_ = <string>body_array[ parseInt( key ) + 1 ]
      value_ = value_.length === 0 ? undefined : value_
      property_value.push( Array.of( body_array[ parseInt( key ) ], value_ ) )
    }
  }

  return Object.fromEntries( property_value )
}
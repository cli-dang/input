import { Dang } from '@cli-dang/decors'
import { OftypesError } from 'oftypes'

export function error_message_text( pattern, reference_to_flag ){
  return new OftypesError( ` [@cli-dang/input.options] ${ Dang.red( '♠ no matched pattern found' ) }
${ Dang.magenta( '" | " <-- the pipe symbol is mandatory when passing a group of options to a flag.' ) }
@ ${ process.title } [...] ${ reference_to_flag } -> ${ Dang.underline( Dang.strong( Dang.red( pattern ) ) ) }
${ Dang.red( '                                    ^' ) }` )
}

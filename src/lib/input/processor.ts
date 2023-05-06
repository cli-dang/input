import { OftypesError } from 'oftypes'
import { optionsSync } from './functions/optionsSync.js'

export async function processor( argv: string[] ): Promise<Input.ParsedArgv | OftypesError> {

  return new Promise( ( resolve, reject ): void => {

    if ( argv === undefined )
      reject( new OftypesError( '♠ argv is undefined' ) )

    if ( argv.length === 0 )
      reject( new OftypesError( '♠ empty argv' ) )

    const arguments_array: Array<string[]> = []
    arguments_array.push( [ argv[ 0 ] ] )
    for ( const index in argv ) {

      if ( argv[ index ]?.constructor.name === 'Number' )
        reject( new OftypesError( '♠ no numbers' ) )

      if ( argv[ index ].length === 0 )
        reject( new OftypesError( '♠ no empty string.' ) )

      //@ match empty spaces
      if ( argv[ index ].match( /^\s+$/ ) )
        reject( new OftypesError( '♠ pattern does not match anything or encountered a problem.' ) )

      if ( index !== '0' ) {

        if ( argv[ index ].match( /=[^]*\s*\S*$/g ) === null )
          argv[ index ] = `${argv[ index ]}=undefined`

        const match_pattern = argv[ index ].matchAll( /(.*?)=(.*?$)/g )
        for ( const match of match_pattern ) {
          arguments_array.push( [
            match[ 1 ],
            match[ 2 ] === 'undefined' ? null : match[ 2 ],
          ] )
        }
      }
    }

    const argv_to_object: Input.ARGVtoObject<Input.expectedStringProperty> = Object.fromEntries( arguments_array )

    /**
         * Automatic recognizing the @cli-dang/input.optionsSync_private syntax
         * Mixing @cli-dang/input.options and @cli-dang/object.string_to_object and make them NOT async/Promise
         *
         * @think_it testing functionalities
         */
    for ( const [ argv_option ] of Object.entries( argv_to_object ) ) {
      if ( argv_to_object[ argv_option ] !== undefined && argv_to_object[ argv_option ] !== null ) {

        const opts: Input.OptionsType | string = optionsSync( argv_to_object[ argv_option ] )
        if ( !( opts instanceof Error ) )
          argv_to_object[ argv_option ] = opts
      }
    }

    resolve( {
      object: argv_to_object,
      keys: Object.keys( argv_to_object )
    } )
  } )
}

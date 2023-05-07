import { async_, OftypesError } from 'oftypes'
import { processor } from './processor.js'

export async function entry_point( argv: NodeJS.Process['argv'], logic: Input.LogicParameter ): Promise<Error | undefined> {

  /**
   * Remove the first two entries of the process.argv
   */
  process.argv.splice( 0, 2 )

  if ( argv === undefined )
    return Promise.reject( new OftypesError( 'argv can\'t be undefined' ) )

  if ( !await async_( logic ) )
    return Promise.reject( new OftypesError( 'logic must be AsyncFunction' ) )

  if ( logic === undefined )
    return Promise.reject( new OftypesError( 'logic can\'t be undefined' ) )

  /**
   * It is recommended to shallowly copy the argv argument because,
   * if 'process.argv' is given to the function 'entry_point()'
   * it will be changed by 'processor()', and remain unchanged during the execution of the program.
   */
  const shallow_copy_argv: string[] = Array.from( argv )

  const parsedArgv: Input.ParsedArgv = await processor( shallow_copy_argv ).catch( error => error )
  if ( parsedArgv instanceof Error )
    return Promise.reject( parsedArgv )

  const logic_result: Promise<Error | undefined> = await logic( parsedArgv ).catch( error => error )
  if ( logic_result instanceof Error )
    return Promise.reject( logic_result )

}

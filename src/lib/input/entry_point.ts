import { async_ } from 'oftypes'
import { processor } from './processor.js'

export async function entry_point( argv:string[], logic:LogicParameter ):Promise<void>{

  if( argv === undefined )
    return Promise.reject( new Error( 'argv can be undefined' ) )

  if( logic === undefined && ! await async_( logic ) )
    return Promise.reject( new Error( 'logic can be undefined' ) )
  /**
   * It is recommended to shallowly copy the object because,
   * if 'process.argv' is given to the function 'entry_point(argv:string[])'
   * it will be modified during the run of the function 'processor(argv:string[])', and
   * it will stay the same as the modification for all the running process time.
   * @type {string[]}
   */
  argv = Array.from( argv )

  const parsedArgv:ParsedArgv = await processor( argv ).catch( error => error )
  if( parsedArgv instanceof Error )
    return Promise.reject( parsedArgv )

  await logic( parsedArgv )
}
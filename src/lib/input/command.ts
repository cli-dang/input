import check_flag from './check/flag.js'
import { array_, async_, OftypesError, resolvers } from 'oftypes'
import { Dang } from '@cli-dang/decors'
import { error_code } from '@cli-dang/error'
import { exit } from '@cli-dang/activity'
import { inspect } from 'node:util'
import { processor } from './processor.js'

export class Command implements Input.InterfaceCommand{

  #_command: string | undefined
  #_help_target: { [command:string]: unknown } | string
  #_executing_command: null|string
  #_flag_reference: string
  #_executor: Input.executor
  readonly #_v_per_version: boolean
  readonly #_parsedARGV: Input.ParsedArgv
  readonly #_global_flag : Input.GlobalFlag
  readonly #_commands : Input.CommandsDefinition
  readonly #_flag_cb_executor: Input.executor_flag_cb

  constructor( parsedARGV: Input.ParsedArgv, v_per_version: boolean = false ) {
    this.#_v_per_version = v_per_version === true
    this.#_parsedARGV = parsedARGV
    this.#_command = undefined
    this.#_commands = {}
    this.#_global_flag = {}
    this.#_executing_command = null
    this.#_flag_cb_executor = {
      priority_group:{
        '0': {},
        '1': {},
        '-1': {}
      }
    }
  }

  /**
   * Debug commands.
   */
  public checkout( name?: string | undefined ): Input.checkoutCommand | Input.CommandsDefinition {

    if ( name && this.#_commands?.[ name ] )
      return this.#_commands[ name ]
    else if ( !name )
      return this.#_commands

    return undefined

  }

  /**
   * Debug global flags.
   */
  public checkout_global( name?: string | undefined ): Input.checkoutGlobal | Input.GlobalFlag {

    if ( name && this.#_global_flag?.[ name ] )
      return this.#_global_flag[ name ]
    else if ( !name )
      return this.#_global_flag

    return undefined

  }

  public async intercept(): Promise<void> {

    if ( Object.keys( this.#_parsedARGV.object ).includes( 'help' ) ) {

      this.#_help_target = this.#_parsedARGV.object
      await this.#help()

      return
    }

    if( Object.keys( this.#_parsedARGV.object ).includes( 'version' ) ) {

      const version = ( await import( `${process.cwd()}/package.json`, { assert: { type: 'json' } } ) ).default.version
      process.stdout.write( `${this.#_v_per_version ? 'v' : ''}${version}` )

      return
    }

    if( Object.keys( this.#_global_flag ).length > 0 )
      await this.#global()

    for ( const key of this.#_parsedARGV.keys ) {

      if (  this.#_commands?.[ key ] ) {

        this.#_executing_command = key
        this.#_parsedARGV.flag = {}
        this.#_parsedARGV.flag_returns = {}

        if ( this.#_parsedARGV.object?.[ key ] )
          await exit( `♠ command ${ Dang.red( key ) } doesn't accept any argument`, undefined, error_code.COMMAND )

        this.#_parsedARGV.keys.splice( this.#_parsedARGV.keys.indexOf( key ), 1 )
        delete this.#_parsedARGV.object[ key ]

        this.#_parsedARGV.command = key

        for ( const flag of Object.keys( this.#_parsedARGV.object ) ) {

          this.#_flag_reference = flag

          if ( this.#_commands[ key ]?.flags ) {
            /* - if a flag is present */
            if ( this.#_commands[ key ].flags?.[ flag ] ) {

              if( this.#_commands[ key ].flags[ flag ].conflict !== null ){
                for( const conflict of this.#_commands[ key ].flags[ flag ].conflict ){
                  if( Object.keys( this.#_parsedARGV.object ).includes( conflict ) )
                    await exit( `${flag} has conflict with ${conflict}`, undefined, error_code.FLAG )
                }
              }

              if ( this.#_commands[ key ].flags[ flag ].check ) {

                for await ( const type_check of check_flag(
                  this.#_parsedARGV.object[ flag ] as never,
                  flag,
                  this.#_commands[ key ].flags[ flag ].void,
                  this.#_commands[ key ].flags[ flag ].type
                ) ) {
                  if ( type_check instanceof Error )
                    await exit( type_check.message, undefined, error_code.FLAG )

                  this.#_parsedARGV.object[ flag ] = type_check
                  this.#_parsedARGV.flag [ flag ] = type_check

                  this.#_executor = {
                    flag_cb: this.#_commands[ key ].flags[ flag ]?.cb || null,
                    arg: type_check as string|object,
                    rest_args_cb: this.#_commands[ key ].flags[ flag ]?.rest_args || null
                  }

                  switch ( this.#_commands[ key ].flags[ flag ].priority ) {
                    case 0:
                      this.#_flag_cb_executor.priority_group[ '0' ][ flag ] = this.#_executor
                      break
                    case 1:
                      this.#_flag_cb_executor.priority_group[ '1' ][ flag ] = this.#_executor
                      break
                    case -1:
                      this.#_flag_cb_executor.priority_group[ '-1' ][ flag ] = this.#_executor
                      break
                    default:
                      await exit( 'something wrong with priority in the flag' + this.#_commands[ key ].flags[ flag ] )
                  }
                }
              }
              this.#_parsedARGV.keys.splice( this.#_parsedARGV.keys.indexOf( flag ), 1 )
            } else

              await exit( `♠ flag ${ Dang.red( flag ) } not found`, undefined, error_code.FLAG )

          }
        }
      } else
        await exit( `♠ command ${ Dang.red( key ) } not found`, undefined, error_code.COMMAND )
    }

    const flag_cb_priority_execution: Array<Input.executor> = []

    for ( const flag_execution of Object.keys( this.#_flag_cb_executor.priority_group[ '0' ] ) )
      flag_cb_priority_execution.push( this.#_flag_cb_executor.priority_group[ '0' ][ flag_execution ] )


    if ( Object.keys( this.#_flag_cb_executor.priority_group[ '1' ] ).length > 0 ) {
      for ( const flag_execution of Object.keys( this.#_flag_cb_executor.priority_group[ '1' ] ) )
        flag_cb_priority_execution.push( this.#_flag_cb_executor.priority_group[ '1' ][ flag_execution ] )
    }

    if ( Object.keys( this.#_flag_cb_executor.priority_group[ '-1' ] ).length > 0 ) {
      for ( const flag_execution of Object.keys( this.#_flag_cb_executor.priority_group[ '-1' ] ) )
        flag_cb_priority_execution.push( this.#_flag_cb_executor.priority_group[ '-1' ][ flag_execution ] )
    }

    for ( const flag_object of flag_cb_priority_execution ) {
      if ( flag_object.flag_cb !== null ) {

        let flag_cb_returns: unknown|undefined

        if( await async_( flag_object.flag_cb ) ){
          flag_cb_returns = await flag_object.flag_cb( flag_object.arg, ...flag_object.rest_args_cb )
          if( flag_cb_returns !== undefined )
            this.#_parsedARGV.flag_returns[ this.#_flag_reference ] = flag_cb_returns

        }else{
          flag_cb_returns = flag_object.flag_cb( flag_object.arg, ...flag_object.rest_args_cb )
          if( flag_cb_returns !== undefined )
            this.#_parsedARGV.flag_returns[ this.#_flag_reference ] = flag_cb_returns
        }
      }
    }

    if( this.#_commands[ this.#_executing_command ]?.cb ) {
      if ( await async_( this.#_commands[ this.#_executing_command ].cb ) )
        await this.#_commands[ this.#_executing_command ].cb( this.#_parsedARGV, ...( this.#_commands[ this.#_executing_command ].rest_args ) )
      else
        this.#_commands[ this.#_executing_command ].cb( this.#_parsedARGV, ...( this.#_commands[ this.#_executing_command ].rest_args ) )
    }

  }

  public async define(
    name: string,
    cb: Input.CommandCallBack,
    info: Input.Help = { description:'no description', usage:'no usage' },
    global: boolean = false,
    global_type: Input.GlobalFlagType = 'string',
    rest_args: Input.RestArgsCallbacks = []
  ): Promise<ReferenceError|void> {

    this.#_command = name

    if( global ){
      this.#_global_flag[ name ] = {
        cb: cb,
        rest_args: rest_args,
        type: global_type,
        description: info.description,
        usage: info.usage
      }
    }

    else {
      if ( this.#_commands[ this.#_command ] )
        return Promise.reject( ReferenceError( `command [${this.#_command}] already defined.` ) )
      else {
        this.#_commands[ name ] = {
          flags: {},
          cb: cb,
          rest_args: rest_args,
          description: info.description,
          usage: info.usage
        }
      }
    }
  }

  public async flag( name: string|string[], descriptor: Input.FlagDescriptor ):Promise<void> {

    const truthy = (): void => {
      for ( const alias of name )
        this.#define_flag( alias, descriptor )

    }
    const falsy = (): void => {
      this.#define_flag( name as string, descriptor )
    }

    await array_( name, await resolvers( truthy, falsy ) )
  }

  #define_flag( name: string, descriptor: Input.FlagDescriptor ): void {
    this.#_commands[ this.#_command ].flags[ name ] = {
      short: descriptor.short,
      priority: descriptor.priority || 0,
      long: descriptor.long || null,
      conflict: descriptor.conflict || null,
      description: descriptor.description || null,
      usage: descriptor.usage || null,
      void: descriptor.void || false,
      type: descriptor.type || 'string',
      check: descriptor.check || false,
      cb: descriptor.cb || null,
      rest_args: descriptor.rest_args || []
    }
  }

  async #global(): Promise<void>{

    let parameter: string|Input.ParsedArgv = this.#_parsedARGV

    for( const key of this.#_parsedARGV.keys ){

      const parsed_global: Input.ParsedArgv | OftypesError = await processor( [ 'global', key ] ).catch( error => error )

      if( !( parsed_global instanceof OftypesError ) ) {
        if ( key.match( '=' ) )
          parameter = key.replace( parsed_global.keys[ 1 ], '' ).replace( '=', '' )

        if ( Object.keys( this.#_global_flag ).includes( parsed_global.keys[ 1 ] ) ) {

          if ( this.#_global_flag[ parsed_global.keys[ 1 ] ]?.cb ) {

            const data = this.#_global_flag[ parsed_global.keys[ 1 ] ].type === 'opts'
              ? parsed_global
              : this.#_global_flag[ parsed_global.keys[ 1 ] ].type === 'string'
                ? parameter
                : this.#_parsedARGV

            if ( await async_( this.#_global_flag[ parsed_global.keys[ 1 ] ].cb ) )

              await this.#_global_flag[ parsed_global.keys[ 1 ] ].cb( data, ...this.#_global_flag[ parsed_global.keys[ 1 ] ].rest_args )

            else
              this.#_global_flag[ parsed_global.keys[ 1 ] ].cb( data, ...this.#_global_flag[ parsed_global.keys[ 1 ] ].rest_args )

          }

          this.#_parsedARGV.keys.splice( this.#_parsedARGV.keys.indexOf( key ), 1 )
          delete this.#_parsedARGV.object[ key ]
        }
      }
    }
  }

  /**
   * @example `exec help --view=command:--flag|-f` to retrieve the manual entry of the flag related to the selected command
   * @example `exec help --view=command` to retrieve the manual entry related to the selected command
   * @example `exec help --view=--global-flag` to retrieve the manual entry related to the selected global flag
   *
   * @private
   */
  #help():void{

    if( this.#_help_target[ '--view' ] ) {
      if ( this.#_help_target[ '--view' ].constructor.name === 'String' && this.#_commands[  this.#_help_target[ '--view' ] ] ) {
        process.stdout.write( `${ this.#_commands[ this.#_help_target[ '--view' ] ].description }\n` )
        process.stdout.write( `${ this.#_commands[ this.#_help_target[ '--view' ] ].usage }\n` )
      }
      else if ( this.#_help_target[ '--view' ].constructor.name === 'String' && this.#_global_flag[  this.#_help_target[ '--view' ] ] ) {
        process.stdout.write( `${ this.#_global_flag[ this.#_help_target[ '--view' ] ].description }\n` )
        process.stdout.write( `${ this.#_global_flag[ this.#_help_target[ '--view' ] ].usage }\n` )
      }
      else if(
        this.#_help_target[ '--view' ].constructor.name === 'Object' &&
        this.#_commands[ Object.keys( this.#_help_target[ '--view' ] )[ 0 ] ] &&
        this.#_commands[ Object.keys( this.#_help_target[ '--view' ] )[ 0 ] ].flags[ this.#_help_target[ '--view' ][ Object.keys( this.#_help_target[ '--view' ] )[ 0 ] ] ]
      ) {
        process.stdout.write( `${ this.#_commands[ Object.keys( this.#_help_target[ '--view' ] )[ 0 ] ].flags[ this.#_help_target[ '--view' ][ Object.keys( this.#_help_target[ '--view' ] )[ 0 ] ] ].description }\n` )
        process.stdout.write( `${ this.#_commands[ Object.keys( this.#_help_target[ '--view' ] )[ 0 ] ].flags[ this.#_help_target[ '--view' ][ Object.keys( this.#_help_target[ '--view' ] )[ 0 ] ] ].usage }\n` )
      }
      else
        process.stderr.write( `♠ command|flag|global-flag not found given --view: ${ inspect( this.#_help_target[ '--view' ] ) }\n` )
    }
    else {
      process.stderr.write( '`exec help --view=command:--flag` to retrieve the manual page entry of the flag related to selected command\n' )
      process.stderr.write( '`exec help --view=command` to retrieve the manual page entry related to the selected command\n' )
      process.stderr.write( '`exec help --view=--global-flag` to retrieve the manual page entry related to the selected global flag\n' )
    }
  }
}

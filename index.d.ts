import { OftypesError } from 'oftypes'

export declare function entry_point( argv: NodeJS.Process['argv'], logic: Input.LogicParameter ): Promise<Error | undefined>;

export declare function options( pattern: string, reference_to_flag: string ): Promise<OftypesError | Input.OptionsType>;

export declare function processor( argv: string[] ): Promise<Input.ParsedArgv | OftypesError>;

declare global {

  namespace Input {
    type OptionsType = {
      [ p: string ]: string
    }

    interface expectedStringProperty {
      [ p: string ]: string
    }

    interface expectedOptionsTypeProperty {
      [ p: string ]: Input.OptionsType
    }

    type ARGVtoObject<T> = T extends Input.expectedOptionsTypeProperty & Input.expectedStringProperty
      ? Input.OptionsType
      : ParsedArgv

    type ParsedArgv = {
      object: {
        [ p: string ]: unknown
      },
      keys: string[],
      flag?: object | string,
      command?: string,
      flag_returns?: unknown
    }
    type RestArgsCallbacks = Array<boolean | string | object | number>
    type LogicParameter = ( data: ParsedArgv ) => Promise<Error | void>

    interface Help {
      description: string | null,
      usage: string | null
    }

    type FlagType = 'string' | 'boolean' | 'number' | 'opts' | 'json' | 'buf' | 'null'
    type GlobalFlagType = 'string' | 'boolean' | 'number' | 'opts' | 'json' | 'buf' | 'null'
    type FlagDescriptor = {
      short: string
      priority?: number
      long?: string | null
      conflict?: string[] | null
      description?: Help['description']
      usage?: Help['usage']
      void?: boolean | null
      type?: FlagType | null
      check?: boolean | null
      cb?: FlagsCallBack,
      rest_args?: RestArgsCallbacks
    }
    type FlagsCallBack =
      ( <cb>( data: cb, ...rest_args: RestArgsCallbacks ) => Promise<void> | void | Promise<cb> | cb )
      | null

    type CommandCallBack =
      ( <cb>( data: cb | Input.ParsedArgv, ...rest_args: RestArgsCallbacks ) => Promise<void> | void | Promise<cb> | cb )
      | null
    type CommandsDefinition = {
      [ command_name: string ]: {
        flags?: {
          [ flag_name: string ]: FlagDescriptor
        } | null,
        cb: CommandCallBack,
        rest_args?: RestArgsCallbacks,
        description: string,
        usage: string
      }
    }
    type GlobalFlag = {
      [ name: string ]: {
        cb?: CommandCallBack,
        rest_args?: RestArgsCallbacks,
        type?: GlobalFlagType,
        description?: string,
        usage?: string
      }
    }
    type checkoutCommand = {
      flags?: {
        [ p: string ]: FlagDescriptor
      }
    }

    type checkoutGlobal = {
      cb?: CommandCallBack,
      rest_args?: RestArgsCallbacks,
      type?: GlobalFlagType,
      description?: string,
      usage?: string
    }

    type executor = {
      flag_cb: FlagsCallBack,
      arg: string | object,
      rest_args_cb: RestArgsCallbacks,
    }

    type executor_flag_cb = {
      priority_group: {
        '0': {
          [ flag: string ]: executor
        },
        '1': {
          [ flag: string ]: executor
        },
        '-1': {
          [ flag: string ]: executor
        }
      }
    }

    interface InterfaceCommand {
      checkout( name?: string | undefined ): Input.checkoutCommand | Input.CommandsDefinition;

      checkout_global( name?: string | undefined ): Input.checkoutGlobal | Input.GlobalFlag;

      intercept(): Promise<void>;

      define( name: string, cb: Input.CommandCallBack, info?: Input.Help, global?: boolean, global_type?: Input.GlobalFlagType, rest_args?: Input.RestArgsCallbacks ): Promise<ReferenceError | void>;

      flag( name: string | ArrayMaxLength2, descriptor: Input.FlagDescriptor ): Promise<void>;
    }
  }

}

export declare type ArrayMaxLength2 = [ string, string? ];

export declare class Command
implements Input.InterfaceCommand {
  constructor( parsedARGV: Input.ParsedArgv, v_per_version?: boolean );

  checkout( name?: string | undefined ): Input.checkoutCommand | Input.CommandsDefinition;

  checkout_global( name?: string | undefined ): Input.checkoutGlobal | Input.GlobalFlag;

  intercept(): Promise<void>;

  define( name: string, cb: Input.CommandCallBack, info?: Input.Help, global?: boolean, global_type?: Input.GlobalFlagType, rest_args?: Input.RestArgsCallbacks ): Promise<ReferenceError | void>;

  // - method overloading
  flag( name: string | ArrayMaxLength2, descriptor: Input.FlagDescriptor ): Promise<void>;
  flag( name: ArrayMaxLength2, descriptor: Input.FlagDescriptor ): Promise<void>;
  flag( name: string, descriptor: Input.FlagDescriptor ): Promise<void>;
}
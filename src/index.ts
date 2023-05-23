import { ArrayMaxLength2 } from '../index.js'

export { entry_point } from './lib/input/entry_point.js'
export { options } from './lib/input/options.js'
export { processor } from './lib/input/processor.js'
export { Command } from './lib/input/command.js'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare class Command
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
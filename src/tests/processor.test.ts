import * as assert from 'node:assert'
import * as tttt from 'trythistrythat'
import { processor } from '../lib/input/processor.js'

export default async ( id ) => {

  let success = true
  let message:undefined|string = undefined
  const UNITName = '@cli-dang/input.processor'

  const result:boolean|Error = await tttt.deepStrictEqual( async() => {

    const actual = await processor( [ 'code', '--file-test=string.txt', '--json={"string":"failed"}' ] ).catch( error => error.message )
    const expected = { object: {
      code: undefined,
      '--file-test': 'string.txt',
      '--json': '{"string":"failed"}'
    }, keys: [ 'code', '--file-test', '--json' ] }

    return tttt.resolvers( actual, expected )
  } )

  if( result instanceof Error ){
    tttt.failed( UNITName )
    success = false
    message = result.message
  }

  tttt.end( id, success, UNITName, message )
}

export async function rejects_undefined_argv( id ){

  let success = true
  let message:undefined|string = undefined
  const UNITName = '@cli-dang/input.processor rejects undefined argv'

  try{
    // @ts-ignore: @test
    await assert.rejects( processor(),
      ( error:Error ) => {

        assert.deepStrictEqual( error.message, '♠ argv is undefined' )

        return true
      }
    )
  }catch ( AssertionError ) {

    tttt.failed( UNITName )
    success = false
    message = AssertionError.message
  }

  tttt.end( id, success, UNITName, message )
}

export async function rejects_empty_argv( id ){

  let success = true
  let message:undefined|string = undefined
  const UNITName = '@cli-dang/input.processor rejects empty argv'

  try{
    await assert.rejects( processor( [] ),
      ( error:Error ) => {

        assert.deepStrictEqual( error.message, '♠ empty argv' )

        return true
      }
    )
  }catch ( AssertionError ) {

    tttt.failed( UNITName )
    success = false
    message = AssertionError.message
  }

  tttt.end( id, success, UNITName, message )
}

export async function rejects_empty_argv_element( id ){

  let success = true
  let message:undefined|string = undefined
  const UNITName = '@cli-dang/input.processor rejects empty argv element'

  try{
    await assert.rejects( processor( [ ' ' ] ),
      ( error:Error ) => {

        assert.deepStrictEqual( error.message, '♠ pattern does not match anything or encountered a problem.' )

        return true
      }
    )
  }catch ( AssertionError ) {

    tttt.failed( UNITName )
    success = false
    message = AssertionError.message
  }

  tttt.end( id, success, UNITName, message )
}

export async function rejects_empty_argv_string_element( id ){

  let success: boolean = true
  let message:undefined|string = undefined
  const UNITName: string = '@cli-dang/input.processor rejects empty argv string element'

  try{
    await assert.rejects( processor( [ '' ] ),
      ( error:Error ) => {

        assert.deepStrictEqual( error.message, '♠ no empty string.' )

        return true
      }
    )
  }catch ( AssertionError ) {

    tttt.failed( UNITName )
    success = false
    message = AssertionError.message
  }

  tttt.end( id, success, UNITName, message )
}

export async function rejects_argv_number( id ){

  let success = true
  let message:undefined|string = undefined
  const UNITName = '@cli-dang/input.processor rejects argv number'

  try{
    // @ts-ignore: @test
    await assert.rejects( processor( [ 0 ] ),
      ( error:Error ) => {

        assert.deepStrictEqual( error.message, '♠ no numbers' )

        return true
      }
    )
  }catch ( AssertionError ) {

    tttt.failed( UNITName )
    success = false
    message = AssertionError.message
  }

  tttt.end( id, success, UNITName, message )
}

export async function argv_with_options_syntax( id ){

  let success = true
  let message:undefined|string = undefined
  const UNITName = '@cli-dang/input.processor argv with options syntax'

  const result:boolean|Error = await tttt.deepStrictEqual( async () => {

    const actual: Input.ParsedArgv = await processor( [ 'bim', '--table=gin:drink-it' ] ).catch( error => error )
    const expected = { object:{ '--table':{ gin:'drink-it' }, bim: undefined }, keys:[ 'bim', '--table' ] }

    return tttt.resolvers( actual, expected )
  } )

  if( result instanceof Error ){
    success = false
    message = result.message
  }

  tttt.end( id, success, UNITName, message )
}

export async function match_empty_flag( id ){

  let success = true
  let message:undefined|string = undefined
  const UNITName = '@cli-dang/input.processor match empty flag'

  const result:boolean|Error = await tttt.deepStrictEqual( async () => {

    const actual: Input.ParsedArgv = await processor( [ 'bim', '--gastro' ] ).catch( error => error )
    const expected = { object: { '--gastro': null, bim: undefined }, keys:[ 'bim', '--gastro' ] }

    return tttt.resolvers( actual, expected )
  } )

  if( result instanceof Error ){
    success = false
    message = result.message
  }

  tttt.end( id, success, UNITName, message )
}
import * as tttt from 'trythistrythat'
import { AssertionError } from 'assert'
import { options } from '../lib/input/options.js'
import { trace, trace_options } from '@cli-dang/activity'

export default async ( id ) => {
  let success = true
  let message:undefined|string
  const UNITName = '@cli-dang/input.options'
  let actual:string|object
  const result:boolean|AssertionError = await tttt.deepStrictEqual( async() => {

    actual = await options( 'file:index.php|socket:active', '--php-server-on' ).catch( error => error.message )
    const expected = {
      file: 'index.php',
      socket: 'active'
    }

    return tttt.resolvers( actual, expected )
  } )

  if( result instanceof Error ){
    tttt.failed( UNITName )
    success = false
    message = result.message
  }else {
    trace_options.mute = true
    message = <string> await trace( actual ).catch( error => error.message )
  }

  tttt.end( id, success, UNITName, message )
}

export async function options_no_pipe_symbol( id ){

  let success = true
  let message:undefined|string
  const UNITName = '@cli-dang/input.options rejects no pipe symbol'
  let actual:Error|undefined = undefined

  const result:boolean|AssertionError = await tttt.deepStrictEqual( async() => {

    actual = await options( 'file:index.php:socket:active', '--php-server-on' ).catch( error => error )
    const expected = true

    return tttt.resolvers( actual instanceof Error, expected )
  } )

  if( result instanceof Error ){
    tttt.failed( UNITName )
    success = false
    message = result.message
  }else
    message = actual.message


  tttt.end( id, success, UNITName, message )
}

export async function options_match_single( id ){

  let success = true
  let message:undefined|string
  const UNITName = '@cli-dang/input.options match single option undefined'
  let actual:Error|undefined|object = undefined

  const result:boolean|AssertionError = await tttt.deepStrictEqual( async() => {

    actual = await options( 'file:', '--php-server-on' ).catch( error => error )
    const expected = { file: undefined }

    return tttt.resolvers( actual, expected )
  } )

  if( result instanceof Error ){
    tttt.failed( UNITName )
    success = false
    message = result.message
  }else {
    trace_options.mute = true
    message = <string> await trace( actual ).catch( error => error.message )
  }

  tttt.end( id, success, UNITName, message )
}

export async function options_no_options_given( id ){

  let success = true
  let message:undefined|string
  const UNITName = '@cli-dang/input.options rejects no options given'
  let actual:Error|undefined = undefined

  const result:boolean|AssertionError = await tttt.deepStrictEqual( async() => {

    actual = await options( '', '--php-server-on' ).catch( error => error )
    const expected = true

    return tttt.resolvers( actual instanceof Error, expected )
  } )

  if( result instanceof Error ){
    tttt.failed( UNITName )
    success = false
    message = result.message
  }else
    message = actual.message


  tttt.end( id, success, UNITName, message )
}

export async function options_single_number_no_colon( id ){

  let success = true
  let message:undefined|string
  const UNITName = '@cli-dang/input.options rejects when literal number are given\nnot followed by a colon'
  let actual:Error|undefined = undefined

  const result:boolean|AssertionError = await tttt.deepStrictEqual( async() => {

    actual = await options( '3', '--php-server-on' ).catch( error => error )
    const expected = true

    return tttt.resolvers( actual instanceof Error, expected )
  } )

  if( result instanceof Error ){
    tttt.failed( UNITName )
    success = false
    message = result.message
  }else
    message = actual.message


  tttt.end( id, success, UNITName, message )
}
import {applyDecorators} from '@nestjs/common'
import {ApiResponse} from '@nestjs/swagger'
import code from '../config/code'
import {capitalize, startCase} from 'lodash'

export const ApiErrorResponse = (error: string | object) => {
    if (!error) error = 'BAD_REQUEST'
    let _code = code.BACKEND.code
    if (typeof error === 'string') {
        if (code.hasOwnProperty(error)) {
            _code = code[error].code
        } else {
            _code = code.BACKEND.code
        }
    } else if (typeof error === 'object') {
        _code = error['code']
    }

    const properties = {
        code: {type: 'number', example: _code},
        success: {type: 'bool', example: false},

    }
    if (_code == code.VALIDATION_ERROR.code) {
        properties['errors'] = {
            type: 'array',
            items: {
                properties: {
                    property: {type: 'string', example: 'attribute'},
                    rule: {type: 'string', example: 'required', description: 'aabbc'},
                },
            },
        }
    } else {
        properties['msg'] = {
            type: 'string',
            default: error && error['type'] ? capitalize(startCase(error['type'])) : 'string',
        }
    }

    return applyDecorators(
        ApiResponse({
            status: _code,
            schema: {
                properties,
            },
        }),
    )
}
import { applyDecorators, Type } from '@nestjs/common'
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger'

export const ApiSuccessResponse = <TModel extends Type<any>>(
    data: { type: TModel, description?: string }) => {

    return applyDecorators(
        ApiOkResponse({
            schema: {
                properties: {
                    code: { type: 'number', example: 0 },
                    success: { type: 'bool', example: true },
                    data: {
                        $ref: getSchemaPath(data.type)
                    }
                }
            },
            description: data.description
        })
    )
}

export const ArrayApiSuccessResponse = <TModel extends Type<any>>(
    data: { type: TModel, description?: string }) => {

    return applyDecorators(
        ApiOkResponse({
            schema: {
                properties: {
                    code: { type: 'number', example: 0 },
                    success: { type: 'bool', example: true },
                    data: {
                        type: 'array',
                        items: {
                            $ref: getSchemaPath(data.type),
                        }
                    }
                }
            },
            description: data.description
        })
    )
}

export const StringApiSuccessResponse = () => {

    return applyDecorators(
        ApiOkResponse({
            schema: {
                properties: {
                    code: { type: 'number', example: 0 },
                    success: { type: 'bool', example: true },
                    data: { type: 'string', example: "Done" }
                }
            },
            description: ''
        })
    )
}
import { ArgumentMetadata, HttpException, Injectable, PipeTransform } from "@nestjs/common";
import { UtilsProvider } from "src/utils/provider";
import { SendResponse } from "src/utils/send-response";

@Injectable()
export class escapeHTMLpipe implements PipeTransform<object, object> {

    transform(value: object, metadata: ArgumentMetadata): object {
        value = UtilsProvider.EscapeHtmlBody(value);
        return value;
    }
}



@Injectable()
export class maxPagiParam implements PipeTransform<object, object> {

    transform(value: object, metadata: ArgumentMetadata): object {
        if (value['page']) {
            throw new HttpException(SendResponse.error('VALIDATION'), 200);
        }
        if (value['perPage']) {
            throw new HttpException(SendResponse.error('VALIDATION'), 200);
        }
        return value;
    }
}


@Injectable()
export class unEscapeHTMLpipe implements PipeTransform<object, object> {

    transform(value: object, metadata: ArgumentMetadata): object {
        value = UtilsProvider.UnEscapeHtmlBody(value);
        return value;
    }
}
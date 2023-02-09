import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UtilsProvider } from 'src/utils/provider';

@Injectable()
export class unEscapeHTMLInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        tap((res) =>
          res.data ? UtilsProvider.UnEscapeHtmlBody(res.data) : res,
        ),
      );
  }
}

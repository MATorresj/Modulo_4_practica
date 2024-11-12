import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RemovePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((user) => {
            const { password, ...userResponse } = user;
            return userResponse;
          });
        } else if (data && typeof data === 'object') {
          const { password, ...userResponse } = data;
          return userResponse;
        }
        return data;
      })
    );
  }
}

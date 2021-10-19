import { Observable } from 'rxjs';
import detect from './detect';
import GrpCurlCommand from '../../models/GrpCurlCommand';
import GrpcTypeRegistry from '../../registry/registry';

export default function introspection(command: GrpCurlCommand, url = 'localhost:9999'): Observable<GrpcTypeRegistry> {
  return new Observable((subscriber) => {
    detect(command, url)
      .then(
        (registry) => {
          subscriber.next(registry);
        },
        (rejected) => {
          subscriber.error(rejected);
        },
      )
      .catch((reason) => {
        subscriber.error(reason);
      });
  });
}

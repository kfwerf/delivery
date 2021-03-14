import {Observable} from "rxjs";
import grpcurl from '../../cli/grpcurl';


export default function send(url: string, method: string, body: string) {
    return new Observable((subscriber) => {
        grpcurl.send(body, url, method).then((response) => {
            if (!response.hasError()) {
                subscriber.next(response);
            } else {
                subscriber.error(response);
            }
        }, (rejected) => {
            subscriber.error(rejected);
        });
    });
}
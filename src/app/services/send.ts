import {Observable} from "rxjs";
import grpcurl from '../../cli/grpcurl';
import GrpCurlCommand from "../../models/GrpCurlCommand";


export function send(url: string, method: string, body: string) {
    return new Observable((subscriber) => {
        grpcurl.send(body, url, method).getResponse().then((response) => {
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

export function command(command: GrpCurlCommand) {
    return new Observable((subscriber) => {
        grpcurl.command(command).getResponse().then((response) => {
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

export default {
    send,
    command,
}
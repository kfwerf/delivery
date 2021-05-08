import {Observable} from "rxjs";
import detect from "./detect";
import GrpCurlCommand from "../../models/GrpCurlCommand";

export default function introspection(command: GrpCurlCommand, url: string = 'localhost:9999') {
    return new Observable((subscriber) => {
        detect(command, url).then((registry) => {
            subscriber.next(registry);
        }, (rejected) => {
            subscriber.error(rejected);
        });
    });
}

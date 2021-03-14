import {Observable} from "rxjs";
import detect from "./detect";

export default function introspection(url: string = 'localhost:9999') {
    return new Observable((subscriber) => {
        detect(url).then((registry) => {
            subscriber.next(registry);
        }, (rejected) => {
            subscriber.error(rejected);
        });
    });
}

import {getRpcList, getRpcMessage, getRpcName} from "../../deserialization/rpc";
import GrpCurlResponse from "../../models/GrpCurlResponse";

const service = new GrpCurlResponse('', '', `
    com.delivery.v1.messages.MessageService is a service:
    service MessageService {
      rpc getMessages ( .com.delivery.v1.messages.BatchMessagesRequest ) returns ( .com.delivery.v1.messages.BatchMessagesResponse );
      rpc getTexts ( .com.delivery.v1.messages.BatchTextsRequest ) returns ( .com.delivery.v1.messages.BatchTextsResponse );
      rpc GetLetters ( .com.delivery.v1.messages.BatchLettersRequest ) returns ( .com.delivery.v1.messages.BatchLettersRequest );
    }
    `);

test('service rpc list is extracted from response', () => {
    const rpcList = getRpcList(service);
    expect(rpcList).toStrictEqual([
        'rpc getMessages ( .com.delivery.v1.messages.BatchMessagesRequest ) returns ( .com.delivery.v1.messages.BatchMessagesResponse );',
        'rpc getTexts ( .com.delivery.v1.messages.BatchTextsRequest ) returns ( .com.delivery.v1.messages.BatchTextsResponse );',
        'rpc GetLetters ( .com.delivery.v1.messages.BatchLettersRequest ) returns ( .com.delivery.v1.messages.BatchLettersRequest );'
    ]);
});

test('rpc response/request types are extracted', () => {
    const rpc = 'rpc getMessages ( .com.delivery.v1.messages.BatchMessagesRequest ) returns ( .com.delivery.v1.messages.BatchMessagesResponse );';
    const [request, response] = getRpcMessage(rpc);
    expect(request).toBe('.com.delivery.v1.messages.BatchMessagesRequest');
    expect(response).toBe('.com.delivery.v1.messages.BatchMessagesResponse');
});

test('rpc name is extracted', () => {
    const rpc = 'rpc getMessages ( .com.delivery.v1.messages.BatchMessagesRequest ) returns ( .com.delivery.v1.messages.BatchMessagesResponse );';
    const name = getRpcName(rpc);
    expect(name).toBe('getMessages');
});
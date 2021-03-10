import GrpcService from "../../models/GrpcService";
import GrpCurlResponse from "../../models/GrpCurlResponse";

const service = new GrpcService(new GrpCurlResponse('', '', `
    com.delivery.v1.messages.MessageService is a service:
    service MessageService {
      rpc getMessages ( .com.delivery.v1.messages.BatchMessagesRequest ) returns ( .com.delivery.v1.messages.BatchMessagesResponse );
      rpc getTexts ( .com.delivery.v1.messages.BatchTextsRequest ) returns ( .com.delivery.v1.messages.BatchTextsResponse );
      rpc GetLetters ( .com.delivery.v1.messages.BatchLettersRequest ) returns ( stream .com.delivery.v1.messages.BatchLettersRequest );
    }
    `));

test('path to match the name', () => {
    expect(service.getPath()).toBe('com.delivery.v1.messages.MessageService');
});

test('rpcs to match the underlying rpcs', () => {
    const rpcList = service.getRpcList();
    const firstRpc = rpcList[0];
    const secondRpc = rpcList[1];
    const thirdRpc = rpcList[2];
    expect(firstRpc.getRequest()).toBe('com.delivery.v1.messages.BatchMessagesRequest');
    expect(secondRpc.getRequest()).toBe('com.delivery.v1.messages.BatchTextsRequest');
    expect(thirdRpc.getRequest()).toBe('com.delivery.v1.messages.BatchLettersRequest');
});

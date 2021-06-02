import {getRequestsFromServices, getTypeNames} from "../../utils/extract";
import GrpcService from "../../models/GrpcService";
import GrpCurlResponse from "../../models/GrpCurlResponse";

test('extracts requests from a list of services', () => {
    const serviceOne = new GrpCurlResponse('', '', `
    com.delivery.v1.messages.MessageService is a service:
    service MessageService {
      rpc getMessages ( .com.delivery.v1.messages.BatchMessagesRequest ) returns ( .com.delivery.v1.messages.BatchMessagesResponse );
      rpc getTexts ( .com.delivery.v1.messages.BatchTextsRequest ) returns ( .com.delivery.v1.messages.BatchTextsResponse );
      rpc GetLetters ( .com.delivery.v1.messages.BatchLettersRequest ) returns ( stream .com.delivery.v1.messages.BatchLettersRequest );
    }
    `);
    const serviceTwo = new GrpCurlResponse('', '', `
    com.delivery.v1.messages.PhoneService is a service:
    service PhoneService {
      rpc getRings ( .com.delivery.v1.messages.BatchRingsRequest ) returns ( .com.delivery.v1.messages.BatchRingsResponse );
      rpc getVoices ( .com.delivery.v1.messages.BatchVoicesRequest ) returns ( stream .com.delivery.v1.messages.BatchVoicesResponse );
      rpc GetFaxes ( .com.delivery.v1.messages.BatchFaxesRequest ) returns ( .com.delivery.v1.messages.BatchFaxesRequest );
    }
    `);
    const serviceThree = new GrpCurlResponse('', '', `
    com.delivery.v1.messages.MessageService is a service:
    service HealthService {
      rpc Check ( .com.delivery.v1.messages.HealthRequest ) returns ( .com.delivery.v1.messages.HealthResponse );
      rpc Watch ( .com.delivery.v1.messages.HealthRequest ) returns ( stream .com.delivery.v1.messages.HealthResponse );
    }
    `);

    const list = [
        new GrpcService(serviceOne),
        new GrpcService(serviceTwo),
        new GrpcService(serviceThree),
    ];

    const requests = getRequestsFromServices(list);

    expect(requests).toStrictEqual([
        'com.delivery.v1.messages.BatchMessagesRequest',
        'com.delivery.v1.messages.BatchTextsRequest',
        'com.delivery.v1.messages.BatchLettersRequest',
        'com.delivery.v1.messages.BatchRingsRequest',
        'com.delivery.v1.messages.BatchVoicesRequest',
        'com.delivery.v1.messages.BatchFaxesRequest',
        'com.delivery.v1.messages.HealthRequest',
    ]);
});

test('extracts type names from a input', () => {
    const types = getTypeNames('map<.com.delivery.v1.messages.EntityType, .google.protobuf.FieldMask> fieldmask_map = 2;');
    expect(types).toStrictEqual([
        '.com.delivery.v1.messages.EntityType',
        '.google.protobuf.FieldMask'
    ]);
});
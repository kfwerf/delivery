// list service
import GrpCurlResponse from '../../models/GrpCurlResponse';
import { toServiceList, getServicePath } from '../../deserialization/service';

const list = new GrpCurlResponse(
  '',
  '',
  `
    grpc.health.v1.Health
    grpc.reflection.v1alpha.ServerReflection
    com.delivery.v1.messages.MessageService
    com.delivery.v1.post.PostalService
    `,
);

const service = new GrpCurlResponse(
  '',
  '',
  `
    com.delivery.v1.messages.MessageService is a service:
    service MessageService {
      rpc getMessages ( .com.delivery.v1.messages.BatchMessagesRequest ) returns ( .com.delivery.v1.messages.BatchMessagesResponse );
      rpc getTexts ( .com.delivery.v1.messages.BatchTextsRequest ) returns ( .com.delivery.v1.messages.BatchTextsResponse );
      rpc GetLetters ( .com.delivery.v1.messages.BatchLettersRequest ) returns ( stream .com.delivery.v1.messages.BatchLettersRequest );
    }
    `,
);
// list service
test('removes line padding and splits service list to lines', () => {
  const parsed = toServiceList(list);

  expect(parsed).toStrictEqual([
    'grpc.health.v1.Health',
    'grpc.reflection.v1alpha.ServerReflection',
    'com.delivery.v1.messages.MessageService',
    'com.delivery.v1.post.PostalService',
  ]);
});

// describe service
test('service path is extracted from response', () => {
  const servicePath = getServicePath(service);
  expect(servicePath).toBe('com.delivery.v1.messages.MessageService');
});

import GrpCurlResponse from '../../models/GrpCurlResponse';
import GrpcMessage from '../../models/GrpcMessage';
import GrpcRegistry from '../../registry/registry';

const message = new GrpcMessage(
  new GrpCurlResponse(
    '',
    '',
    `
    com.delivery.v1.messages.BatchRequest is a message:
    message BatchRequest {
        repeated string ids = 1;
        map<string, .google.protobuf.FieldMask> fieldmask_map = 2;
        .com.delivery.v1.messages.EntityType type_filter = 3;
        .google.protobuf.FieldMask field_mask = 4;
        oneof user {
          .com.delivery.v1.messages.RegisteredUser authenticated_user = 5;
          .com.delivery.v1.messages.AnonymousUser anonymous_user = 6;
        }
        .com.delivery.v1.messages.PaginationRequest page_request = 7;
    }
`,
  ),
);

const errorMessage = new GrpcMessage(
  new GrpCurlResponse(
    '/grpcurl -plaintext -max-time 5 localhost:9999 describe com.delivery.v1.messages.AnonymousUser',
    'I have errored',
    '',
  ),
);

const fieldMaskMessage = new GrpcMessage(
  new GrpCurlResponse(
    '',
    '',
    `
    google.protobuf.FieldMask is a message:
    message FieldMask {
        repeated string paths = 1;
    }
`,
  ),
);

const entityTypeMessage = new GrpcMessage(
  new GrpCurlResponse(
    '/grpcurl -plaintext -max-time 5 localhost:9999 describe com.delivery.v1.messages.EntityType',
    'I errored',
    '',
  ),
);

const registeredUserMessage = new GrpcMessage(
  new GrpCurlResponse(
    '',
    '',
    `
    com.delivery.v1.messages.RegisteredUser is a message:
    message RegisteredUser {
        float uid = 1;
        string locale = 2;
        com.delivery.v1.messages.Country country = 3;
        bool has_vpn = 4;
    }
`,
  ),
);

const paginationRequestMessage = new GrpcMessage(
  new GrpCurlResponse(
    '',
    '',
    `
    com.delivery.v1.messages.PaginationRequest is a message:
    message PaginationRequest {
        repeated com.delivery.v1.messages.Page pages = 1;
    }
`,
  ),
);

const pageMessage = new GrpcMessage(
  new GrpCurlResponse(
    '',
    '',
    `
    com.delivery.v1.messages.Page is a message:
    message Page {
        int32 page_number = 1;
        int64 page_total = 2;
        double cursor = 2;
    }
`,
  ),
);

const countryMessage = new GrpcMessage(
  new GrpCurlResponse(
    '',
    '',
    `
    com.delivery.v1.messages.Country is a message:
    message Country {
        string country_flag = 1;
        uint64 country_id = 1;
    }
`,
  ),
);

test('path should match', () => {
  const path = message.getPath();
  const pathErrored = errorMessage.getPath();
  expect(path).toStrictEqual('com.delivery.v1.messages.BatchRequest');
  expect(pathErrored).toStrictEqual('com.delivery.v1.messages.AnonymousUser');
});

test('dependencies should match and have their type fixed', () => {
  const dependencies = message.getDependencies();
  expect(dependencies).toStrictEqual([
    'google.protobuf.FieldMask',
    'com.delivery.v1.messages.EntityType',
    'com.delivery.v1.messages.RegisteredUser',
    'com.delivery.v1.messages.AnonymousUser',
    'com.delivery.v1.messages.PaginationRequest',
  ]);
});

test('properties should match', () => {
  const properties = message.getProperties();
  const firstProperty = properties[0];
  const secondProperty = properties[1];
  const thirdProperty = properties[2];
  const fourthProperty = properties[3];
  const fifthProperty = properties[4];
  const sixthProperty = properties[5];
  const seventhProperty = properties[6];

  expect(firstProperty.getKey()).toBe('ids');
  expect(firstProperty.getOneOfKey()).toBe('');
  expect(firstProperty.getType()).toBe('repeated string');
  expect(firstProperty.getOrdinal()).toBe(1);

  expect(secondProperty.getKey()).toBe('fieldmask_map');
  expect(secondProperty.getOneOfKey()).toBe('');
  expect(secondProperty.getType()).toBe('map<string, .google.protobuf.FieldMask>');
  expect(secondProperty.getOrdinal()).toBe(2);

  expect(thirdProperty.getKey()).toBe('type_filter');
  expect(thirdProperty.getOneOfKey()).toBe('');
  expect(thirdProperty.getType()).toBe('com.delivery.v1.messages.EntityType');
  expect(thirdProperty.getOrdinal()).toBe(3);

  expect(fourthProperty.getKey()).toBe('field_mask');
  expect(fourthProperty.getOneOfKey()).toBe('');
  expect(fourthProperty.getType()).toBe('google.protobuf.FieldMask');
  expect(fourthProperty.getOrdinal()).toBe(4);

  expect(fifthProperty.getKey()).toBe('authenticated_user');
  expect(fifthProperty.getOneOfKey()).toBe('user');
  expect(fifthProperty.getType()).toBe('com.delivery.v1.messages.RegisteredUser');
  expect(fifthProperty.getOrdinal()).toBe(5);

  expect(sixthProperty.getKey()).toBe('anonymous_user');
  expect(sixthProperty.getOneOfKey()).toBe('user');
  expect(sixthProperty.getType()).toBe('com.delivery.v1.messages.AnonymousUser');
  expect(sixthProperty.getOrdinal()).toBe(6);

  expect(seventhProperty.getKey()).toBe('page_request');
  expect(seventhProperty.getOneOfKey()).toBe('');
  expect(seventhProperty.getType()).toBe('com.delivery.v1.messages.PaginationRequest');
  expect(seventhProperty.getOrdinal()).toBe(7);
});

test('example should match via typeRegistry', () => {
  const messages = [
    message, // batch request
    errorMessage, // anonymous user
    fieldMaskMessage,
    entityTypeMessage,
    registeredUserMessage,
    paginationRequestMessage,
    pageMessage,
    countryMessage,
  ];

  const typeRegistry = new GrpcRegistry();
  messages.forEach((message) => typeRegistry.registerMessage(message));
  const messageFound = typeRegistry.getMessage(message.getPath());
  const example = messageFound.getExample(typeRegistry);

  expect(example).toStrictEqual({
    ids: [''],
    fieldmask_map: { '': { paths: [''] } },
    type_filter: {},
    field_mask: { paths: [''] },
    authenticated_user: {
      uid: 0,
      locale: '',
      country: { country_flag: '', country_id: 0 },
      has_vpn: true,
    },
    page_request: { pages: [{ page_number: 0, page_total: 0, cursor: 0 }] },
  });
});

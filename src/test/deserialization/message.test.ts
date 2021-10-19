import GrpCurlResponse from '../../models/GrpCurlResponse';
import {
  getDependencies,
  getLines,
  getMessagePathFromRequest,
  getMessagePropertyLine,
  getMessagePropertyLinesFiltered,
  getMessagePropertyObjectIndexes,
  getOneOfValue,
} from '../../deserialization/message';

const message = `
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
`;

const manyIndexesMessage = `
    com.delivery.v1.messages.BatchRequest is a message:
    message BatchRequest {
        oneof user {
          .com.delivery.v1.messages.RegisteredUser authenticated_user = 5;
          .com.delivery.v1.messages.AnonymousUser anonymous_user = 6;
        }
        oneof owner {
          .com.delivery.v1.messages.RegisteredUser authenticated_user = 5;
          .com.delivery.v1.messages.AnonymousUser anonymous_user = 6;
        }
        oneof consumer {
          .com.delivery.v1.messages.RegisteredUser authenticated_user = 5;
          .com.delivery.v1.messages.AnonymousUser anonymous_user = 6;
        }
        .com.delivery.v1.messages.PaginationRequest page_request = 7;
    }
`;

// describe message
test('removes line padding and splits message to lines', () => {
  const response = new GrpCurlResponse('', '', message);
  const parsed = getLines(response);

  expect(parsed).toStrictEqual([
    'repeated string ids = 1;',
    'map<string, .google.protobuf.FieldMask> fieldmask_map = 2;',
    '.com.delivery.v1.messages.EntityType type_filter = 3;',
    '.google.protobuf.FieldMask field_mask = 4;',
    'oneof user {',
    '.com.delivery.v1.messages.RegisteredUser authenticated_user = 5;',
    '.com.delivery.v1.messages.AnonymousUser anonymous_user = 6;',
    '}',
    '.com.delivery.v1.messages.PaginationRequest page_request = 7;',
  ]);
});

test('extract dependencies', () => {
  const dependencies = getDependencies(new GrpCurlResponse('', '', message));
  expect(dependencies).toStrictEqual([
    '.google.protobuf.FieldMask',
    '.com.delivery.v1.messages.EntityType',
    '.com.delivery.v1.messages.RegisteredUser',
    '.com.delivery.v1.messages.AnonymousUser',
    '.com.delivery.v1.messages.PaginationRequest',
  ]);
});

test('deserialize line to property', () => {
  const repeated = 'repeated string ids = 1;';
  const map = 'map<string, .google.protobuf.FieldMask> fieldmask_map = 2;';
  const normal = '.google.protobuf.FieldMask field_mask = 4;';
  const object = 'oneof user {';

  expect(getMessagePropertyLine(repeated)).toStrictEqual({
    type: 'repeated string',
    key: 'ids',
    ordinal: 1,
  });

  expect(getMessagePropertyLine(map)).toStrictEqual({
    type: 'map<string, .google.protobuf.FieldMask>',
    key: 'fieldmask_map',
    ordinal: 2,
  });

  expect(getMessagePropertyLine(normal)).toStrictEqual({
    type: '.google.protobuf.FieldMask',
    key: 'field_mask',
    ordinal: 4,
  });

  expect(getMessagePropertyLine(object)).toStrictEqual({
    type: undefined,
    key: undefined,
    ordinal: NaN,
  });
});

test('finds object indexes', () => {
  const indexes = getMessagePropertyObjectIndexes(getLines(new GrpCurlResponse('', '', manyIndexesMessage)));
  expect(indexes).toStrictEqual([
    {
      begin: 0,
      end: 3,
    },
    {
      begin: 4,
      end: 7,
    },
    {
      begin: 8,
      end: 11,
    },
  ]);
});

test('filter between objects/others from the message', () => {
  const linesFewObjects = getLines(new GrpCurlResponse('', '', message));
  const indexesFewObjects = getMessagePropertyObjectIndexes(linesFewObjects);
  const fewWithoutObjects = getMessagePropertyLinesFiltered(linesFewObjects, indexesFewObjects);
  const fewWithObjects = getMessagePropertyLinesFiltered(linesFewObjects, indexesFewObjects, true);

  const linesManyObjects = getLines(new GrpCurlResponse('', '', manyIndexesMessage));
  const indexesManyObjects = getMessagePropertyObjectIndexes(linesManyObjects);
  const manyWithoutObjects = getMessagePropertyLinesFiltered(linesManyObjects, indexesManyObjects);
  const manyWithObjects = getMessagePropertyLinesFiltered(linesManyObjects, indexesManyObjects, true);

  expect(fewWithObjects).toStrictEqual([
    'oneof user {',
    '.com.delivery.v1.messages.RegisteredUser authenticated_user = 5;',
    '.com.delivery.v1.messages.AnonymousUser anonymous_user = 6;',
    '}',
  ]);

  expect(fewWithoutObjects).toStrictEqual([
    'repeated string ids = 1;',
    'map<string, .google.protobuf.FieldMask> fieldmask_map = 2;',
    '.com.delivery.v1.messages.EntityType type_filter = 3;',
    '.google.protobuf.FieldMask field_mask = 4;',
    '.com.delivery.v1.messages.PaginationRequest page_request = 7;',
  ]);

  expect(manyWithoutObjects).toStrictEqual(['.com.delivery.v1.messages.PaginationRequest page_request = 7;']);

  expect(manyWithObjects).toStrictEqual([
    'oneof user {',
    '.com.delivery.v1.messages.RegisteredUser authenticated_user = 5;',
    '.com.delivery.v1.messages.AnonymousUser anonymous_user = 6;',
    '}',
    'oneof owner {',
    '.com.delivery.v1.messages.RegisteredUser authenticated_user = 5;',
    '.com.delivery.v1.messages.AnonymousUser anonymous_user = 6;',
    '}',
    'oneof consumer {',
    '.com.delivery.v1.messages.RegisteredUser authenticated_user = 5;',
    '.com.delivery.v1.messages.AnonymousUser anonymous_user = 6;',
    '}',
  ]);
});

test('find oneof value', () => {
  const line = getLines(new GrpCurlResponse('', '', message))[4];
  const value = getOneOfValue(line);
  expect(value).toStrictEqual('user');
});

test('path is extracted from the request', () => {
  const request = '/grpcurl -plaintext -max-time 5 localhost:9999 describe com.delivery.v1.messages.AnonymousUser';
  const path = getMessagePathFromRequest(request);
  expect(path).toStrictEqual('com.delivery.v1.messages.AnonymousUser');
});

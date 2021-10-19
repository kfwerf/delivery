import GrpCurlResponse from './GrpCurlResponse';

import GrpcMessageProperty from './GrpcMessageProperty';
import {
  getDependencies,
  getLines,
  getMessagePath,
  getMessagePropertyLine,
  getMessagePropertyLinesFiltered,
  getMessagePropertyObjectIndexes,
  getOneOfValue,
} from '../deserialization/message';
import { getName } from '../deserialization/service';
import { fixType } from '../utils/string';
import { toScalar, toScalarKey } from '../utils/conversion';
import GrpcTypeRegistry from '../registry/registry';

export type GrpcMessageRecord = Record<string, unknown>;

export default class GrpcMessage {
  private readonly response: GrpCurlResponse;

  private readonly path: string;

  private readonly name: string;

  private readonly properties: GrpcMessageProperty[];

  private readonly dependencies: string[];

  constructor(response: GrpCurlResponse) {
    this.response = response;

    if (response.hasError()) {
      // only works for describe, should be only way messages are introspected
      this.path = response.getPathFromRequest()?.trim();
    } else {
      this.path = getMessagePath(response)?.trim();
    }

    this.name = getName(this.path);

    this.dependencies = getDependencies(response).map((dependency) => fixType(dependency));

    // TODO: Move this somewhere else for possible individual testing
    const lines = getLines(response);
    const oneOfIndexes = getMessagePropertyObjectIndexes(lines);
    const normalProperties = getMessagePropertyLinesFiltered(lines, oneOfIndexes).map((line) => {
      const { type, key, ordinal } = getMessagePropertyLine(line);
      return new GrpcMessageProperty(line, type, key, ordinal);
    });
    const oneOfProperties = oneOfIndexes
      .map(({ begin, end }) => {
        const oneOf = lines.slice(begin, end);
        const oneOfKey = getOneOfValue(oneOf[0]);
        return oneOf.slice(1).map((line) => {
          const { type, key, ordinal } = getMessagePropertyLine(line);
          return new GrpcMessageProperty(line, type, key, ordinal, oneOfKey);
        });
      })
      .reduce((a, b) => [...a, ...b], []);
    this.properties = []
      .concat(normalProperties)
      .concat(oneOfProperties)
      .sort((a, b) => a.getOrdinal() - b.getOrdinal());
  }

  public getProperties(): GrpcMessageProperty[] {
    return this.properties;
  }

  public getPath(): string {
    return this.path;
  }

  public getDependencies(): string[] {
    return this.dependencies;
  }

  public isFaulty(): boolean {
    return this.response.hasError();
  }

  public getResponse(): GrpCurlResponse {
    return this.response;
  }

  public getExample(typeRegistry: GrpcTypeRegistry): GrpcMessageRecord {
    // TODO: Move this possibly somewhere else
    const newExample = this.properties
      .filter((property, idx) => {
        // Only return first one of for now
        if (property.getOneOfKey().length) {
          const oneOfKeysList = this.properties.map((prop) => prop.getOneOfKey());
          return oneOfKeysList.indexOf(property.getOneOfKey()) === idx;
        }

        return true;
      })
      .map((property) => {
        if (property.isRepeated()) {
          const type = property.getType().slice(9);
          if (property.isPrimitive()) {
            return { [property.getKey()]: [toScalar(type)] };
          }
          return { [property.getKey()]: [typeRegistry.getMessage(fixType(type))?.getExample(typeRegistry)] };
        }

        if (property.isMapped()) {
          const [keyType, valueType] = property.getType().slice(4, -1).split(', ');
          if (property.isPrimitive()) {
            return { [property.getKey()]: [toScalar(valueType)] };
          }
          return {
            [property.getKey()]: {
              [toScalarKey(keyType)]: typeRegistry.getMessage(fixType(valueType))?.getExample(typeRegistry),
            },
          };
        }

        if (!property.isPrimitive()) {
          const type = typeRegistry.getMessage(property.getType());
          if (type) {
            return {
              [property.getKey()]: type.getExample(typeRegistry),
            };
          }
        }

        return { [property.getKey()]: toScalar(property.getType()) };
      });

    return newExample.reduce((a, b) => ({ ...a, ...b }), {});
  }
}

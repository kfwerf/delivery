import grpcurl from '../../cli/grpcurl';
import GrpcService from '../../models/GrpcService';
import {toServiceList} from "../../deserialization/service";
import {getRequestsFromServices} from "../../utils/extract";
import GrpcTypeRegistry from "../../registry/registry";
import GrpcMessage from "../../models/GrpcMessage";
import {dedupe} from "../../utils/list";
import GrpCurlCommand from "../../models/GrpCurlCommand";
import {Observable} from "rxjs";

async function recursiveGetMessages(command: GrpCurlCommand, url: string, messageTypes: string[], messages: GrpcMessage[] = []): Promise<GrpcMessage[]> {
  const messagesListResponse = await Promise.all(messageTypes.map(
      (messageType) => grpcurl.describe(url, messageType, command).getResponse(),
  ));
  const messagesList = messagesListResponse.map((response) => new GrpcMessage(response));
  const allMessages = messages.concat(messagesList);
  const paths = allMessages.map((item) => item.getPath());
  const newMessages = allMessages.filter(
      (value: GrpcMessage, index: number): boolean => paths.indexOf(value.getPath()) === index,
  );

  const typesInProperties = newMessages
      .map((message) => message.getDependencies())
      .reduce((prev, next) => prev.concat(next), []) // flatMap all arrays
      .filter(dedupe);

  const newTypes = typesInProperties
      .filter((additionalType) => paths.indexOf(additionalType) === -1);

  if (newTypes.length) {
    return recursiveGetMessages(command, url, newTypes, newMessages);
  }

  return newMessages;
}

export default async function detect(command: GrpCurlCommand, url: string): Promise<GrpcTypeRegistry> {
  const typeRegistry = new GrpcTypeRegistry();

  // Fetch a list of available services
  const servicesListResponse = await grpcurl.list(url, command).getResponse();
  if (servicesListResponse.hasError()) {
    return Promise.reject(servicesListResponse);
    //throw new Error(`Failed to get services list ${servicesListResponse.getError()}`);
  }
  const servicesList = toServiceList(servicesListResponse);

  // Fetch all description for services
  const describedServicesListResponse = await Promise.all(servicesList
    .map((service) => grpcurl.describe(url, service, command).getResponse()));

  const describedServicesList = describedServicesListResponse
    .filter((response) => !response.hasError()) // TODO: Do something more than just ignoring
    .map((describedService) => new GrpcService(describedService));

  // Fetch all possible messages by running through the list exhaustively
  const messagesList = await recursiveGetMessages(command, url, getRequestsFromServices(describedServicesList));

  // Register services and messages
  messagesList.forEach((message) => typeRegistry.registerMessage(message));
  describedServicesList.forEach((service) => typeRegistry.registerService(service));

  return typeRegistry;
}

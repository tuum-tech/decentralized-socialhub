import {
  HttpClient,
  ScriptingService,
  ServiceEndpoint
} from '@elastosfoundation/hive-js-sdk/';

export class AnonymousScriptingService extends ScriptingService {
  public constructor(serviceContext: ServiceEndpoint) {
    super(
      serviceContext,
      new HttpClient(
        serviceContext,
        HttpClient.NO_AUTHORIZATION,
        HttpClient.DEFAULT_OPTIONS
      )
    );
  }
}

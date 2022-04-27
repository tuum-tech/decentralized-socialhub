import {
  HttpClient,
  ScriptingService,
  ServiceContext
} from '@elastosfoundation/hive-js-sdk/';

export class AnonymousScriptingService extends ScriptingService {
  public constructor(serviceContext: ServiceContext) {
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

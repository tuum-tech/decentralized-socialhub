import {
  VaultServices,
  ScriptingService,
  DatabaseService,
  VaultSubscriptionService,
  AppContext,
  AppContextParameters,
  ServiceContext,
  DIDResolverAlreadySetupException
} from '@elastosfoundation/hive-js-sdk/';

import { Logger } from '../logger';
import { HiveContextProvider } from './hivecontextprovider';
import { DIDDocument } from '@elastosfoundation/did-js-sdk/';
import { CacheManager } from '../cachemanager';
import { AnonymousScriptingService } from '../../services/anonymous.scripting.service';

export class HiveClientParameters {
  public context = {} as AppContextParameters;
  public hiveHost = '';
  public resolverUrl = '';
  public resolverCache = '';
}

const environmentParameters: HiveClientParameters = {
  hiveHost: process.env.REACT_APP_HIVE_HOST as string,
  resolverUrl: process.env.REACT_APP_HIVE_RESOLVER_URL as string,
  resolverCache: process.env.REACT_APP_HIVE_CACHE_DIR as string,
  context: {
    storePath: process.env.REACT_APP_APPLICATION_STORE_PATH,
    appDID: process.env.REACT_APP_APPLICATION_DID,
    appMnemonics: process.env.REACT_APP_APPLICATION_MNEMONICS,
    appPhrasePass: process.env.REACT_APP_APPLICATION_PASSPHRASE,
    appStorePass: process.env.REACT_APP_APPLICATION_STORE_PASS,
    userDID: '',
    userMnemonics: '',
    userPhrasePass: '',
    userStorePass: ''
  } as AppContextParameters
};

export class HiveClient {
  private static APP_INSTANCE_DOCUMENT_CACHE_KEY = 'APP_INSTANCE_DOCUMENT';
  private static LOG = new Logger('HiveClient');
  private databaseService?: DatabaseService;
  private scriptingService?: ScriptingService;
  private anonymousScriptingService?: AnonymousScriptingService;
  private vaultSubscriptionService?: VaultSubscriptionService;
  private vaultServices?: VaultServices;
  private anonymous: boolean;
  private hiveClientParameters: HiveClientParameters;
  private appContext: AppContext;

  private constructor(
    anonymous: boolean,
    appContext: AppContext,
    hiveClientParameters: HiveClientParameters,
    vaultServices?: VaultServices,
    vaultSubscriptionService?: VaultSubscriptionService
  ) {
    HiveClient.LOG.debug(
      'Creating HiveClient instance with {} ...',
      JSON.stringify(appContext)
    );
    this.anonymous = anonymous;
    this.appContext = appContext;
    this.hiveClientParameters = hiveClientParameters;
    if (!anonymous) {
      this.databaseService = vaultServices?.getDatabaseService();
      this.scriptingService = vaultServices?.getScriptingService();
      this.vaultSubscriptionService = vaultSubscriptionService;
      this.vaultServices = vaultServices;
    } else {
    }
  }

  get Database(): DatabaseService {
    HiveClient.LOG.trace('Database');
    if (!this.databaseService)
      throw new Error('HiveClient: Authentication required.');
    return this.databaseService;
  }

  get Vault(): VaultServices {
    HiveClient.LOG.trace('Vault');
    if (!this.vaultServices)
      throw new Error('HiveClient: Authentication required.');
    return this.vaultServices;
  }

  get VaultSubscription(): VaultSubscriptionService {
    HiveClient.LOG.trace('VaultSubscription');
    if (!this.vaultSubscriptionService)
      throw new Error('HiveClient: Authentication required.');
    return this.vaultSubscriptionService;
  }

  get Scripting(): ScriptingService {
    HiveClient.LOG.trace('Scripting');
    if (!this.anonymous && !this.scriptingService)
      throw new Error('HiveClient: Authentication required.');
    if (this.anonymous && !this.anonymousScriptingService)
      throw new Error('HiveClient: Anonymous Scripting Service unavailable.');
    return this.anonymous
      ? this.anonymousScriptingService!
      : this.scriptingService!;
  }

  public isAnonymous(): boolean {
    HiveClient.LOG.trace('isAnonymous');
    return this.anonymous;
  }

  public static async createAnonymousInstance(
    hiveHost: string
  ): Promise<HiveClient> {
    HiveClient.LOG.trace('createAnonymousInstance');
    let hiveClient: HiveClient = CacheManager.get('HiveClient', hiveHost);

    if (!hiveClient) {
      HiveClient.LOG.debug('Creating new anonymous HiveClient instance...');
      let appContextParameters = environmentParameters;
      appContextParameters.hiveHost = hiveHost;
      let instanceAppContextParameters = HiveClient.resolveDefaultParameters(
        appContextParameters
      );
      HiveClient.LOG.debug(
        'Initializing anonymous resolver with {} and {} ...',
        instanceAppContextParameters.resolverUrl,
        instanceAppContextParameters.resolverCache
      );
      try {
        AppContext.setupResolver(
          instanceAppContextParameters.resolverUrl,
          instanceAppContextParameters.resolverCache
        );
      } catch (e) {
        if (!(e instanceof DIDResolverAlreadySetupException)) {
          throw e;
        }
      }
      HiveClient.LOG.debug(
        'Building anonymous Hive context with {} ...',
        JSON.stringify(instanceAppContextParameters)
      );
      let appContext = await HiveClient.buildAnonymousAppContext(
        instanceAppContextParameters
      );
      hiveClient = new HiveClient(
        true,
        appContext,
        instanceAppContextParameters
      );
      HiveClient.LOG.debug('New anonymous HiveClient created.');
      hiveClient.setAnonymousScriptingService(hiveHost);
      CacheManager.set('HiveClient', hiveHost, hiveClient);
    }
    return hiveClient;
  }

  public static async createInstance(
    appContextParameters?: HiveClientParameters
  ): Promise<HiveClient> {
    HiveClient.LOG.trace('createInstance');
    let hiveClient = CacheManager.get('HiveClient', appContextParameters);

    if (!hiveClient) {
      HiveClient.LOG.debug('Creating new HiveClient instance...');
      let instanceAppContextParameters = HiveClient.resolveDefaultParameters(
        appContextParameters
      );
      HiveClient.LOG.debug(
        'Initializing resolver with {} and {} ...',
        instanceAppContextParameters.resolverUrl,
        instanceAppContextParameters.resolverCache
      );
      try {
        AppContext.setupResolver(
          instanceAppContextParameters.resolverUrl,
          instanceAppContextParameters.resolverCache
        );
      } catch (e) {
        if (!(e instanceof DIDResolverAlreadySetupException)) {
          throw e;
        }
      }
      HiveClient.LOG.debug(
        'Building Hive context with {} ...',
        JSON.stringify(instanceAppContextParameters)
      );
      let appContext = await HiveClient.buildAppContext(
        instanceAppContextParameters
      );
      hiveClient = new HiveClient(
        false,
        appContext,
        instanceAppContextParameters,
        new VaultServices(appContext, instanceAppContextParameters.hiveHost),
        new VaultSubscriptionService(
          appContext,
          instanceAppContextParameters.hiveHost
        )
      );
      HiveClient.LOG.debug('New HiveClient created.');
      CacheManager.set('Hiveclient', appContextParameters, hiveClient);
    }
    return hiveClient;
  }

  public static async getHiveVersion(hiveHost: string): Promise<string> {
    HiveClient.LOG.trace('getHiveVersion');
    let hiveClient = await HiveClient.createAnonymousInstance(hiveHost);

    let serviceContext = new ServiceContext(
      hiveClient.appContext,
      hiveClient.hiveClientParameters.hiveHost
    );

    return (await serviceContext.getNodeVersion()).toString();
  }

  private static resolveDefaultParameters(
    hiveClientParameters?: HiveClientParameters
  ): HiveClientParameters {
    HiveClient.LOG.trace('resolveDefaultParameters');
    if (!hiveClientParameters) return environmentParameters;
    for (const defaultPropertyKey in environmentParameters) {
      const key = defaultPropertyKey as keyof HiveClientParameters;
      if (key == 'context') {
        if (!hiveClientParameters.context) {
          hiveClientParameters.context = environmentParameters.context;
        } else {
          let appContextParameters = hiveClientParameters.context;
          for (const defaultContextPropertyKey in environmentParameters.context) {
            const contextKey = defaultContextPropertyKey as keyof AppContextParameters;
            if (!appContextParameters[contextKey]) {
              appContextParameters[contextKey] =
                environmentParameters.context[contextKey];
            }
          }
        }
      } else {
        if (!hiveClientParameters[key]) {
          hiveClientParameters[key] = environmentParameters[key];
        }
      }
    }
    return hiveClientParameters;
  }

  private static async buildAnonymousAppContext(
    appContextParameters: HiveClientParameters
  ): Promise<AppContext> {
    HiveClient.LOG.trace('buildAnonymousAppContext');
    return await AppContext.build(
      {
        getLocalDataDir(): string {
          HiveClient.LOG.trace('HiveAnonymousContextProvider: getLocalDataDir');
          return appContextParameters.context.storePath;
        },

        /**
         * The method for upper Application to implement to provide current application
         * instance did document as the running context.
         * @return The application instance did document.
         */
        async getAppInstanceDocument(): Promise<DIDDocument> {
          HiveClient.LOG.trace(
            'HiveAnonymousContextProvider: getAppInstanceDocument'
          );
          return new Promise((resolve, reject) => {
            resolve(new DIDDocument());
          });
        },

        /**
         * The method for upper Application to implement to acquire the authorization
         * code from user's approval.
         * @param authenticationChallengeJWtCode  The input challenge code from back-end node service.
         * @return The credential issued by user.
         */
        getAuthorization(
          authenticationChallengeJWtCode: string
        ): Promise<string> {
          HiveClient.LOG.trace(
            'HiveAnonymousContextProvider: getAuthorization'
          );
          return new Promise((resolve, reject) => {
            resolve('');
          });
        }
      },
      ''
    );
  }

  private static async buildAppContext(
    appContextParameters: HiveClientParameters
  ): Promise<AppContext> {
    HiveClient.LOG.trace('buildAppContext');
    return await AppContext.build(
      await HiveContextProvider.create(appContextParameters.context),
      appContextParameters.context.userDID
    );
  }

  public isConnected(): boolean {
    HiveClient.LOG.trace('isConnected');
    return this.isConnected() || this.getAccessToken() ? true : false;
  }

  public getAccessToken(): string | null {
    HiveClient.LOG.trace('getAccessToken');
    try {
      return this.Vault.getAccessToken().getJwtCode();
    } catch (e) {
      HiveClient.LOG.error(e);
    }
    return null;
  }

  public setAnonymousScriptingService(hiveHost: string): void {
    HiveClient.LOG.trace('setAnonymousScriptingService');
    HiveClient.LOG.debug(
      "setAnonymousScriptingService for '{}' using context: {}",
      hiveHost,
      JSON.stringify(this.appContext)
    );
    let serviceContext = new ServiceContext(this.appContext, hiveHost);
    this.anonymousScriptingService = new AnonymousScriptingService(
      serviceContext
    );
  }
}



export interface FrappeConfig {
  appURL: string;
  socketPort?: string;
  name?: string;
}
export class FrappeApp {
  /** URL of the Frappe instance */
  readonly url: string;

  /** Name of the Frappe App instance */
  readonly name: string;

  /** Port on which Socket IO is running. 
   * Default is 9000.
   */
  readonly socketPort: string;

  constructor(config: FrappeConfig) {
    this.url = config.appURL;
    this.name = config.name ?? 'FrappeApp';
    this.socketPort = config.socketPort ?? '9000';
  }
}

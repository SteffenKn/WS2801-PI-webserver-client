import md5 from 'md5';
import {Response as FetchResponse} from 'node-fetch';

import {LedColor, LedStrip} from './types/index';

import {HttpClient} from './http-client';

export class WS2801PiWebServerClient {
  public httpClient: HttpClient;

  constructor(baseUrl: string, apiKey?: string) {
    if (!baseUrl.startsWith('https://') && !baseUrl.startsWith('http://')) {
      baseUrl = `http://${baseUrl}`;
    }
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.substring(0, baseUrl.length - 1);
    }

    this.httpClient = new HttpClient(baseUrl, apiKey);
  }

  public setApiKey(apiKey: string): void {
    this.httpClient.setApiKey(apiKey);
  }

  public async loginRequired(): Promise<boolean> {
    const response: FetchResponse = await this.httpClient.get('/login-required');

    if (response.status !== 200) {
      const errorMessage: string = await response.text();

      throw new Error(`Could not check if login is required: ${errorMessage}`);
    }

    const result: {loginRequired: boolean} = await response.json();

    return result.loginRequired;
  }

  public async register(username: string, password: string): Promise<string> {
    const apiKey: string = md5(`${username}__${password}`);
    const body: string = JSON.stringify({name: username, apiKey: apiKey});

    const response: FetchResponse = await this.httpClient.post('/register', {body: body});

    if (response.status !== 200) {
      const errorMessage: string = await response.text();

      throw new Error(`Could not register: ${errorMessage}`);
    }

    const result: {apiKey: string} = await response.json();

    this.httpClient.setApiKey(apiKey);

    return result.apiKey;
  }

  public async login(username: string, password: string): Promise<string> {
    const apiKey: string = md5(`${username}__${password}`);

    this.httpClient.setApiKey(apiKey);

    const response: FetchResponse = await this.httpClient.post('/login');

    if (response.status !== 200) {
      const errorMessage: string = await response.text();

      throw new Error(`Could not login: ${errorMessage}`);
    }

    return apiKey;
  }

  public async getLedStrip(): Promise<LedStrip> {
    const response: FetchResponse = await this.httpClient.get('/led-strip');

    if (response.status !== 200) {
      const errorMessage: string = await response.text();

      throw new Error(`Could not get led strip: ${errorMessage}`);
    }

    const result: {ledStrip: LedStrip} = await response.json();

    return result.ledStrip;
  }

  public async fillLedStrip(color: LedColor): Promise<LedStrip> {
    const body: string = JSON.stringify({color: color});

    const response: FetchResponse = await this.httpClient.post('/led-strip/fill', {body: body});

    if (response.status !== 200) {
      const errorMessage: string = await response.text();

      throw new Error(`Could not fill led strip: ${errorMessage}`);
    }

    const result: {ledStrip: LedStrip} = await response.json();

    return result.ledStrip;
  }

  public async clearLedStrip(): Promise<LedStrip> {
    const response: FetchResponse = await this.httpClient.post('/led-strip/clear');

    if (response.status !== 200) {
      const errorMessage: string = await response.text();

      throw new Error(`Could not clear led strip: ${errorMessage}`);
    }

    const result: {ledStrip: LedStrip} = await response.json();

    return result.ledStrip;
  }

  public async setLed(ledIndex: number, color: LedColor): Promise<LedStrip> {
    const body: string = JSON.stringify({color: color});

    const response: FetchResponse = await this.httpClient.post(`/led-strip/led/${ledIndex}/set`, {body: body});

    if (response.status !== 200) {
      const errorMessage: string = await response.text();

      throw new Error(`Could not set color of led ${ledIndex}: ${errorMessage}`);
    }

    const result: {ledStrip: LedStrip} = await response.json();

    return result.ledStrip;
  }

  public async setLedstrip(ledStrip: LedStrip): Promise<LedStrip> {
    const body: string = JSON.stringify({ledStrip: ledStrip});

    const response: FetchResponse = await this.httpClient.post(`/led-strip/set`, {body: body});

    if (response.status !== 200) {
      const errorMessage: string = await response.text();

      throw new Error(`Could not set color of led strip: ${errorMessage}`);
    }

    const result: {ledStrip: LedStrip} = await response.json();

    return result.ledStrip;
  }

}

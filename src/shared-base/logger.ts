/*
 * Copyright (c) 2021 Elastos Foundation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

class LogLevel {
  public id: number;
  public name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
export class Logger {
  public static TRACE = new LogLevel(0, 'TRACE');
  public static DEBUG = new LogLevel(1, 'DEBUG');
  public static INFO = new LogLevel(2, 'INFO');
  public static WARNING = new LogLevel(3, 'WARN');
  public static ERROR = new LogLevel(4, 'ERROR');

  private context: string;
  private logLevel: LogLevel;
  private cid: string;
  private static DEFAULT_LOG_LEVEL = Logger.TRACE;

  public static setDefaultLevel(level: LogLevel) {
    Logger.DEFAULT_LOG_LEVEL = level;
  }

  public static getDefaultLevel(): LogLevel {
    return Logger.DEFAULT_LOG_LEVEL;
  }

  public setLevel(level: LogLevel) {
    this.logLevel = level;
  }

  public getLevel(): LogLevel {
    return this.logLevel ? this.logLevel : Logger.DEFAULT_LOG_LEVEL;
  }

  public levelIs(level: LogLevel): boolean {
    let currentLevel = this.logLevel ? this.logLevel : Logger.DEFAULT_LOG_LEVEL;
    return level.id >= currentLevel.id;
  }

  public constructor(context: string) {
    this.context = context ? context : '';
    this.cid = this.initializeCID();
    this.logLevel = Logger.DEFAULT_LOG_LEVEL;
  }

  /**
   * Generates a unique ID to be used as a correlation id to link multiple related things.
   */
  public initializeCID(): string {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    this.cid = Math.random()
      .toString(36)
      .substring(2, 9);
    return this.cid;
  }

  public currentCID(): string {
    return this.cid;
  }

  public resetCID(): void {
    this.cid = '';
  }

  public log(...data: any) {
    if (this.getLevel().id <= Logger.INFO.id) {
      console.log(this.format(Logger.INFO, data));
    }
  }

  public info(...data: any) {
    if (this.getLevel().id <= Logger.INFO.id) {
      console.log(this.format(Logger.INFO, data));
    }
  }

  public debug(...data: any) {
    if (this.getLevel().id <= Logger.DEBUG.id) {
      console.log(this.format(Logger.DEBUG, data));
    }
  }

  public trace(...data: any) {
    if (this.getLevel().id <= Logger.TRACE.id) {
      console.log(this.format(Logger.TRACE, data));
    }
  }

  public warn(...data: any) {
    if (this.getLevel().id <= Logger.WARNING.id) {
      console.log(this.format(Logger.WARNING, data));
    }
  }

  public error(...data: any) {
    if (this.getLevel().id <= Logger.ERROR.id) {
      console.log(this.format(Logger.ERROR, data));
    }
  }

  private format(level: LogLevel, data: any[]): string {
    let logLine =
      new Date().toISOString() +
      ' ' +
      level.name.toUpperCase() +
      ' ' +
      this.context +
      ' ' +
      (this.cid ? '(' + this.cid + ') ' : '');
    if (!data || data.length < 1) return logLine;
    let content = String(data[0]);
    for (let i = 1; i < data.length; i++) {
      content = content.replace(/\{\}/, String(data[i]));
    }
    return logLine + ' ' + content;
  }
}

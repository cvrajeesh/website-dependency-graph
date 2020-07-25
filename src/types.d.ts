import StrictEventEmitter from "strict-event-emitter-types";
import { EventEmitter } from "events";

export type ParserEvent = {
  dependency: (path: string) => void;
};

export type ParserEventEmitter = StrictEventEmitter<EventEmitter, ParserEvent>;

export interface IParser extends AssetEventEmitter {
  parse(content: string): void;
}

export type AssetEvent = {
  dependency: (type: string, path: string) => void;
};

export type AssetEventEmitter = StrictEventEmitter<EventEmitter, AssetEvent>;

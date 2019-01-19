export class Order {
  constructor ();
  getId(): string;
  setId(a: string): void;
  getType(): string;
  setType(a: string): void;
  getFrom(): Position;
  setFrom(a: Position): void;
  getTosList(): Position[];
  setTosList(a: Position[]): void;
  getFee(): number;
  setFee(a: number): void;
  getSender(): Sender;
  setSender(a: Sender): void;
  getAnnotationsList(): Order.AnnotationsEntry[];
  setAnnotationsList(a: Order.AnnotationsEntry[]): void;
  getCreated(): Timestamp;
  setCreated(a: Timestamp): void;
  getDriverid(): string;
  setDriverid(a: string): void;
  getStatus(): string;
  setStatus(a: string): void;
  getComment(): string;
  setComment(a: string): void;
  getPayinfo(): PayInfo;
  setPayinfo(a: PayInfo): void;
  toObject(): Order.AsObject;
  serializeBinary(): Uint8Array;
  static deserializeBinary: (bytes: {}) => Order;
}

export namespace Order {
  export type AsObject = {
    Id: string;
    Type: string;
    From: Position;
    TosList: Position[];
    Fee: number;
    Sender: Sender;
    AnnotationsList: Order.AnnotationsEntry[];
    Created: Timestamp;
    Driverid: string;
    Status: string;
    Comment: string;
    Payinfo: PayInfo;
  }
  export type AnnotationsEntry = OrderAnnotationsEntry;
}

export class OrderAnnotationsEntry {
  constructor ();
  getKey(): string;
  setKey(a: string): void;
  getValue(): string;
  setValue(a: string): void;
  toObject(): OrderAnnotationsEntry.AsObject;
  serializeBinary(): Uint8Array;
  static deserializeBinary: (bytes: {}) => OrderAnnotationsEntry;
}

export namespace OrderAnnotationsEntry {
  export type AsObject = {
    Key: string;
    Value: string;
  }
}

export class AnnotationsEntry {
  constructor ();
  getKey(): string;
  setKey(a: string): void;
  getValue(): string;
  setValue(a: string): void;
  toObject(): AnnotationsEntry.AsObject;
  serializeBinary(): Uint8Array;
  static deserializeBinary: (bytes: {}) => AnnotationsEntry;
}

export namespace AnnotationsEntry {
  export type AsObject = {
    Key: string;
    Value: string;
  }
}

export class OrderList {
  constructor ();
  getItemsList(): Order[];
  setItemsList(a: Order[]): void;
  toObject(): OrderList.AsObject;
  serializeBinary(): Uint8Array;
  static deserializeBinary: (bytes: {}) => OrderList;
}

export namespace OrderList {
  export type AsObject = {
    ItemsList: Order[];
  }
}

export class OrderRequest {
  constructor ();
  getId(): string;
  setId(a: string): void;
  toObject(): OrderRequest.AsObject;
  serializeBinary(): Uint8Array;
  static deserializeBinary: (bytes: {}) => OrderRequest;
}

export namespace OrderRequest {
  export type AsObject = {
    Id: string;
  }
}

export class PayInfo {
  constructor ();
  getType(): string;
  setType(a: string): void;
  getPayresult(): string;
  setPayresult(a: string): void;
  toObject(): PayInfo.AsObject;
  serializeBinary(): Uint8Array;
  static deserializeBinary: (bytes: {}) => PayInfo;
}

export namespace PayInfo {
  export type AsObject = {
    Type: string;
    Payresult: string;
  }
}

export class Position {
  constructor ();
  getName(): string;
  setName(a: string): void;
  getLocation(): string;
  setLocation(a: string): void;
  getAddress(): string;
  setAddress(a: string): void;
  toObject(): Position.AsObject;
  serializeBinary(): Uint8Array;
  static deserializeBinary: (bytes: {}) => Position;
}

export namespace Position {
  export type AsObject = {
    Name: string;
    Location: string;
    Address: string;
  }
}

export class Sender {
  constructor ();
  getId(): string;
  setId(a: string): void;
  getName(): string;
  setName(a: string): void;
  getTel(): string;
  setTel(a: string): void;
  toObject(): Sender.AsObject;
  serializeBinary(): Uint8Array;
  static deserializeBinary: (bytes: {}) => Sender;
}

export namespace Sender {
  export type AsObject = {
    Id: string;
    Name: string;
    Tel: string;
  }
}

export class SignReply {
  constructor ();
  getSigned(): string;
  setSigned(a: string): void;
  toObject(): SignReply.AsObject;
  serializeBinary(): Uint8Array;
  static deserializeBinary: (bytes: {}) => SignReply;
}

export namespace SignReply {
  export type AsObject = {
    Signed: string;
  }
}

export class User {
  constructor ();
  getId(): string;
  setId(a: string): void;
  getName(): string;
  setName(a: string): void;
  getPassword(): string;
  setPassword(a: string): void;
  getTel(): string;
  setTel(a: string): void;
  getCreated(): Timestamp;
  setCreated(a: Timestamp): void;
  getSign(): string;
  setSign(a: string): void;
  getLabelsList(): User.LabelsEntry[];
  setLabelsList(a: User.LabelsEntry[]): void;
  toObject(): User.AsObject;
  serializeBinary(): Uint8Array;
  static deserializeBinary: (bytes: {}) => User;
}

export namespace User {
  export type AsObject = {
    Id: string;
    Name: string;
    Password: string;
    Tel: string;
    Created: Timestamp;
    Sign: string;
    LabelsList: User.LabelsEntry[];
  }
  export type LabelsEntry = UserLabelsEntry;
}

export class UserLabelsEntry {
  constructor ();
  getKey(): string;
  setKey(a: string): void;
  getValue(): string;
  setValue(a: string): void;
  toObject(): UserLabelsEntry.AsObject;
  serializeBinary(): Uint8Array;
  static deserializeBinary: (bytes: {}) => UserLabelsEntry;
}

export namespace UserLabelsEntry {
  export type AsObject = {
    Key: string;
    Value: string;
  }
}

export class LabelsEntry {
  constructor ();
  getKey(): string;
  setKey(a: string): void;
  getValue(): string;
  setValue(a: string): void;
  toObject(): LabelsEntry.AsObject;
  serializeBinary(): Uint8Array;
  static deserializeBinary: (bytes: {}) => LabelsEntry;
}

export namespace LabelsEntry {
  export type AsObject = {
    Key: string;
    Value: string;
  }
}

export class Timestamp {
  constructor ();
  getSeconds(): number;
  setSeconds(a: number): void;
  getNanos(): number;
  setNanos(a: number): void;
  toObject(): Timestamp.AsObject;
  serializeBinary(): Uint8Array;
  static deserializeBinary: (bytes: {}) => Timestamp;
}

export namespace Timestamp {
  export type AsObject = {
    Seconds: number;
    Nanos: number;
  }
}


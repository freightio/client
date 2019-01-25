import * as grpcWeb from 'grpc-web';

import * as user_pb from './user_pb';
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';

import {
  Order,
  OrderList,
  OrderRequest,
  Position,
  SignReply} from './order_pb';

export class OrdersClient {
  constructor (hostname: string,
               credentials: null | { [index: string]: string; },
               options: null | { [index: string]: string; });

  add(
    request: Order,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: Order) => void
  ): grpcWeb.ClientReadableStream<Order>;

  get(
    request: OrderRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: Order) => void
  ): grpcWeb.ClientReadableStream<Order>;

  update(
    request: Order,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: Order) => void
  ): grpcWeb.ClientReadableStream<Order>;

  delete(
    request: OrderRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: Order) => void
  ): grpcWeb.ClientReadableStream<Order>;

  listByPositon(
    request: Position,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<Order>;

  listByUser(
    request: user_pb.User,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: OrderList) => void
  ): grpcWeb.ClientReadableStream<OrderList>;

  signAlipay(
    request: Order,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: SignReply) => void
  ): grpcWeb.ClientReadableStream<SignReply>;

}

export class OrdersPromiseClient {
  constructor (hostname: string,
               credentials: null | { [index: string]: string; },
               options: null | { [index: string]: string; });

  add(
    request: Order,
    metadata?: grpcWeb.Metadata
  ): Promise<Order>;

  get(
    request: OrderRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<Order>;

  update(
    request: Order,
    metadata?: grpcWeb.Metadata
  ): Promise<Order>;

  delete(
    request: OrderRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<Order>;

  listByPositon(
    request: Position,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<Order>;

  listByUser(
    request: user_pb.User,
    metadata?: grpcWeb.Metadata
  ): Promise<OrderList>;

  signAlipay(
    request: Order,
    metadata?: grpcWeb.Metadata
  ): Promise<SignReply>;

}


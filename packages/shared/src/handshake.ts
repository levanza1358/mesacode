export interface HelloMessage {
  type: "mesacode-hello";
  version: string;
  platform: string;
  arch: string;
  pid: number;
}

export interface HelloAckMessage {
  type: "mesacode-hello-ack";
  version: string;
  clientId: string;
}

export interface ServerConfig {
  protocol: ProtocolConfig;
  host: string;
  port: number;
  isSSL: boolean;
  options: any;
}

export interface ProtocolConfig {
  normal: string;
  secure: string;
}

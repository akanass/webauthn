export interface ServerConfig {
  protocol: string;
  host: string;
  port: number;
  views: ViewsConfig;
  assets: AssetsConfig;
}

export interface ViewsConfig {
  templatesPath: string;
  layout: string;
  title: string;
}

export interface AssetsConfig {
  rootPath: string;
  prefix: string;
}

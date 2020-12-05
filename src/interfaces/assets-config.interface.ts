export interface AssetsConfig {
  rootPath: string;
  options: any;
  styleCompiler: StyleCompilerConfig;
}

export interface StyleCompilerConfig {
  requestPathToExecute: string;
  scssPath: string;
  outFile: string;
  outFolder: string;
  options: any;
}

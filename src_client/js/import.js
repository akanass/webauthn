import 'systemjs';

const scriptsToImport = new URL(document.currentScript.src).searchParams
  .get('s')
  .split(',');
scriptsToImport.forEach((s) => System.import(`/public/js/system/${s}`));

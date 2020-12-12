import 'systemjs';
const scriptToImport = new URL(document.currentScript.src).searchParams.get('s');
System.import(`/public/js/system/${scriptToImport}`);

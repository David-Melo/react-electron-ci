const { notarize } = require('electron-notarize');

exports.default = async function notarizing(context) {

  const { electronPlatformName, appOutDir } = context;  

  if (electronPlatformName !== 'darwin') {
    return;
  };

  const appName = context.packager.appInfo.productFilename;
  const appId = context.packager.appInfo.info._configuration.appId;

  return await notarize({
    appBundleId: appId,
    appPath: `${appOutDir}/${appName}.app`,
    ascProvider: process.env.APPLE_TEAM_ID,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASS,
  });

};
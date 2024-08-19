import log4js from 'log4js';
import log from 'loglevel';

let logger;

if (typeof window === 'undefined') {
  // サーバーサイドでのみ初期化
  log4js.configure({
    appenders: { out: { type: 'stdout' } },
    categories: { default: { appenders: ['out'], level: 'info' } },
  });
  logger = log4js.getLogger();
} else {
  const originalFactory = log.methodFactory;

  log.methodFactory = function (methodName, logLevel, loggerName) {
    const rawMethod = originalFactory(methodName, logLevel, loggerName);

    return function (...messages) {
      const timestamp = new Date().toLocaleString('ja-JP', {
        timeZone: 'Asia/Tokyo',
      });
      const levelName = methodName.toUpperCase();
      rawMethod(`[${timestamp}] [${levelName}]`, ...messages);
    };
  };

  // クライアントサイドでは他のロガーを使用 (例: loglevel)
  logger = log.getLogger('FoundationApp');
  logger.setLevel('info');
}

export default logger;

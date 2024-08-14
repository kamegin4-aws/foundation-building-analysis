import log4js from 'log4js';
import log from 'loglevel';

// ログレベルを設定（例：debug、info、warn、error）
log.setLevel('info');

const logger = log4js.getLogger();
logger.level = 'info';

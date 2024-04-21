import { MIME_TYPE } from "@/library/common/constant/mimeType_check";

/**
 * MIMETypeの判定
 * @param {string} mimeTyp
 * @returns {string} アプリ用MIMEType
 */
export function mimeTypeCheck(mimeTyp) {
  let regex = /audio\//;
  if (regex.test(mimeTyp)) return MIME_TYPE[0];
  regex = /image\//;
  if (regex.test(mimeTyp)) return MIME_TYPE[2];
  regex = /text\//;
  if (regex.test(mimeTyp)) return MIME_TYPE[3];
  regex = /video\//;
  if (regex.test(mimeTyp)) return MIME_TYPE[1];
  regex = /application\/json/;
  if (regex.test(mimeTyp)) return MIME_TYPE[4];
  regex = /application\/pdf/;
  if (regex.test(mimeTyp)) return MIME_TYPE[5];
  regex = /application\/zip/;
  if (regex.test(mimeTyp)) return MIME_TYPE[6];
  regex = /application\/msword/;
  if (regex.test(mimeTyp)) return MIME_TYPE[7];
  regex = /application\/vnd\.ms-powerpoint/;
  if (regex.test(mimeTyp)) return MIME_TYPE[8];
  regex = /application\/vnd\.ms-excel/;
  if (regex.test(mimeTyp)) return MIME_TYPE[9];
}

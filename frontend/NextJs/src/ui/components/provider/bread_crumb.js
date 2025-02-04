'use client';

import { LayoutContext } from '@/ui/components/provider/layout_provider';
import { usePathname } from 'next/navigation';
import React, { useContext, useEffect } from 'react';

export default function BreadcrumbProvider() {
  //LayoutContext
  const { setBreadcrumbItems } = useContext(LayoutContext);

  const pathname = usePathname();
  const pathArray = pathname.split('/').slice(1);

  useEffect(() => {
    let breadcrumbItems = [{ text: 'Home', href: '/' }];
    let href = '/';
    for (let path of pathArray) {
      breadcrumbItems.push({
        text: capitalize(path),
        href: href == '/' ? (href += `${path}`) : (href += `/${path}`),
      });
    }
    setBreadcrumbItems(breadcrumbItems);
  }, []);

  return <></>;
}

/**
 * 文字列の先頭のみ大文字に変換
 * @param {string} str 対象の文字列
 * @return {string} 変換された文字列を返す
 */
function capitalize(str) {
  if (typeof str !== 'string' || !str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

import TableWrapper from '@/ui/Cloudscape/table';
import Link from 'next/link';
import React from 'react';

export default function RelationalTable(props) {
  const columnDefinitions = [
    {
      id: 'key',
      header: 'Key',
      cell: (item) => <Link href={`#${item.id}`}>{item.key}</Link>,
      sortingField: 'key',
      isRowHeader: true,
    },
    {
      id: 'value',
      header: 'Value',
      cell: (item) => item.value,
      sortingField: 'value',
    },
    {
      id: 'create_at',
      header: 'Created at',
      cell: (item) => item.create_at,
      sortingField: 'create_at',
    },
    {
      id: 'updated_at',
      header: 'Updated at',
      cell: (item) => item.updated_at,
      sortingField: 'updated_at',
    },
  ];

  const columnDisplay = [
    { id: 'key', visible: true },
    { id: 'value', visible: true },
    { id: 'create_at', visible: true },
    { id: 'updated_at', visible: true },
  ];

  return (
    <TableWrapper
      variant={'borderless'}
      columnDefinitions={columnDefinitions}
      columnDisplay={columnDisplay}
      items={props.items}
      loading={props.loading}
      trackBy={'key'}
    />
  );
}

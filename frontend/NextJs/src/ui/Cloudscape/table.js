'use client';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import CollectionPreferences from '@cloudscape-design/components/collection-preferences';
import Header from '@cloudscape-design/components/header';
import Pagination from '@cloudscape-design/components/pagination';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table from '@cloudscape-design/components/table';
import TextFilter from '@cloudscape-design/components/text-filter';
import React, { useState } from 'react';

export default function TableWrapper(props) {
  const [selectedItems, setSelectedItems] = useState([]);

  return (
    <Table
      variant={props.variant ? props.variant : 'container'} //container| borderles | stacked | full-page
      onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
      selectedItems={selectedItems}
      ariaLabels={{
        selectionGroupLabel: 'Items selection',
        allItemsSelectionLabel: ({ selectedItems }) =>
          `${selectedItems.length} ${
            selectedItems.length === 1 ? 'item' : 'items'
          } selected`,
        itemSelectionLabel: ({ selectedItems }, item) => item.name,
      }}
      columnDefinitions={props.columnDefinitions}
      columnDisplay={props.columnDisplay}
      // @ts-ignore
      enableKeyboardNavigation
      items={props.items}
      loading={props.loading}
      loadingText="Loading resources"
      resizableColumns
      selectionType="multi"
      trackBy={props.trackBy ? props.trackBy : undefined}
      empty={
        <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
          <SpaceBetween size="m">
            <b>No resources</b>
          </SpaceBetween>
        </Box>
      }
      /*
      filter={
        <TextFilter filteringPlaceholder="Find resources" filteringText="" />
      }
      */
      header={
        <Header
        /*
          counter={
            selectedItems.length ? "(" + selectedItems.length + "/10)" : "(10)"
          }
          */
        >
          Resources
        </Header>
      }
      //pagination={<Pagination currentPageIndex={1} pagesCount={2} />}
      /*
      preferences={
        <CollectionPreferences
          title="Preferences"
          confirmLabel="Confirm"
          cancelLabel="Cancel"
          preferences={{
            pageSize: 10,
            contentDisplay: [
              { id: "variable", visible: true },
              { id: "value", visible: true },
              { id: "type", visible: true },
              { id: "description", visible: true },
            ],
          }}
          pageSizePreference={{
            title: "Page size",
            options: [
              { value: 10, label: "10 resources" },
              { value: 20, label: "20 resources" },
            ],
          }}
          wrapLinesPreference={{}}
          stripedRowsPreference={{}}
          contentDensityPreference={{}}
          contentDisplayPreference={{
            options: [
              {
                id: "variable",
                label: "Variable name",
                alwaysVisible: true,
              },
              { id: "value", label: "Text value" },
              { id: "type", label: "Type" },
              { id: "description", label: "Description" },
            ],
          }}
          stickyColumnsPreference={{
            firstColumns: {
              title: "Stick first column(s)",
              description:
                "Keep the first column(s) visible while horizontally scrolling the table content.",
              options: [
                { label: "None", value: 0 },
                { label: "First column", value: 1 },
                { label: "First two columns", value: 2 },
              ],
            },
            lastColumns: {
              title: "Stick last column",
              description:
                "Keep the last column visible while horizontally scrolling the table content.",
              options: [
                { label: "None", value: 0 },
                { label: "Last column", value: 1 },
              ],
            },
          }}
        />
      }
      */
    />
  );
}

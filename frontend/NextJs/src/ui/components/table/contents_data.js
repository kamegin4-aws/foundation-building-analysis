import React from "react";
import TableWrapper from "@/ui/cloudscape/table";
import Link from "next/link";
import AudioIcon from "@/ui/react_icons/audio";
import ImageIcon from "@/ui/react_icons/image";
import TextIcon from "@/ui/react_icons/text";
import VideoIcon from "@/ui/react_icons/video";
import JSONIcon from "@/ui/react_icons/json_icon";
import PDFIcon from "@/ui/react_icons/pdf";
import ZipIcon from "@/ui/react_icons/zip";
import WordIcon from "@/ui/react_icons/word";
import PowerPointIcon from "@/ui/react_icons/power_point";
import ExcelIcon from "@/ui/react_icons/excel";

export default function ContentsTable(props) {
  const columnDefinitions = [
    {
      id: "fileName",
      header: "File Name",
      cell: (item) => <Link href={`#${item.key}`}>{item.fileName}</Link>,
      sortingField: "fileName",
      isRowHeader: true,
    },
    {
      id: "mimeType",
      header: "MIME Type",
      cell: (item) => {
        let regex = /audio\//;
        if (regex.test(item.mimeType)) return <AudioIcon />;
        regex = /image\//;
        if (regex.test(item.mimeType)) return <ImageIcon />;
        regex = /text\//;
        if (regex.test(item.mimeType)) return <TextIcon />;
        regex = /video\//;
        if (regex.test(item.mimeType)) return <VideoIcon />;
        regex = /application\/json/;
        if (regex.test(item.mimeType)) return <JSONIcon />;
        regex = /application\/pdf/;
        if (regex.test(item.mimeType)) return <PDFIcon />;
        regex = /application\/zip/;
        if (regex.test(item.mimeType)) return <ZipIcon />;
        regex = /application\/msword/;
        if (regex.test(item.mimeType)) return <WordIcon />;
        regex = /application\/vnd\.ms-powerpoint/;
        if (regex.test(item.mimeType)) return <PowerPointIcon />;
        regex = /application\/vnd\.ms-excel/;
        if (regex.test(item.mimeType)) return <ExcelIcon />;
      },
    },
    {
      id: "size",
      header: "Size(Byte)",
      cell: (item) => item.size,
      sortingField: "size",
    },
    {
      id: "updated_at",
      header: "Updated at",
      cell: (item) => item.lastModified,
      sortingField: "updated_at",
    },
  ];

  const columnDisplay = [
    { id: "fileName", visible: true },
    { id: "mimeType", visible: true },
    { id: "size", visible: true },
    { id: "updated_at", visible: true },
  ];

  return (
    <TableWrapper
      variant={"borderless"}
      columnDefinitions={columnDefinitions}
      columnDisplay={columnDisplay}
      items={props.items}
      loading={props.loading}
      trackBy={"key"}
    />
  );
}

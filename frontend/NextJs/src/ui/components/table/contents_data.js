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
import { mimeTypeCheck } from "@/library/common/mimeType_check";
import { MIME_TYPE } from "@/library/common/constant/mimeType_check";

export default function ContentsTable(props) {
  const columnDefinitions = [
    {
      id: "fileName",
      header: "File Name",
      cell: (item) => (
        <Link
          href={`https://${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN}/${item.key}`}
        >
          {item.fileName}
        </Link>
      ),
      sortingField: "fileName",
      isRowHeader: true,
    },
    {
      id: "mimeType",
      header: "MIME Type",
      cell: (item) => {
        let mimeTypeForApp = mimeTypeCheck(item.mimeType);
        if (mimeTypeForApp == MIME_TYPE[0]) return <AudioIcon />;
        if (mimeTypeForApp == MIME_TYPE[2]) return <ImageIcon />;
        if (mimeTypeForApp == MIME_TYPE[3]) return <TextIcon />;
        if (mimeTypeForApp == MIME_TYPE[1]) return <VideoIcon />;
        if (mimeTypeForApp == MIME_TYPE[4]) return <JSONIcon />;
        if (mimeTypeForApp == MIME_TYPE[5]) return <PDFIcon />;
        if (mimeTypeForApp == MIME_TYPE[6]) return <ZipIcon />;
        if (mimeTypeForApp == MIME_TYPE[7]) return <WordIcon />;
        if (mimeTypeForApp == MIME_TYPE[8]) return <PowerPointIcon />;
        if (mimeTypeForApp == MIME_TYPE[9]) return <ExcelIcon />;
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

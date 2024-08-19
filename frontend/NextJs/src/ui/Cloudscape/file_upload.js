import FileUpload from '@cloudscape-design/components/file-upload';
import FormField from '@cloudscape-design/components/form-field';
import React from 'react';

export default function FileUploadWrapper(props) {
  //const [value, setValue] = useState([]);

  return (
    <FormField
      label={props.label ? props.label : ''}
      description={props.description ? props.description : ''}
    >
      <FileUpload
        onChange={({ detail }) => {
          //setValue(detail.value);
          props.parentSetValue(detail.value);
        }}
        value={props.value ? props.value : []}
        accept={props.accept ? props.accept : undefined}
        i18nStrings={{
          uploadButtonText: (e) => (e ? 'Choose files' : 'Choose file'),
          dropzoneText: (e) =>
            e ? 'Drop files to upload' : 'Drop file to upload',
          removeFileAriaLabel: (e) => `Remove file ${e + 1}`,
          limitShowFewer: 'Show fewer files',
          limitShowMore: 'Show more files',
          errorIconAriaLabel: 'Error',
        }}
        multiple
        showFileLastModified
        showFileSize
        showFileThumbnail
        tokenLimit={3}
        constraintText={props.constraintText ? props.constraintText : ''}
        fileErrors={props.fileErrors ? props.fileErrors : []}
        errorText={props.errorText ? props.errorText : ''}
      />
    </FormField>
  );
}

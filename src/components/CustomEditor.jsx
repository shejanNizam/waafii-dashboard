import { Editor } from "@tinymce/tinymce-react";
import React, { useEffect } from "react";

const CustomEditor = React.forwardRef((props, ref) => {
  const { placeholder, defaultValue, init, ...otherProps } = props;

  // Auto-focus the editor after mount with a slight delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (ref && typeof ref !== "function" && "current" in ref && ref.current) {
        ref.current.focus();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [ref]);

  return (
    <>
      {/* Hide the TinyMCE promo "Explore trial" button */}
      <style>{`.tox-promotion { display: none !important; }`}</style>

      <Editor
        initialValue={defaultValue}
        {...otherProps} // Pass all other props from the parent component
        apiKey="jaq683ig9tewoqsq3ksnblud8zm62skkssw7gyfv80onr6of"
        onInit={(_evt, editor) => {
          // Set the editor instance to the forwarded ref
          if (typeof ref === "function") {
            ref(editor);
          } else if (ref && "current" in ref) {
            ref.current = editor;
          }
        }}
        init={{
          height: 400,
          menubar: true,
          branding: false, // Remove TinyMCE branding
          statusbar: false,
          elementpath: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
          ],
          resize: true, // Make the editor resizable
          toolbar:
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          placeholder: placeholder || "Start typing your content...",
          ...init, // Allow overriding init options from props
        }}
      />
    </>
  );
});

CustomEditor.displayName = "CustomEditor";

export default CustomEditor;

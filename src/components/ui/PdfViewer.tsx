const PdfViewer = ({ base64Data }: { base64Data: string }) => {
  const pdfDataUrl = `data:application/pdf;base64,${base64Data}`;

  return (
    <embed
      src={pdfDataUrl}
      type="application/pdf"
      title="PDF Preview"
      width="100%"
      height="600px"
      style={{ border: "none" }}
    />
  );
};

export default PdfViewer;

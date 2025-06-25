declare module 'html-docx-js/dist/html-docx' {
    const htmlDocx: {
      asBlob: (htmlString: string) => Blob;
      asUint8Array: (htmlString: string) => Uint8Array;
    };
    export = htmlDocx;
  }
  
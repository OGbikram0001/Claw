// @ts-nocheck
import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boxicons@2.1.4/css/boxicons.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/devicon.min.css" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: `
          body > div:first-child { position: fixed !important; top: 0; left: 0; right: 0; bottom: 0; }
          [role="tablist"] [role="tab"] * { overflow: visible !important; }
          [role="heading"], [role="heading"] * { overflow: visible !important; }
          * { -webkit-font-smoothing: antialiased; box-sizing: border-box; }
          ::-webkit-scrollbar { width: 0; height: 0; }
          i.bx, i[class^="devicon-"], i[class*=" devicon-"] {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
          }
        ` }} />
      </head>
      <body style={{ margin: 0, height: "100%", overflow: "hidden", display: "flex", flexDirection: "column", backgroundColor: "#0C0B09" }}>
        {children}
      </body>
    </html>
  );
}

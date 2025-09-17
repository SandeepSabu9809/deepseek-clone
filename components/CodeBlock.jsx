import { useEffect, useRef } from "react";
import Prism from "prismjs";
import "../src/app/prism.css"; 

function CodeBlock({ className, children, ...props }) {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [children]);

  return (
    <pre className="p-3 overflow-x-auto bg-[#1c1b1b] rounded-md">
      <code ref={codeRef} className={className || "language-js"} {...props}>
        {children}
      </code>
    </pre>
  );
}

export default CodeBlock;

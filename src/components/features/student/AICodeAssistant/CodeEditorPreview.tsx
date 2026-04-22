"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  SandpackProvider, 
  SandpackLayout, 
  SandpackCodeEditor, 
  SandpackPreview,
  useSandpack
} from "@codesandbox/sandpack-react";
import { atomDark } from "@codesandbox/sandpack-themes";
import { ChevronRight, Code2, Eye, EyeOff } from "lucide-react";

/* ── Animation variants ── */
const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

/**
 * Internal component to handle programmatic file switching using Sandpack Context
 */
function SandpackInternal({ 
  activeFile, 
  showPreview 
}: { 
  activeFile: string; 
  showPreview: boolean 
}) {
  const { sandpack } = useSandpack();

  // Sync external state with Sandpack internal state
  if (sandpack.activeFile !== activeFile) {
    sandpack.setActiveFile(activeFile);
  }

  return (
    <SandpackLayout className="flex-1 w-full !rounded-none !border-none !bg-transparent flex flex-row min-h-0 h-full overflow-hidden">
        <SandpackCodeEditor 
            showTabs={false} 
            showLineNumbers
            className="h-full !border-r !border-border-default flex-1 premium-editor min-h-full"
            showInlineErrors
            wrapContent
        />
        <AnimatePresence mode="wait">
            {showPreview && (
                <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "50%", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="h-full flex flex-col bg-white overflow-hidden min-h-full"
                >
                    <SandpackPreview 
                        showOpenInCodeSandbox={false}
                        className="!h-full w-full"
                        showRefreshButton={false}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    </SandpackLayout>
  );
}

const defaultFiles = {
  "/index.html": {
    code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <div id="app">
    <div class="card">
        <h1>Void Design</h1>
        <p>Tactile performance testing environment.</p>
        <button id="cta">Initialize Action</button>
    </div>
  </div>
  <script src="/script.js"></script>
</body>
</html>`,
  },
  "/styles.css": {
    code: `body {
  font-family: 'Inter', system-ui, sans-serif;
  background: #050505;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}
.card {
  background: #0A0A0A;
  padding: 3rem;
  border-radius: 1rem;
  border: 1px solid #1A1A1A;
  text-align: center;
}
h1 { font-weight: 900; letter-spacing: -0.05em; margin: 0; }
p { color: #A1A1AA; font-size: 0.875rem; margin: 1rem 0 2rem; }
button {
  background: #fff; color: #000; border: none; padding: 0.75rem 1.5rem;
  border-radius: 0.5rem; font-weight: 700; cursor: pointer;
  transition: all 0.2s;
}
button:hover { background: #E5E5E5; transform: scale(0.98); }`,
  },
  "/script.js": {
    code: `const btn = document.getElementById('cta');
btn.addEventListener('click', () => {
    btn.innerHTML = 'Action Recorded';
    console.log("System initialized.");
});`,
  },
};

export default function CodeEditorPreview() {
  const [activeFile, setActiveFile] = useState<"/index.html" | "/styles.css" | "/script.js">("/index.html");
  const [showPreview, setShowPreview] = useState(true);

  return (
    <motion.div
      className="p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-6 h-full"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Breadcrumbs */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-2 text-[13px] text-[#A1A1AA] font-medium"
      >
        <Link href="/student" className="hover:text-white transition-colors cursor-pointer">
          Home
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <span className="text-[#F2F2F2]">Code Playground</span>
      </motion.div>

      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Code2 size={24} className="text-[#A1A1AA]" />
            <h1 className="text-[#F2F2F2] text-2xl lg:text-3xl font-bold leading-tight">
              Code Playground
            </h1>
          </div>
          <p className="text-[#A1A1AA] text-sm">
            Write HTML, CSS, and JavaScript — preview the results instantly in a live sandbox.
          </p>
        </div>

        <button 
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border-default bg-surface-200 text-sm font-semibold text-[#A1A1AA] hover:text-white hover:bg-surface-300 hover:border-white/20 transition-all cursor-pointer"
        >
          {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
          <span>{showPreview ? "Hide Preview" : "Show Preview"}</span>
        </button>
      </motion.div>

      {/* Gradient Separator */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent opacity-30" />

      {/* Editor Card */}
      <motion.div 
        variants={fadeUp}
        className="flex-1 min-h-0 flex flex-col bg-surface-200 border border-border-default rounded-xl overflow-hidden"
      >
        {/* File tabs toolbar */}
        <div className="flex items-center justify-between px-4 py-3 bg-surface-300 border-b border-border-default">
            <div className="flex items-center gap-1.5 p-1 bg-surface-200 rounded-lg border border-border-default">
                {(["/index.html", "/styles.css", "/script.js"] as const).map(file => (
                    <button
                        key={file}
                        onClick={() => setActiveFile(file)}
                        className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            activeFile === file 
                            ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                            : 'text-[#A1A1AA] hover:text-white'
                        }`}
                    >
                        {file.replace('/', '')}
                    </button>
                ))}
            </div>
            
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#A1A1AA] font-medium uppercase tracking-wider">
                Workspace: Web Vanilla
            </div>
        </div>

        {/* Sandpack Editor + Preview */}
        <div className="flex-1 min-h-0 overflow-hidden">
            <SandpackProvider 
                template="vanilla" 
                theme={atomDark} 
                files={defaultFiles}
            >
                <div className="h-full flex flex-col">
                    <SandpackInternal activeFile={activeFile} showPreview={showPreview} />
                </div>
            </SandpackProvider>
        </div>
      </motion.div>
    </motion.div>
  );
}

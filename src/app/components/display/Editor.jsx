import { useRef, useEffect } from "react";

export default function Editor({ mode, file, access, content, onChange, onSave, onQuit }) {


  if (mode !== "EDITOR") {
    return null
  }


  const ref = useRef(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  function handleKeyDown(e) {
    if (e.ctrlKey && e.key === "s" || e.ctrlKey && e.key === "S") {
      e.preventDefault();
      onSave();
    }

    if (e.ctrlKey && e.key === "q" || e.ctrlKey && e.key === "Q") {
      e.preventDefault();
      onQuit();
    }

    if (e.key === 'Tab') {
      e.preventDefault()

      const textarea = e.target
      let start = textarea.selectionStart;
      let end = textarea.selectionEnd;


      let tab = '\t';
      const newValue = content.substring(0, start) + tab + content.substring(end);

      onChange(newValue);
    }
  }

  return (
    <div className="fixed inset-0 z-50  my-10 bg-black">
      <div

        className="h-[80vh] overflow-y-auto  font-mono p-5 border no-scrollbar text-gray-400 rounded-md my-10"

      >
        <div className="mt-2 border-t  pt-2">

          <div className=" text-sm mb-1 text-center">
            <div className="flex">
              <div className="mx-auto">{`-- ${access} MODE --`}</div>

              <button
                className="text-gray-500"
                onClick={onQuit}
              >✕</button>
            </div>
          </div>
          <div className=" text-xs mb-2 text-center">
            file: {file} · Ctrl+S save · Ctrl+Q quit

          </div>


          <div className="flex flex-1 overflow-hidden">
            <div className="px-2 py-3 text-right select-none  bg-black border-r ">
              {content.split("\n").map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            <textarea
              ref={ref}
              value={content}
              disabled={access === "READ" ? true : false}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="
          flex-1 bg-black outline-none resize-none p-3 [caret-shape:block] whitespace-pre overflow-x-auto overflow-y-auto no-scrollbar-textarea"
              spellCheck={false}
              onScroll={(e) => {
                e.target.previousSibling.scrollTop = e.target.scrollTop;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

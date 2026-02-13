function Editor({ file, content, onChange, onSave, onQuit }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  function handleKeyDown(e) {
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      onSave();
    }

    if (e.ctrlKey && e.key === "q") {
      e.preventDefault();
      onQuit();
    }
  }

  return (
    <div className="mt-2 border-t border-green-700 pt-2">
      <div className="text-green-500 text-sm mb-1">
        -- WRITE MODE --
      </div>
      <div className="text-green-600 text-xs mb-2">
        editing: {file} · Ctrl+S save · Ctrl+Q quit
      </div>

      <textarea
        ref={ref}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="
          w-full
          h-64
          bg-black
          text-green-400
          font-mono
          outline-none
          resize-none
          whitespace-pre-wrap
        "
      />
    </div>
  );
}

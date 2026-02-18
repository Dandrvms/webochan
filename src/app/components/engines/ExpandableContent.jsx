import MarkdownRenderer from "./MarkDownRenderer";
import { useState } from "react"
export const ExpandableMarkdown = ({ text, boardId, limit = 450, onReferenceClick, comments }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
 
    if (!text || text.length <= limit) {
        return <MarkdownRenderer text={text} boardId={boardId} onReferenceClick={onReferenceClick} comments={comments} />;
    }

 
    const textToRender = isExpanded ? text : text.slice(0, limit) + "...";

    return (
        <div className="flex flex-col">
            <MarkdownRenderer 
                text={textToRender} 
                boardId={boardId} 
                onReferenceClick={onReferenceClick} 
                comments={comments} 
            />
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-[10px] font-mono self-start text-gray-500 hover:text-black hover:bg-white uppercase"
            >
                {isExpanded ? "[ COMPRIMIR - ]" : "[ EXPANDIR... + ]"}
            </button>
        </div>
    );
};
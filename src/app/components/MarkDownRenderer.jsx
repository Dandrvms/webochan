"use client";
import { useState } from 'react';

export default function MarkdownRenderer({ text, onReferenceClick, comments }) {
    const lines = text.split("\n");
    const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });

    // Helper para buscar comentario por id
    const getCommentById = (id) => {
        if (!comments) return null;
        return comments.find(c => String(c.id) === String(id));
    };

    // Helper para procesar enlaces dentro de un fragmento de texto
    function renderLinks(fragment, keyBase = 0) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = [];
        let lastIndex = 0;
        let match;
        let key = keyBase;
        while ((match = urlRegex.exec(fragment)) !== null) {
            if (match.index > lastIndex) {
                parts.push(fragment.slice(lastIndex, match.index));
            }
            parts.push(
                <a
                    key={key++}
                    href={match[1]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 underline break-all"
                >
                    {match[1]}
                </a>
            );
            lastIndex = match.index + match[0].length;
        }
        if (lastIndex < fragment.length) {
            parts.push(fragment.slice(lastIndex));
        }
        return parts;
    }

    // Helper para procesar referencias dentro de un fragmento de texto
    function renderRefs(fragment, keyBase = 0) {
        const refRegex = />>(\d+)/g;
        const parts = [];
        let lastIndex = 0;
        let match;
        let key = keyBase;
        while ((match = refRegex.exec(fragment)) !== null) {
            if (match.index > lastIndex) {
                // Procesa enlaces en el texto normal
                parts.push(...renderLinks(fragment.slice(lastIndex, match.index), key));
                key += 1000;
            }
            const referenceId = match[1];
            const referencedComment = getCommentById(referenceId);
            parts.push(
                <span
                    key={key++}
                    onClick={() => onReferenceClick && onReferenceClick(Number(referenceId))}
                    onMouseEnter={e => {
                        if (referencedComment) {
                            setTooltip({
                                show: true,
                                content: referencedComment,
                                x: e.clientX,
                                y: e.clientY
                            });
                        }
                    }}
                    onMouseLeave={() => setTooltip({ show: false, content: null, x: 0, y: 0 })}
                    style={{ cursor: 'pointer', position: 'relative' }}
                    className="text-blue-500 hover:underline"
                >
                    {`>>${referenceId}`}
                </span>
            );
            lastIndex = match.index + match[0].length;
        }
        if (lastIndex < fragment.length) {
            parts.push(...renderLinks(fragment.slice(lastIndex), key));
        }
        return parts;
    }

    return (
        <>
            {lines.map((line, index) => {
                // Greentext
                const greenMatch = line.match(/^>(?!>)(.*)/);
                if (greenMatch) {
                    return (
                        <span key={index} className="text-green-500 ">
                            {greenMatch[0]}
                            <br />
                        </span>
                    );
                }
                // Redtext
                const redMatch = line.match(/^<\s?(.*)/);
                if (redMatch) {
                    return (
                        <span key={index} className="text-pink-700 ">
                            {redMatch[0]}
                            <br />
                        </span>
                    );
                }
                // Procesar negrita y referencias en la misma línea
                const boldRegex = /\*\*(.+?)\*\*/g;
                let lastIndex = 0;
                let match;
                let key = 0;
                const parts = [];
                while ((match = boldRegex.exec(line)) !== null) {
                    if (match.index > lastIndex) {
                        // Procesa referencias en el texto normal
                        parts.push(...renderRefs(line.slice(lastIndex, match.index), key));
                        key += 1000;
                    }
                    // Procesa referencias dentro de la negrita
                    parts.push(
                        <span key={key++} className="font-extrabold">
                            {renderRefs(match[1], key)}
                        </span>
                    );
                    key += 1000;
                    lastIndex = match.index + match[0].length;
                }
                if (lastIndex < line.length) {
                    parts.push(...renderRefs(line.slice(lastIndex), key));
                }
                return (
                    <span  key={index}>
                        {parts}
                        <br />
                    </span>
                );
            })}
            {/* Tooltip */}
            {tooltip.show && tooltip.content && (
                <div
                    style={{
                        position: 'fixed',
                        top: tooltip.y + 10,
                        left: tooltip.x + 10,
                        zIndex: 1000,
                        background: '#222',
                        color: '#fff',
                        padding: '8px',
                        borderRadius: '6px',
                        maxWidth: '300px',
                        pointerEvents: 'none',
                        boxShadow: '0 2px 8px rgb(30, 255, 255)'
                    }}
                >
                    <MarkdownRenderer text={"**wbn N. " + tooltip.content.id + "**\n\n" + tooltip.content.content} comments={comments} onReferenceClick={onReferenceClick} />
                </div>
            )}
        </>
    );
}
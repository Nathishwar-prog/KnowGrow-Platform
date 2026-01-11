"use client"
import React, { useEffect, useRef, useMemo } from "react";

function normalizeChapterTitle(chapter, index) {
    const rawTitle = chapter?.chapterName || chapter?.name || '';
    
    const cleaned = rawTitle
        .replace(/^chapter\s*\d+\s*[:\-–]\s*/i, '')
        .replace(/^\d+\.\s*/, '')
        .trim();
    
    if (cleaned.length > 40) {
        return cleaned.substring(0, 37) + '...';
    }
    
    return cleaned || `Chapter ${index + 1}`;
}

function normalizeTopics(chapter) {
    const topics = chapter?.topics || [];
    return topics.map(t => {
        if (typeof t === 'string') {
            const cleaned = t.replace(/^\d+\.\s*/, '').trim();
            return cleaned.length > 50 ? cleaned.substring(0, 47) + '...' : cleaned;
        }
        const name = t?.name || t?.topic || '';
        const cleaned = name.replace(/^\d+\.\s*/, '').trim();
        return cleaned.length > 50 ? cleaned.substring(0, 47) + '...' : cleaned;
    }).filter(Boolean);
}

function drawCourseMap(canvas, courseLayout){
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const primary = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#10b981';
    const muted = getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground').trim() || '#6b7280';
    const nodeBg = getComputedStyle(document.documentElement).getPropertyValue('--card').trim() || '#ffffff';

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, 'rgba(16, 185, 129, 0.06)');
    grad.addColorStop(1, 'rgba(16, 185, 129, 0.02)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    const padding = 24;
    const colGap = 160;
    const rowGap = 72;
    const chapterX = padding + 12;
    const topicX = chapterX + colGap;

    ctx.fillStyle = muted;
    ctx.font = '700 14px ui-sans-serif, system-ui, -apple-system';
    ctx.fillText('Learning Roadmap', padding, padding + 4);

    const chapters = courseLayout?.chapters || [];
    let y = padding + 28;

    chapters.forEach((chapter, chapterIndex) => {
        const chW = 200;
        const chH = 40;
        const chX = chapterX;
        const chY = y;

        if (chapterIndex > 0){
            ctx.strokeStyle = primary;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(chX + chW/2, chY - rowGap + chH);
            ctx.lineTo(chX + chW/2, chY);
            ctx.stroke();
        }

        ctx.fillStyle = nodeBg;
        ctx.strokeStyle = primary;
        ctx.lineWidth = 2;
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.08)';
        ctx.shadowBlur = 12;
        roundRect(ctx, chX, chY, chW, chH, 10, true, true);
        ctx.restore();
        ctx.fillStyle = primary;
        ctx.font = '600 12px ui-sans-serif, system-ui, -apple-system';
        
        const normalizedTitle = normalizeChapterTitle(chapter, chapterIndex);
        const chTitle = `Ch ${chapterIndex+1}: ${normalizedTitle}`;
        const maxTitleWidth = chW - 20;
        let displayTitle = chTitle;
        if (ctx.measureText(chTitle).width > maxTitleWidth) {
            while (ctx.measureText(displayTitle + '...').width > maxTitleWidth && displayTitle.length > 10) {
                displayTitle = displayTitle.slice(0, -1);
            }
            displayTitle += '...';
        }
        ctx.fillText(displayTitle, chX + 10, chY + 24);

        const topics = normalizeTopics(chapter);
        const topicBoxH = Math.max(48, topics.length * 26 + 20);
        const tpX = topicX;
        const tpY = chY;

        ctx.strokeStyle = primary;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(chX + chW, chY + chH/2);
        ctx.lineTo(tpX, tpY + 16);
        ctx.stroke();

        ctx.fillStyle = nodeBg;
        ctx.strokeStyle = primary;
        roundRect(ctx, tpX, tpY, 280, topicBoxH, 10, true, true);
        
        ctx.fillStyle = primary;
        roundRect(ctx, tpX + 10, tpY + 10, 64, 18, 8, true, false);
        ctx.fillStyle = nodeBg;
        ctx.font = '700 10px ui-sans-serif, system-ui, -apple-system';
        ctx.fillText('TOPICS', tpX + 22, tpY + 23);
        
        ctx.fillStyle = muted;
        ctx.font = '500 12px ui-sans-serif, system-ui, -apple-system';

        topics.forEach((t, i)=>{
            const text = `${i+1}. ${t}`;
            const maxWidth = 260;
            let displayText = text;
            if (ctx.measureText(text).width > maxWidth) {
                while (ctx.measureText(displayText + '...').width > maxWidth && displayText.length > 10) {
                    displayText = displayText.slice(0, -1);
                }
                displayText += '...';
            }
            ctx.fillText(displayText, tpX + 14, tpY + 38 + i*26);
        });

        y += Math.max(chH, topicBoxH) + rowGap;
    });
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof radius === 'number') {
        radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
        radius = {...{tl:0, tr:0, br:0, bl:0}, ...radius}
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
}

function CourseMapPanel({ course }){
    const canvasRef = useRef(null);
    const courseLayout = course?.courseJson?.course;

    const normalizedLayout = useMemo(() => {
        if (!courseLayout?.chapters) return null;
        
        return {
            ...courseLayout,
            chapters: courseLayout.chapters.map((ch, idx) => ({
                ...ch,
                _normalizedTitle: normalizeChapterTitle(ch, idx),
                _normalizedTopics: normalizeTopics(ch)
            }))
        };
    }, [courseLayout]);

    useEffect(()=>{
        if (!canvasRef.current || !normalizedLayout) return;
        drawCourseMap(canvasRef.current, normalizedLayout);
        const onResize = ()=> drawCourseMap(canvasRef.current, normalizedLayout);
        window.addEventListener('resize', onResize);
        return ()=> window.removeEventListener('resize', onResize);
    }, [normalizedLayout]);

    return (
        <div className="rounded-2xl border overflow-hidden bg-gradient-to-br from-white to-emerald-50 dark:from-emerald-900/10 dark:to-emerald-900/20">
            <div className="px-4 py-2 flex items-center gap-2 bg-secondary border-b">
                <div className='h-3 w-3 rounded-full bg-red-400'></div>
                <div className='h-3 w-3 rounded-full bg-yellow-400'></div>
                <div className='h-3 w-3 rounded-full bg-green-400'></div>
                <span className='ml-2 text-xs text-muted-foreground'>AI Course Roadmap</span>
                <div className='ml-auto flex items-center gap-3 text-[10px] text-muted-foreground'>
                    <span className='inline-flex items-center gap-1'><span className='inline-block h-2 w-2 rounded-full bg-emerald-500'></span> Chapter</span>
                    <span className='inline-flex items-center gap-1'><span className='inline-block h-2 w-2 rounded bg-emerald-300'></span> Topics</span>
                </div>
            </div>
            <div className="p-4 min-h-[280px]">
                <canvas ref={canvasRef} className="w-full h-[280px]" />
            </div>
        </div>
    )
}

export default CourseMapPanel;

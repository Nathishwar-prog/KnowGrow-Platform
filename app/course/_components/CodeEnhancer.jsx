"use client"
import React, { useEffect } from "react";

// Enhances rendered HTML content: styles code blocks and adds copy buttons
function CodeEnhancer({ containerId }){
  useEffect(()=>{
    const container = document.getElementById(containerId);
    if (!container) return;

    const pres = container.querySelectorAll('pre');
    pres.forEach((pre) => {
      // Skip if already enhanced
      if (pre.dataset.enhanced === 'true') return;
      pre.dataset.enhanced = 'true';

      pre.classList.add('kg-code', 'p-4', 'rounded-md');

      // Wrap with a positioned container for copy button
      const wrap = document.createElement('div');
      wrap.className = 'kg-code-wrap relative';
      pre.parentNode?.insertBefore(wrap, pre);
      wrap.appendChild(pre);

      // Create copy button
      const copyBtnWrap = document.createElement('div');
      copyBtnWrap.className = 'copy-area absolute top-2 right-2';
      const btn = document.createElement('button');
      btn.className = 'kg-copy-btn';
      btn.type = 'button';
      btn.textContent = 'Copy';
      btn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(pre.innerText);
          btn.textContent = 'Copied';
          setTimeout(()=> (btn.textContent = 'Copy'), 1200);
        } catch {}
      };
      copyBtnWrap.appendChild(btn);
      wrap.appendChild(copyBtnWrap);
    });
  }, [containerId]);

  return null;
}

export default CodeEnhancer;



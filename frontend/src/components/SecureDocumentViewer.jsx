import React,{useEffect,useRef,useState} from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc=workerSrc;
export default function SecureDocumentViewer({url,mimeType}){
 const[pages,setPages]=useState([]);const container=useRef(null);
 useEffect(()=>{let cancelled=false; if(mimeType!=='application/pdf')return; (async()=>{const loading=pdfjsLib.getDocument(url);const pdf=await loading.promise;const out=[];for(let i=1;i<=pdf.numPages;i++){const page=await pdf.getPage(i);const viewport=page.getViewport({scale:1.35});const canvas=document.createElement('canvas');canvas.width=viewport.width;canvas.height=viewport.height;canvas.className='secure-pdf-page';await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;out.push(canvas)}if(!cancelled)setPages(out)})();return()=>{cancelled=true}},[url,mimeType]);
 if(mimeType!=='application/pdf')return <img src={url} alt="Medical report" className="report-image-viewer" draggable="false" onContextMenu={e=>e.preventDefault()}/>;
 return <div ref={container} className="secure-pdf-viewer" onContextMenu={e=>e.preventDefault()}>{pages.map((canvas,i)=><div key={i} ref={el=>{if(el&&canvas.parentNode!==el)el.appendChild(canvas)}} className="secure-pdf-page-wrap"/> )}</div>
}

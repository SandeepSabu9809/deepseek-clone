import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Markdown from 'react-markdown'
import Prism from 'prismjs'

import CodeBlock from "./CodeBlock";  // adjust path if needed

import toast from 'react-hot-toast'

const Message = ({role,content}) => {

  
   const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    let utteranceRef = null;


   const [highlighted, setHighlighted] = useState(false);

   useEffect(() => {
  Prism.highlightAll();
}, [content]);

    
    useEffect(() => {
        const handleVoicesChanged = () => {
            setVoices(window.speechSynthesis.getVoices());
        };

        window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);

        return () => {
            window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
        };
        }, []);
        
        

    const playVoice = (text) => {
  if (!text) return;

  // If currently paused → resume
  if (isPaused) {
    window.speechSynthesis.resume();
    setIsPaused(false);
    return;
  }

  // If already playing → pause
  if (isPlaying) {
    window.speechSynthesis.pause();
    setIsPaused(true);
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Create new speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  utterance.pitch = 1.1;

  // pick female voice if available
  const voices = window.speechSynthesis.getVoices();
  const femaleVoice = voices.find((v) =>
    ["female", "woman", "girl", "samantha", "zira"].some((k) =>
      v.name.toLowerCase().includes(k)
    )
  );
  if (femaleVoice) utterance.voice = femaleVoice;

  // when finished
  utterance.onend = () => {
    setIsPlaying(false);
    setIsPaused(false);
  };

  utteranceRef = utterance;
  setIsPlaying(true);
  setIsPaused(false);
  window.speechSynthesis.speak(utterance);
}; 


  

    const copyMessage = () =>{
        navigator.clipboard.writeText(content)
        toast.success('Message copied to clipboard')
    }
 
 
    return (
    <div className='flex flex-col items-center w-full max-w-3xl text-sm'>
        <div className={`flex flex-col w-full mb-8 ${role == 'user' && 'items-end'}`}>
            <div className={`group relative flex max-w-3xl py-3 rounded-xl ${role === 'user' ? 'bg-[#414158] px-5 ': 'gap-3'} `}>
                <div className={`opacity-0 group-hover:opacity-100 absolute ${role === 'user' ? '-left-16 top-2.5' : 'left-9 -bottom-6'} transition-all `}>
                    <div className='flex items-center gap-2 opacity-70'>
                        {
                            role === 'user' ? (
                                <>
                                <Image onClick={copyMessage} src={assets.copy_icon} alt='' className='w-4 cursor-pointer' />
                                <Image src={assets.pencil_icon} alt='' className='w-4.5 cursor-pointer' />
                                </>
                            ):(
                                <>
                                <Image onClick={copyMessage} src={assets.copy_icon} alt='' className='w-4.5 cursor-pointer' />
                                <Image src={assets.regenerate_icon} alt='' className='w-4 cursor-pointer' />
                                <Image src={assets.like_icon} alt='' className='w-4 cursor-pointer' />
                                <Image src={assets.dislike_icon} alt='' className='w-4 cursor-pointer'/>
                               <span
                                className={`cursor-pointer w-6 h-5.8 transition-all ${
                                    isPlaying && !isPaused ? "animate-pulse text-gray-200" : ""
                                } ${isPaused ? "opacity-70 text-gray-200" : "hover:opacity-80"}`}
                                onClick={() => playVoice(content)}
                                dangerouslySetInnerHTML={{
                                    __html: isPaused
                                    ? `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-6 h-6"><path d="M6 19h4V5H6zm8-14v14h4V5h-4z"/></svg>` // pause icon
                                    : `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-6 h-6"><path d="M8 5v14l11-7z"/></svg>` // play icon
                                }}
                                ></span>



                                </>
                            )
                        }
                    </div>
                </div>
                {
                    role === 'user' ? (
                        <span className='text-white/90'>{content}</span>
                    ):(
                        <>
                        <Image src={assets.logo_icon} alt='' className='h-9 w-9 p-1 border border-white/15 rounded-full' />
                        <div className="prose prose-md text-white break-words max-w-[80%] p-4 rounded-xl space-y-3">
        <Markdown
  components={{
    pre({ node, ...props }) {
      const codeText = props.children?.[0] || "";

      return (
        <div className="relative bg-[#1c1b1b] p-4 rounded-md overflow-hidden">
          {/* Copy button */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(codeText);
              toast.success("Code copied!");
            }}
            className="flex items-center gap-1 absolute top-2 right-2 px-2 py-1 text-xs text-white bg-[#444] rounded hover:bg-[#555] transition"
          >
            <Image src={assets.copy_icon} alt="copy" className="w-4 h-4" />
            Copy code
          </button>

          <pre className="p-3 overflow-x-auto" {...props} />
        </div>
      );
    },
    code({ node, inline, className, children, ...props }) {
      return inline ? (
        <code
          className="bg-[#272727] px-1 py-0.5 rounded text-pink-500"
          {...props}
        >
          {children}
        </code>
      ) : (
        <code className={className} {...props}>{children}</code>
      );
    },
  }}
>
  {content}
</Markdown>

        </div>

                        </>
                    )
                }
            </div>
        </div>
      
    </div>
  )
}

export default Message

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HorizontalTicker: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !wrapperRef.current) return;

        const wrapper = wrapperRef.current;
        const container = containerRef.current;

        // 1. HORIZONTAL SCROLL
        const getScrollAmount = () => {
            let wrapperWidth = wrapper.scrollWidth;
            return -(wrapperWidth - window.innerWidth);
        };

        const horizontalTween = gsap.to(wrapper, {
            x: getScrollAmount,
            ease: "none",
            scrollTrigger: {
                trigger: container,
                pin: true,
                scrub: 1,
                end: () => `+=${wrapper.scrollWidth}`,
                invalidateOnRefresh: true,
            }
        });

        // 2. TEXT ANIMATIONS
        const textSegments = wrapper.querySelectorAll('.text-segment');

        textSegments.forEach(segment => {
            const chars = segment.querySelectorAll('.char');

            gsap.to(chars, {
                opacity: 1,
                y: 0,
                skewX: 0,
                duration: 1,
                stagger: 0.03,
                ease: "back.out(2)",
                scrollTrigger: {
                    trigger: segment,
                    containerAnimation: horizontalTween,
                    start: "left 90%",
                    end: "left 50%",
                    scrub: 1,
                }
            });
        });

        // 3. VISUAL ELEMENT ANIMATIONS
        const shapes = wrapper.querySelectorAll('.visual-element');

        shapes.forEach(shape => {
            gsap.fromTo(shape,
                { scale: 0, rotation: -45, opacity: 0 },
                {
                    scale: 1,
                    rotation: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: shape,
                        containerAnimation: horizontalTween,
                        start: "left 85%",
                        end: "left 60%",
                        scrub: 1
                    }
                }
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    const splitText = (text: string) => {
        return text.split('').map((char, index) => (
            <span key={index} className="char inline-block opacity-0 translate-y-[40px] skew-x-[20deg] origin-bottom-left will-change-[transform,opacity]">
                {char === ' ' ? '\u00A0' : char}
            </span>
        ));
    };

    return (
        <div className="relative">
            <div className="fixed bottom-8 left-8 text-[0.8rem] uppercase tracking-[1px] opacity-50 z-[100] text-white pointer-events-none">
                Scroll Down ↓
            </div>

            <div ref={containerRef} className="scroller-container w-full h-screen overflow-hidden flex items-center bg-[#0f0f0f] relative font-['Helvetica_Neue',Arial,sans-serif] text-[#f0f0f0] antialiased">
                <div ref={wrapperRef} className="horizontal-wrapper flex flex-nowrap items-center h-screen pl-[10vw] pr-[20vw] will-change-transform">

                    <div className="ticker-item text-segment mr-[1vw] text-[clamp(3rem,6vw,8rem)] font-light whitespace-nowrap flex items-center leading-none select-none">
                        {splitText("Everyone loves a good design")}
                    </div>

                    <div className="ticker-item visual-element mx-[4vw] flex-shrink-0 w-[3vw] h-[3vw] rounded-full bg-[#FF4B4B] shadow-[0_0_20px_rgba(255,75,75,0.4)]"></div>

                    <div className="ticker-item text-segment mr-[8vw] text-[clamp(3rem,6vw,8rem)] font-light whitespace-nowrap flex items-center leading-none select-none">
                        {splitText("but only a few")}
                    </div>

                    <div className="ticker-item visual-element mx-[4vw] flex-shrink-0 w-[8vw] h-[2.5vw] rounded-[50px] border-2 border-[#4B83FF] bg-transparent"></div>

                    <div className="ticker-item text-segment mr-[1vw] text-[clamp(3rem,6vw,8rem)] font-light whitespace-nowrap flex items-center leading-none select-none">
                        {splitText("can genuinely create it.")}
                    </div>

                    <div className="ticker-item visual-element mx-[4vw] flex-shrink-0 w-[1vw] h-[6vw] bg-white mx-[3vw]"></div>

                    <div className="ticker-item text-segment mr-[4vw] text-[clamp(3rem,6vw,8rem)] font-light whitespace-nowrap flex items-center leading-none select-none">
                        {splitText("Let's work together")}
                    </div>

                    <div className="ticker-item visual-element mx-[4vw] flex-shrink-0 w-0 h-0 border-l-[1.5vw] border-l-transparent border-r-[1.5vw] border-r-transparent border-bottom-[2.5vw] border-bottom-[#FFE74B] relative rotate-[35deg] after:content-[''] after:w-0 after:h-0 after:border-l-[1.5vw] after:border-l-transparent after:border-r-[1.5vw] after:border-r-transparent after:border-t-[2.5vw] after:border-t-[#FFE74B] after:absolute after:top-[0.8vw] after:left-[-1.5vw]"></div>

                    <div className="ticker-item text-segment text-[clamp(3rem,6vw,8rem)] font-light whitespace-nowrap flex items-center leading-none select-none">
                        {splitText("to bring your designs to life.")}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HorizontalTicker;

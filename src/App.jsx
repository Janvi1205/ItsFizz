import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LETTERS = ["W","E","L","C","O","M","E"," ","I","T","Z","F","I","Z","Z"];

const stats = [
  { id: "box1", value: "58%", label: "Increase in pick up point use",    bg: "bg-[#def54f]", text: "text-[#111]", pos: "top-[5%] right-[30%]" },
  { id: "box2", value: "23%", label: "Decreased in customer phone calls", bg: "bg-[#6ac9ff]", text: "text-[#111]", pos: "bottom-[5%] right-[35%]" },
  { id: "box3", value: "27%", label: "Increase in pick up point use",    bg: "bg-[#333]",    text: "text-white",  pos: "top-[5%] right-[10%]" },
  { id: "box4", value: "40%", label: "Decreased in customer phone calls", bg: "bg-[#fa7328]", text: "text-[#111]", pos: "bottom-[5%] right-[12.5%]" },
];

export default function App() {
  const sectionRef = useRef(null);
  const trackRef   = useRef(null);
  const carRef     = useRef(null);
  const trailRef   = useRef(null);
  const valueAddRef = useRef(null);
  const letterRefs  = useRef([]);
  const boxRefs     = useRef({});

  useEffect(() => {
    const car      = carRef.current;
    const trail    = trailRef.current;
    const valueAdd = valueAddRef.current;
    const letters  = letterRefs.current;

    const valueRect    = valueAdd.getBoundingClientRect();
    const letterOffsets = letters.map((l) => l.offsetLeft);

    const roadWidth = window.innerWidth;
    const carWidth  = 150;
    const endX      = roadWidth - carWidth;

    // Main car scroll animation
    gsap.to(car, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: trackRef.current,
      },
      x: endX,
      ease: "none",
      onUpdate() {
        const carX = gsap.getProperty(car, "x") + carWidth / 2;

        letters.forEach((letter, i) => {
          const letterX = valueRect.left + letterOffsets[i];
          letter.style.opacity = carX >= letterX ? "1" : "0";
        });

        gsap.set(trail, { width: carX });
      },
    });

    // Stat card fade-ins
    const triggers = [
      { id: "box1", start: "top+=400 top", end: "top+=600 top" },
      { id: "box2", start: "top+=600 top", end: "top+=800 top" },
      { id: "box3", start: "top+=800 top", end: "top+=1000 top" },
      { id: "box4", start: "top+=1000 top", end: "top+=1200 top" },
    ];

    triggers.forEach(({ id, start, end }) => {
      gsap.to(boxRefs.current[id], {
        scrollTrigger: {
          trigger: sectionRef.current,
          start,
          end,
          scrub: true,
        },
        opacity: 1,
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative bg-[#121212]"
      style={{ height: "200vh" }}
    >
      {/* Sticky viewport */}
      <div
        ref={trackRef}
        className="sticky top-0 w-full flex items-center justify-center bg-[#d1d1d1]"
        style={{ height: "100vh" }}
      >
        {/* Road strip */}
        <div
          className="relative overflow-hidden"
          style={{ width: "100vw", height: "250px", backgroundColor: "#1e1e1e" }}
        >
          {/* Car */}
          <img
            ref={carRef}
            src="/carimg.png"
            alt="car"
            className="absolute top-0 left-0 z-10"
            style={{ height: "250px" }}
          />

          {/* Green trail */}
          <div
            ref={trailRef}
            className="absolute top-0 left-0 z-[1]"
            style={{ height: "250px", width: 0, backgroundColor: "#45db7d" }}
          />

          {/* WELCOME ITZFIZZ letters */}
          <div
            ref={valueAddRef}
            className="absolute items-center z-[5] flex text-[8rem] font-bold gap-[0.3rem]" 
          
          >
            {LETTERS.map((letter, i) => (
              <span
                key={i}
                ref={(el) => (letterRefs.current[i] = el)}
                style={{ color: "#111", opacity: 0, whiteSpace: "pre" }}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>

        {/* Stat cards */}
        {stats.map(({ id, value, label, bg, text, pos }) => (
          <div
            key={id}
            ref={(el) => (boxRefs.current[id] = el)}
            className={`absolute ${pos} ${bg} ${text} rounded-[10px] m-4 p-[30px] z-[5] flex flex-col items-start justify-center gap-[5px]`}
            style={{ opacity: 0 }}
          >
            <span className="text-[58px] font-semibold leading-none">{value}</span>
            <span className="text-[18px]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
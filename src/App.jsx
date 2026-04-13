import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LETTERS = ["W", "E", "L", "C", "O", "M", "E", " ", "I", "T", "Z", "F", "I", "Z", "Z"];

const stats = [
  { id: "box1", value: "58%", label: "Increase in pick up point use", color: "#def54f", pos: "top-[5%] right-[30%]" },
  { id: "box2", value: "23%", label: "Decreased in customer phone calls", color: "#6ac9ff", pos: "bottom-[5%] right-[35%]" },
  { id: "box3", value: "27%", label: "Increase in pick up point use", color: "#a78bfa", pos: "top-[5%] right-[10%]" },
  { id: "box4", value: "40%", label: "Decreased in customer phone calls", color: "#fa7328", pos: "bottom-[5%] right-[12.5%]" },
];

export default function App() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const carRef = useRef(null);
  const trailRef = useRef(null);
  const valueAddRef = useRef(null);
  const letterRefs = useRef([]);
  const boxRefs = useRef({});

  useEffect(() => {
    const car = carRef.current;
    const trail = trailRef.current;
    const valueAdd = valueAddRef.current;
    const letters = letterRefs.current;

    const valueRect = valueAdd.getBoundingClientRect();
    const letterOffsets = letters.map((l) => l.offsetLeft);

    const roadWidth = window.innerWidth;
    const carWidth = 150;
    const endX = roadWidth - carWidth;

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
    <div ref={sectionRef} className="relative bg-[#121212] h-[200vh]">
      <div
        ref={trackRef}
        className="sticky top-0 w-full h-screen flex items-center justify-center bg-black"
      >
        <div className="relative overflow-hidden w-screen h-[250px] bg-white">
          <img
            ref={carRef}
            src="/carimg.png"
            alt="car"
            className="absolute top-0 left-0 z-10 h-[250px]"
          />

          <div
            ref={trailRef}
            className="absolute top-0 left-0 z-[1] h-[250px] w-0 bg-[#45db7d]"
          />

          <div
            ref={valueAddRef}
            className="absolute left-28 inset-y-0 flex items-center z-[5] text-[10rem] font-bold gap-[0.3rem]"
          >
            {LETTERS.map((letter, i) => (
              <span
                key={i}
                ref={(el) => (letterRefs.current[i] = el)}
                className="text-[#111] opacity-0 whitespace-pre"
              >
                {letter}
              </span>
            ))}
          </div>
        </div>

        {stats.map(({ id, value, label, color, pos }) => (
          <div
            key={id}
            ref={(el) => (boxRefs.current[id] = el)}
            className={`absolute ${pos} z-[5] flex flex-col items-start justify-center gap-2 m-4 opacity-0 rounded-[24px] backdrop-blur-[20px]`}
            style={{
              padding: "40px 48px",
              background: `${color}22`,
              
              border: `1px solid ${color}55`,
            }}
          >
            <span className="text-[58px] font-semibold leading-none" style={{ color }}>
              {value}
            </span>
            <span className="text-[18px] text-white/70">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
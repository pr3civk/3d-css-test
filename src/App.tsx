import { 
  Aperture, 
  Atom, 
  Binary, 
  Brain, 
  BrainCircuit as Circuit, 
  Cpu, 
  Database, 
  Globe, 
  Hexagon, 
  Network  
} from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const logos = [
  { Icon: Aperture, color: 'text-white opacity-90' },
  { Icon: Atom, color: 'text-white opacity-80' },
  { Icon: Binary, color: 'text-white opacity-85' },
  { Icon: Brain, color: 'text-white opacity-90' },
  { Icon: Circuit, color: 'text-white opacity-80' },
  { Icon: Cpu, color: 'text-white opacity-85' },
  { Icon: Database, color: 'text-white opacity-90' },
  { Icon: Globe, color: 'text-white opacity-85' },
  { Icon: Hexagon, color: 'text-white opacity-80' },
  { Icon: Network, color: 'text-white opacity-90' }
];

const variants = {
  initial: {
    rotateY: 0
  },
  animate: {
    rotateY: 360,
    transition: {
      duration: 30,
      ease: "linear",
      repeat: Infinity
    }
  },
  exit: {
    rotateY: 720,
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity

    }
  }
}
function App() {
  const [isLeaving, setIsLeaving] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const ref = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (!ref.current || opacity === 0) return;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'style') {
          const currentOpacity = window.getComputedStyle(ref.current!).opacity;
          setOpacity(Number(currentOpacity));
        }
      });
    });
    
    observer.observe(ref.current, { attributes: true });
    return () => observer.disconnect();
  }, [opacity]);

  
  if(opacity === 0) {
    return <div>
      <h1>Leaving</h1>
    </div>
  }


  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      <div className="relative w-screen h-screen perspective-1000 -rotate-x-[30deg]  transform-style-3d">
      <motion.div 
          className="absolute w-full h-full transform-style-3d"
          variants={variants}  
          initial="initial"
          animate={isLeaving ? "exit" : "animate"}
        >
          {logos.map((Logo, index) => {
            const angle = (index / logos.length) * 360;
            return (
              <motion.div
                ref={ref}
                initial={{opacity: 1}}
                animate={isLeaving && {opacity: [1,0]}}
                transition={{
                  duration: 1.25,
                  ease: "easeInOut"
                }}
                key={index}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-2xl"
              style={{
                transform: `
                  rotateY(${angle}deg) 
                  translateX(${window.innerWidth > 1600 ? 800 : 600}px)
                  translateY(-150px) 
                `,
              }}
            >
            <div
                className={`w-32 h-32 rounded-full p-6 origin-center
                           hover:scale-110 transition-all duration-300
                           flex items-center justify-center 
                           backdrop-blur-sm bg-gradient-to-br from-white/10 to-transparent
                           shadow-lg shadow-white/5 transform-style-3d 
                           opacity-100 hover:bg-white group
                           `}
              >
                <Logo.Icon className={`w-20 h-20 group-hover:text-black transition-all duration-300 ${Logo.color}`} />
              </div>
            </motion.div>
            );
          })}
        </motion.div>
      </div>
      <button className='cursor-pointer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm px-4 py-2 rounded-full z-[1000] bg-red-300' onClick={() => setIsLeaving(true)}>Leave</button>
    </div>
  );
}

export default App;
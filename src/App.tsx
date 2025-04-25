import { motion, useAnimationFrame } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
// import XIcon from './assets/x-icon.svg?react'
import { partnerIcons } from './partner-icons'

const defaultVariants = {
  initial: { opacity: 0 },
  animate: ({ isFinished, maxOpacity }: { isFinished: boolean; maxOpacity: number }) => ({
    opacity: isFinished ? [0, maxOpacity] : undefined,
    transition: { duration: 1.5, ease: [0.22, 0.65, 0.36, 1] },
  }),
}

function App() {
  const [isLeaving, setIsLeaving] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [isOpacityZero, setIsOpacityZero] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isLeaving) return
    const checkOpacity = () => {
      if (containerRef.current) {
        const opacity = window.getComputedStyle(containerRef.current).opacity

        if (opacity === '0') {
          setIsOpacityZero(true)
        }
      }
    }

    const timeoutId = setTimeout(checkOpacity, 600)

    return () => clearTimeout(timeoutId)
  }, [isLeaving])

  const carouselRef = useRef<HTMLDivElement>(null)

  const iconRefs = useRef<(HTMLDivElement | null)[]>([])

  useAnimationFrame((time) => {
    if (carouselRef.current) {
      const angle = time * 0.01
      partnerIcons.forEach((_, index) => {
        const iconElement = iconRefs.current[index]
        if (iconElement) {
          const baseAngle = ((index + 1) / partnerIcons.length) * 360
          const currentAngle = (baseAngle + angle) % 360
          const angleInRadians = (currentAngle * Math.PI) / 180

          const radiusX = window.innerWidth > 1600 ? 700 : 550
          const radiusY = window.innerWidth > 1600 ? 425 : 300

          const x = Math.sin(angleInRadians) * radiusX
          const y = -Math.cos(angleInRadians) * radiusY - 30

          const scale = Math.max(1, Math.min(1.5, 0.5 + Math.sin(angleInRadians) * 0.5))

          iconElement.style.transform = `translate(${x}px, ${y}px) rotateY(${
            Math.cos(angleInRadians) / 2
          }rad) scale(${scale})`
        }
      })
    }
  })

  if (isOpacityZero) {
    return null
  }

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{
        opacity: isLeaving ? 0 : 1,
        maskImage: isLeaving ? 'linear-gradient(to bottom, #8c8c8c, transparent)' : 'none',
      }}
      transition={{ duration: 1.25, ease: [0.22, 0.65, 0.36, 1] }}
    >
      <MovieAnimation {...{ isFinished, setIsFinished }} />
      <div className="relative w-screen h-screen perspective-1000 -rotate-x-[30deg]">
        <motion.div
          variants={defaultVariants}
          initial="initial"
          animate={isFinished ? 'animate' : 'initial'}
          custom={{ isFinished, maxOpacity: 0.11 }}
          className="size-[60svw] bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-3xl"
          style={{
            maskImage: 'radial-gradient(circle, #ffffff 21.37%, transparent 75%)',
          }}
        />

        <div className="absolute w-full h-full" ref={carouselRef}>
          {partnerIcons.map((Logo, index) => {
            if (!iconRefs.current[index]) {
              iconRefs.current[index] = null
            }

            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={
                  isFinished
                    ? { opacity: 1, transition: { duration: 1.25, ease: [0.22, 0.65, 0.36, 1] } }
                    : { opacity: 0 }
                }
                key={index}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-2xl"
                ref={(el) => {
                  iconRefs.current[index] = el
                  return undefined
                }}
              >
                <Logo.icon className="bg-transparent max-w-36" />
              </motion.div>
            )
          })}
        </div>
      </div>
      <motion.div
        variants={defaultVariants}
        initial="initial"
        animate={isFinished ? 'animate' : 'initial'}
        custom={{ isFinished, maxOpacity: 1 }}
        className="absolute bottom-[30%] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-12"
      >
        <div className="font-semibold text-center space-y-1">
          <p className="text-4xl block text-white">Welcome to StackR</p>
          <p className="text-4xl block bg-gradient-to-tr from-[#fff] to-[#8b8b8b] bg-clip-text text-transparent">
            The new home for your collectibles
          </p>
        </div>
        <button
          onClick={() => setIsLeaving(true)}
          className="font-semibold relative inline-flex h-14 overflow-hidden p-[2px] rounded-xl"
        >
          <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] rounded-xl bg-[conic-gradient(from_90deg_at_50%_50%,#4978CF_0%,#760396_50%,#4978CF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-black px-8 py-2 text-lg font-medium text-white backdrop-blur-3xl uppercase">
            get started
          </span>
        </button>
      </motion.div>
    </motion.div>
  )
}

const MovieAnimation = ({
  isFinished,
  setIsFinished,
}: {
  isFinished: boolean
  setIsFinished: (isFinished: boolean) => void
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isFinished) return
    const handleUserInteraction = () => {
      if (videoRef.current) {
        videoRef.current.muted = false
        videoRef.current.play().catch((err) => {
          console.error('Could not play video:', err)
        })
        document.removeEventListener('click', handleUserInteraction)
      }
    }
    document.addEventListener('click', handleUserInteraction)
    if (videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.play().catch((err) => {
        console.error(err)
      })
    }

    videoRef.current?.addEventListener('ended', () => {
      setIsFinished(true)
    })

    return () => {
      document.removeEventListener('click', handleUserInteraction)
    }
  }, [isFinished, setIsFinished])

  return (
    <div
      className={cn(
        'fixed inset-0 bg-black flex items-center justify-center overflow-hidden',
        isFinished ? 'z-0 pointer-events-none' : 'z-[9999]',
      )}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={false}
        preload="auto"
        aria-label="Splash video"
        className="w-full h-full object-cover"
      >
        <source
          src="https://cjn1foix8guknqhi.public.blob.vercel-storage.com/FinalComp_nobg-vib9lPO0UxD84mR7qVotx71tUJY9TH.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode
  className?: string
  containerClassName?: string
  animate?: boolean
}) => {
  const variants = {
    initial: {
      backgroundPosition: '0 50%',
    },
    animate: {
      backgroundPosition: ['0, 50%', '100% 50%', '0 50%'],
    },
  }
  return (
    <div className={cn('relative p-[4px] group rounded-full', containerClassName)}>
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? 'initial' : undefined}
        animate={animate ? 'animate' : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: 'reverse',
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? '200% 200%' : undefined,
        }}
        className={cn(
          'absolute inset-0 rounded-3xl z-[1] opacity-60 group-hover:opacity-100 blur-xl transition duration-500 will-change-transform',
          ' bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]',
        )}
      />
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? 'initial' : undefined}
        animate={animate ? 'animate' : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: 'reverse',
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? '400% 400%' : undefined,
        }}
        className={cn(
          'absolute inset-0 rounded-3xl z-[1] will-change-transform',
          'bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]',
        )}
      />

      <div className={cn('relative z-50', className)}>{children}</div>
    </div>
  )
}

export default App

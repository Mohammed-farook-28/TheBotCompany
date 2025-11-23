"use client"

import { useEffect, useRef } from "react"

const COLOR = "#FFFFFF"
const HIT_COLOR = "#333333"
const BACKGROUND_COLOR = "#000000"
const BALL_COLOR = "#FFFFFF"
const PADDLE_COLOR = "#FFFFFF"
const LETTER_SPACING = 1
const WORD_SPACING = 3

const PIXEL_MAP = {
  P: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
  R: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  O: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  M: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  T: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  I: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  G: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  S: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  A: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  L: [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  Y: [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  U: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  D: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  E: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  B: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  C: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  K: [
    [1, 0, 0, 1],
    [1, 0, 1, 0],
    [1, 1, 0, 0],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  H: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
}

interface Pixel {
  x: number
  y: number
  size: number
  hit: boolean
}

interface Ball {
  x: number
  y: number
  dx: number
  dy: number
  radius: number
  lastX: number
  lastY: number
  stuckCount: number
  cornerStuckCount: number
}

interface Paddle {
  x: number
  y: number
  width: number
  height: number
  targetY: number
  isVertical: boolean
}

export function PromptingIsAllYouNeed() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pixelsRef = useRef<Pixel[]>([])
  const ballRef = useRef<Ball>({ x: 0, y: 0, dx: 0, dy: 0, radius: 0, lastX: 0, lastY: 0, stuckCount: 0, cornerStuckCount: 0 })
  const paddlesRef = useRef<Paddle[]>([])
  const scaleRef = useRef(1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", {
      alpha: false, // No transparency needed for better performance
      desynchronized: true // Allow async rendering
    })
    if (!ctx) return

    // Optimize canvas rendering
    ctx.imageSmoothingEnabled = false // Pixel art doesn't need smoothing



    const resizeCanvas = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight
      canvas.width = newWidth
      canvas.height = newHeight

      // Better scale calculation for mobile - use smaller reference for mobile
      const isMobile = newWidth < 640
      const referenceSize = isMobile ? 800 : 1000
      scaleRef.current = Math.min(newWidth / referenceSize, newHeight / referenceSize)

      // Re-initialize game on resize to properly scale everything
      initializeGame()
    }

    const initializeGame = () => {
      const scale = scaleRef.current
      const LARGE_PIXEL_SIZE = 8 * scale
      const SMALL_PIXEL_SIZE = 4 * scale
      const BALL_SPEED = 8 * scale

      pixelsRef.current = []
      const words = ["THE BOT COMPANY", "BREAKING IMPOSSIBILITIES"]

      const calculateWordWidth = (word: string, pixelSize: number) => {
        return (
          word.split("").reduce((width, letter) => {
            const letterWidth = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]?.[0]?.length ?? 0
            return width + letterWidth * pixelSize + LETTER_SPACING * pixelSize
          }, 0) -
          LETTER_SPACING * pixelSize
        )
      }

      const totalWidthLarge = words[0].split(" ").reduce((width, word, index) => {
        return width + calculateWordWidth(word, LARGE_PIXEL_SIZE) + (index > 0 ? WORD_SPACING * LARGE_PIXEL_SIZE : 0)
      }, 0)
      const totalWidthSmall = words[1].split(" ").reduce((width, word, index) => {
        return width + calculateWordWidth(word, SMALL_PIXEL_SIZE) + (index > 0 ? WORD_SPACING * SMALL_PIXEL_SIZE : 0)
      }, 0)
      const totalWidth = Math.max(totalWidthLarge, totalWidthSmall)
      // Use smaller width factor on mobile to prevent overflow
      const widthFactor = canvas.width < 640 ? 0.9 : 0.8
      const scaleFactor = (canvas.width * widthFactor) / totalWidth

      const adjustedLargePixelSize = LARGE_PIXEL_SIZE * scaleFactor
      const adjustedSmallPixelSize = SMALL_PIXEL_SIZE * scaleFactor

      const largeTextHeight = 5 * adjustedLargePixelSize
      const smallTextHeight = 5 * adjustedSmallPixelSize
      const spaceBetweenLines = 5 * adjustedLargePixelSize
      const totalTextHeight = largeTextHeight + spaceBetweenLines + smallTextHeight

      let startY = (canvas.height - totalTextHeight) / 2

      words.forEach((word, wordIndex) => {
        const pixelSize = wordIndex === 0 ? adjustedLargePixelSize : adjustedSmallPixelSize
        const wordSpacing = wordIndex === 0 ? WORD_SPACING * adjustedLargePixelSize : WORD_SPACING * adjustedSmallPixelSize
        const totalWidth =
          wordIndex === 0
            ? words[0].split(" ").reduce((width, w, index) => {
              return (
                width +
                calculateWordWidth(w, adjustedLargePixelSize) +
                (index > 0 ? WORD_SPACING * adjustedLargePixelSize : 0)
              )
            }, 0)
            : words[1].split(" ").reduce((width, w, index) => {
              return (
                width +
                calculateWordWidth(w, adjustedSmallPixelSize) +
                (index > 0 ? WORD_SPACING * adjustedSmallPixelSize : 0)
              )
            }, 0)

        let startX = (canvas.width - totalWidth) / 2

        word.split(" ").forEach((subWord) => {
          subWord.split("").forEach((letter) => {
            const pixelMap = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]
            if (!pixelMap) return

            for (let i = 0; i < pixelMap.length; i++) {
              for (let j = 0; j < pixelMap[i].length; j++) {
                if (pixelMap[i][j]) {
                  const x = startX + j * pixelSize
                  const y = startY + i * pixelSize
                  pixelsRef.current.push({ x, y, size: pixelSize, hit: false })
                }
              }
            }
            startX += (pixelMap[0].length + LETTER_SPACING) * pixelSize
          })
          startX += wordSpacing
        })
        startY += wordIndex === 0 ? largeTextHeight + spaceBetweenLines : 0
      })

      const ballStartX = canvas.width * 0.9
      const ballStartY = canvas.height * 0.1

      ballRef.current = {
        x: ballStartX,
        y: ballStartY,
        dx: -BALL_SPEED,
        dy: BALL_SPEED,
        radius: adjustedLargePixelSize / 2,
        lastX: ballStartX,
        lastY: ballStartY,
        stuckCount: 0,
        cornerStuckCount: 0,
      }

      const paddleWidth = adjustedLargePixelSize
      const paddleLength = 10 * adjustedLargePixelSize

      paddlesRef.current = [
        {
          x: 0,
          y: canvas.height / 2 - paddleLength / 2,
          width: paddleWidth,
          height: paddleLength,
          targetY: canvas.height / 2 - paddleLength / 2,
          isVertical: true,
        },
        {
          x: canvas.width - paddleWidth,
          y: canvas.height / 2 - paddleLength / 2,
          width: paddleWidth,
          height: paddleLength,
          targetY: canvas.height / 2 - paddleLength / 2,
          isVertical: true,
        },
        {
          x: canvas.width / 2 - paddleLength / 2,
          y: 0,
          width: paddleLength,
          height: paddleWidth,
          targetY: canvas.width / 2 - paddleLength / 2,
          isVertical: false,
        },
        {
          x: canvas.width / 2 - paddleLength / 2,
          y: canvas.height - paddleWidth,
          width: paddleLength,
          height: paddleWidth,
          targetY: canvas.width / 2 - paddleLength / 2,
          isVertical: false,
        },
      ]
    }

    const updateGame = () => {
      const ball = ballRef.current
      const paddles = paddlesRef.current

      ball.x += ball.dx
      ball.y += ball.dy

      // Stuck detection
      if (Math.abs(ball.x - ball.lastX) < 1 && Math.abs(ball.y - ball.lastY) < 1) {
        ball.stuckCount++
        if (ball.stuckCount > 60) { // Stuck for ~1 second
          // Respawn ball
          ball.x = canvas.width / 2
          ball.y = canvas.height / 2
          ball.dx = (Math.random() > 0.5 ? 1 : -1) * Math.abs(ball.dx)
          ball.dy = (Math.random() > 0.5 ? 1 : -1) * Math.abs(ball.dy)
          ball.stuckCount = 0
        }
      } else {
        ball.stuckCount = 0
        ball.lastX = ball.x
        ball.lastY = ball.y
      }

      if (ball.y - ball.radius < 0) {
        ball.y = ball.radius
        ball.dy = -ball.dy
      } else if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius
        ball.dy = -ball.dy
      }

      if (ball.x - ball.radius < 0) {
        ball.x = ball.radius
        ball.dx = -ball.dx
      } else if (ball.x + ball.radius > canvas.width) {
        ball.x = canvas.width - ball.radius
        ball.dx = -ball.dx
      }

      paddles.forEach((paddle) => {
        if (paddle.isVertical) {
          if (
            ball.x - ball.radius < paddle.x + paddle.width &&
            ball.x + ball.radius > paddle.x &&
            ball.y > paddle.y &&
            ball.y < paddle.y + paddle.height
          ) {
            // Determine side based on paddle position
            if (paddle.x < canvas.width / 2) {
              // Left paddle: push right
              ball.x = paddle.x + paddle.width + ball.radius
              ball.dx = Math.abs(ball.dx)
            } else {
              // Right paddle: push left
              ball.x = paddle.x - ball.radius
              ball.dx = -Math.abs(ball.dx)
            }
          }
        } else {
          if (
            ball.y - ball.radius < paddle.y + paddle.height &&
            ball.y + ball.radius > paddle.y &&
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.width
          ) {
            // Determine side based on paddle position
            if (paddle.y < canvas.height / 2) {
              // Top paddle: push down
              ball.y = paddle.y + paddle.height + ball.radius
              ball.dy = Math.abs(ball.dy)
            } else {
              // Bottom paddle: push up
              ball.y = paddle.y - ball.radius
              ball.dy = -Math.abs(ball.dy)
            }
          }
        }
      })

      paddles.forEach((paddle) => {
        if (paddle.isVertical) {
          paddle.targetY = ball.y - paddle.height / 2
          paddle.targetY = Math.max(0, Math.min(canvas.height - paddle.height, paddle.targetY))
          paddle.y += (paddle.targetY - paddle.y) * 0.1
        } else {
          paddle.targetY = ball.x - paddle.width / 2
          paddle.targetY = Math.max(0, Math.min(canvas.width - paddle.width, paddle.targetY))
          paddle.x += (paddle.targetY - paddle.x) * 0.1
        }
      })

      pixelsRef.current.forEach((pixel) => {
        if (
          !pixel.hit &&
          ball.x + ball.radius > pixel.x &&
          ball.x - ball.radius < pixel.x + pixel.size &&
          ball.y + ball.radius > pixel.y &&
          ball.y - ball.radius < pixel.y + pixel.size
        ) {
          pixel.hit = true
          const centerX = pixel.x + pixel.size / 2
          const centerY = pixel.y + pixel.size / 2

          const overlapX = (ball.radius + pixel.size / 2) - Math.abs(ball.x - centerX)
          const overlapY = (ball.radius + pixel.size / 2) - Math.abs(ball.y - centerY)

          if (overlapX < overlapY) {
            // Collision on X axis
            if (ball.x < centerX) {
              ball.x -= overlapX + 0.1 // Add epsilon
              ball.dx = -Math.abs(ball.dx)
            } else {
              ball.x += overlapX + 0.1 // Add epsilon
              ball.dx = Math.abs(ball.dx)
            }
          } else {
            // Collision on Y axis
            if (ball.y < centerY) {
              ball.y -= overlapY + 0.1 // Add epsilon
              ball.dy = -Math.abs(ball.dy)
            } else {
              ball.y += overlapY + 0.1 // Add epsilon
              ball.dy = Math.abs(ball.dy)
            }
          }
        }
      })

      // Corner Watchdog: Prevent ball from getting stuck in corners
      const cornerSize = 100
      const isTopLeft = ball.x < cornerSize && ball.y < cornerSize
      const isTopRight = ball.x > canvas.width - cornerSize && ball.y < cornerSize
      const isBottomLeft = ball.x < cornerSize && ball.y > canvas.height - cornerSize
      const isBottomRight = ball.x > canvas.width - cornerSize && ball.y > canvas.height - cornerSize

      if (isTopLeft || isTopRight || isBottomLeft || isBottomRight) {
        ball.cornerStuckCount++
        if (ball.cornerStuckCount > 30) { // 0.5 seconds in corner
          // Eject towards center
          ball.x = canvas.width / 2
          ball.y = canvas.height / 2
          ball.dx = (Math.random() > 0.5 ? 1 : -1) * Math.abs(ball.dx)
          ball.dy = (Math.random() > 0.5 ? 1 : -1) * Math.abs(ball.dy)
          ball.cornerStuckCount = 0
        }
      } else {
        ball.cornerStuckCount = 0
      }
    }

    const drawGame = () => {
      if (!ctx) return

      // Use clearRect instead of fillRect for better performance
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = BACKGROUND_COLOR
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Batch pixel rendering for better performance
      ctx.fillStyle = COLOR
      const unhitPixels: Pixel[] = []
      const hitPixels: Pixel[] = []

      pixelsRef.current.forEach((pixel) => {
        if (pixel.hit) {
          hitPixels.push(pixel)
        } else {
          unhitPixels.push(pixel)
        }
      })

      // Draw unhit pixels first
      unhitPixels.forEach((pixel) => {
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size)
      })

      // Draw hit pixels
      ctx.fillStyle = HIT_COLOR
      hitPixels.forEach((pixel) => {
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size)
      })

      // Draw ball
      ctx.fillStyle = BALL_COLOR
      ctx.beginPath()
      ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, 0, Math.PI * 2)
      ctx.fill()

      // Draw paddles
      ctx.fillStyle = PADDLE_COLOR
      paddlesRef.current.forEach((paddle) => {
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)
      })
    }

    let animationId: number;
    let isRunning = true;
    let lastFrameTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    // Throttle resize handler
    let resizeTimeout: number | null = null;
    const throttledResize = () => {
      if (resizeTimeout) return;
      resizeTimeout = window.setTimeout(() => {
        resizeCanvas();
        resizeTimeout = null;
      }, 150);
    };

    const gameLoop = (currentTime: number) => {
      if (!isRunning) return;

      // Frame rate limiting for better performance
      const elapsed = currentTime - lastFrameTime;
      if (elapsed >= frameInterval) {
        updateGame()
        drawGame()
        lastFrameTime = currentTime - (elapsed % frameInterval);
      }

      animationId = requestAnimationFrame(gameLoop)
    }

    // Pause when tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      } else {
        isRunning = true;
        lastFrameTime = performance.now();
        animationId = requestAnimationFrame(gameLoop);
      }
    };

    resizeCanvas()
    window.addEventListener("resize", throttledResize, { passive: true })
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Start the game loop with a small delay to improve initial load
    setTimeout(() => {
      lastFrameTime = performance.now();
      animationId = requestAnimationFrame(gameLoop)
    }, 100)

    return () => {
      isRunning = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      window.removeEventListener("resize", throttledResize)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full"
      aria-label="Prompting Is All You Need: Fullscreen Pong game with pixel text"
    />
  )
}

export default PromptingIsAllYouNeed

import droneImage from '../assets/hero-drone-sprayer.png'
import './DroneAnimation.css'

const sprayStreams = [
  { className: 'farm-drone__stream--outer-left', label: 'outer-left' },
  { className: 'farm-drone__stream--inner-left', label: 'inner-left' },
  { className: 'farm-drone__stream--center', label: 'center' },
  { className: 'farm-drone__stream--inner-right', label: 'inner-right' },
  { className: 'farm-drone__stream--outer-right', label: 'outer-right' },
]

function DroneAnimation() {
  return (
    <div className="farm-drone" aria-hidden="true">
      <div className="farm-drone__body">
        <div className="farm-drone__spray">
          {sprayStreams.map(({ className, label }) => (
            <span key={label} className={`farm-drone__stream ${className}`} />
          ))}
        </div>
        <svg className="farm-drone__image" viewBox="100 245 570 200" aria-hidden="true">
          <defs>
            <mask
              id="farm-drone-silhouette"
              maskUnits="userSpaceOnUse"
              maskContentUnits="userSpaceOnUse"
              x="100"
              y="245"
              width="570"
              height="200"
            >
              <rect x="100" y="245" width="570" height="200" fill="black" />
              <g fill="white">
                <path d="M145 269 275 263 296 274 472 270 495 277 622 279 622 301 487 297 464 305 299 301 278 309 145 300Z" />
                <path d="M274 276 303 266 328 271 343 285 326 301 296 296Z" />
                <path d="M424 280 448 269 477 273 486 292 461 301 438 294Z" />
                <path d="M315 279 338 270 384 270 409 279 425 298 417 324 430 343 421 382 399 401 368 402 347 390 331 373 324 346 305 325 300 300Z" />
                <path d="M316 317 330 320 298 425 287 439 280 434 293 409Z" />
                <path d="M414 318 427 316 466 420 469 435 460 439 449 426Z" />
                <path d="M157 279 174 279 174 303 157 303Z" />
                <path d="M269 281 287 282 287 313 269 313Z" />
                <path d="M376 376 394 376 394 439 376 439Z" />
                <path d="M510 282 528 282 528 311 510 311Z" />
                <path d="M600 281 617 281 617 305 600 305Z" />
                <ellipse cx="164" cy="285" rx="14" ry="11" />
                <ellipse cx="278" cy="292" rx="14" ry="12" />
                <ellipse cx="481" cy="286" rx="14" ry="11" />
                <ellipse cx="609" cy="291" rx="14" ry="11" />
              </g>
            </mask>
          </defs>
          <image
            href={droneImage}
            x="0"
            y="0"
            width="768"
            height="768"
            preserveAspectRatio="none"
            mask="url(#farm-drone-silhouette)"
          />
        </svg>
      </div>
    </div>
  )
}

export default DroneAnimation

type BrandLogoProps = {
  className?: string
  showWordmark?: boolean
  /** Display height in px; width follows the mark aspect ratio */
  size?: number
}

export default function BrandLogo({ className = '', showWordmark = true, size = 36 }: BrandLogoProps) {
  return (
    <span className={`brand ${className}`}>
      <img
        className="brand__logo"
        src="/pathly-mark.png"
        alt=""
        style={{ height: size, width: 'auto' }}
        decoding="async"
      />
      {showWordmark ? <span className="brand__name">Pathly</span> : null}
    </span>
  )
}

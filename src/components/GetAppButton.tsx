import { useWaitlist } from '../hooks/useWaitlist'

type GetAppButtonProps = {
  className?: string
  children?: string
}

export default function GetAppButton({ className = 'btn btn--brand', children = 'Get app' }: GetAppButtonProps) {
  const { openWaitlist } = useWaitlist()

  return (
    <button type="button" className={className} onClick={openWaitlist}>
      {children}
    </button>
  )
}

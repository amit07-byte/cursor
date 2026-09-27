import { Link } from 'react-router-dom'

type GetAppButtonProps = {
  className?: string
  children?: string
}

export default function GetAppButton({
  className = 'btn btn--brand',
  children = 'Open Pathly',
}: GetAppButtonProps) {
  return (
    <Link className={className} to="/auth">
      {children}
    </Link>
  )
}

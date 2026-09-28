import { cn } from '../../utils/format'

export default function Card({ children, className, as: Tag = 'div', ...props }) {
  return (
    <Tag className={cn('rounded-2xl border border-border bg-white shadow-soft', className)} {...props}>
      {children}
    </Tag>
  )
}

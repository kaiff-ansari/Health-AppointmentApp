import { Link } from 'react-router-dom';

/**
 * Reusable button with variants: primary | secondary | outline | ghost
 * Can render as <button>, <a>, or <Link>
 */
export default function Button({
  children,
  variant = 'primary',
  size = '',
  href,
  to,
  onClick,
  type = 'button',
  className = '',
  id,
  ...rest
}) {
  const cls = `btn btn--${variant}${size ? ` btn--${size}` : ''} ${className}`.trim();

  if (to) {
    return <Link to={to} className={cls} id={id} {...rest}>{children}</Link>;
  }
  if (href) {
    return <a href={href} className={cls} id={id} {...rest}>{children}</a>;
  }
  return (
    <button type={type} className={cls} onClick={onClick} id={id} {...rest}>
      {children}
    </button>
  );
}

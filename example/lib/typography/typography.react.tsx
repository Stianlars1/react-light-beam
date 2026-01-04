import React from "react";
import styles from "./typography.module.css";


// Simple utility function - replace with your preferred className utility
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

type Role = "display" | "headline" | "title" | "body" | "label";
type Size = "md";
type Variant = `${Role}/${Size}`;

const map: Record<Variant, string> = {
  "display/md": styles.display,
  "headline/md": styles.headline,
  "title/md": styles.title,
  "body/md": styles.body,
  "label/md": styles.label,
};

// Text component with polymorphic 'as' prop
interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: "p" | "div" | "span" | "section" | "article";
  variant?: Variant;
  children?: React.ReactNode;
}

export function Text({ 
  as: Component = "p", 
  variant = "body/md", 
  className, 
  children,
  ...rest 
}: TextProps) {
  return (
    <Component 
      className={cn(map[variant], className)} 
      {...rest}
    >
      {children}
    </Component>
  );
}

// Base heading component with level prop
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children?: React.ReactNode;
}

export function Heading({ 
  level = 2, 
  className, 
  children, 
  ...rest 
}: HeadingProps) {
  const variant: Variant = level === 1 
    ? "display/md" 
    : level <= 3 
    ? "headline/md" 
    : "title/md";

  const headingClassName = cn(map[variant], className);

  switch (level) {
    case 1:
      return <h1 className={headingClassName} {...rest}>{children}</h1>;
    case 2:
      return <h2 className={headingClassName} {...rest}>{children}</h2>;
    case 3:
      return <h3 className={headingClassName} {...rest}>{children}</h3>;
    case 4:
      return <h4 className={headingClassName} {...rest}>{children}</h4>;
    case 5:
      return <h5 className={headingClassName} {...rest}>{children}</h5>;
    case 6:
      return <h6 className={headingClassName} {...rest}>{children}</h6>;
    default:
      return <h2 className={headingClassName} {...rest}>{children}</h2>;
  }
}

// Individual heading components for convenience
interface IndividualHeadingProps extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'level'> {
  children?: React.ReactNode;
}

export function Heading1({ className, children, ...rest }: IndividualHeadingProps) {
  return (
    <h1 className={cn(map["display/md"], className)} {...rest}>
      {children}
    </h1>
  );
}

export function Heading2({ className, children, ...rest }: IndividualHeadingProps) {
  return (
    <h2 className={cn(map["headline/md"], className)} {...rest}>
      {children}
    </h2>
  );
}

export function Heading3({ className, children, ...rest }: IndividualHeadingProps) {
  return (
    <h3 className={cn(map["headline/md"], className)} {...rest}>
      {children}
    </h3>
  );
}

export function Heading4({ className, children, ...rest }: IndividualHeadingProps) {
  return (
    <h4 className={cn(map["title/md"], className)} {...rest}>
      {children}
    </h4>
  );
}

export function Heading5({ className, children, ...rest }: IndividualHeadingProps) {
  return (
    <h5 className={cn(map["title/md"], className)} {...rest}>
      {children}
    </h5>
  );
}

export function Heading6({ className, children, ...rest }: IndividualHeadingProps) {
  return (
    <h6 className={cn(map["title/md"], className)} {...rest}>
      {children}
    </h6>
  );
}

// Paragraph component
interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

export function Paragraph({ className, children, ...rest }: ParagraphProps) {
  return (
    <p className={cn(map["body/md"], className)} {...rest}>
      {children}
    </p>
  );
}

// Link component
interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
}

export function Link({ className, children, ...rest }: LinkProps) {
  return (
    <a className={cn(styles.link, className)} {...rest}>
      {children}
    </a>
  );
}

// ListItem component
interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  children?: React.ReactNode;
}

export function ListItem({ children, className, ...rest }: ListItemProps) {
  return (
    <li className={cn(styles.li, className)} {...rest}>
      {children}
    </li>
  );
}

// Export aliases for convenience
export const H1 = Heading1;
export const H2 = Heading2;
export const H3 = Heading3;
export const H4 = Heading4;
export const H5 = Heading5;
export const H6 = Heading6;
export const P = Paragraph;

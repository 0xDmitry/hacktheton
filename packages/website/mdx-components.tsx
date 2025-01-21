import type { MDXComponents } from "mdx/types"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-xl py-3 text-center">{children}</h1>
    ),
    h2: ({ children }) => <h2 className="text-lg py-2">{children}</h2>,
    p: ({ children }) => <p className="text-base py-1">{children}</p>,
    code: ({ children }) => (
      <code className="font-anonymousPro text-slate-400">{children}</code>
    ),
    a: (props) => {
      return (
        <a
          href={props.href}
          target="_blank"
          className="text-slate-400 hover:text-slate-300"
        >
          {props.children}
        </a>
      )
    },
    ...components,
  }
}

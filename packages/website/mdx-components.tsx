import type { MDXComponents } from "mdx/types"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="text-lg py-2">{children}</h1>,
    h2: ({ children }) => <h2 className="text-base py-2">{children}</h2>,
    p: ({ children }) => <p className="text-sm">{children}</p>,
    ol: ({ children }) => (
      <ol className="list-decimal py-2 pb-4">{children}</ol>
    ),
    li: ({ children }) => <li className="pb-2">{children}</li>,
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

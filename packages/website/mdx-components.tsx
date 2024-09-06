import type { MDXComponents } from "mdx/types"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="text-lg pt-7 pb-2">{children}</h1>,
    h2: ({ children }) => <h2 className="text-base pt-5 pb-2">{children}</h2>,
    p: ({ children }) => <p className="text-base p-1">{children}</p>,
    code: ({ children }) => (
      <code className="font-anonymousPro text-base text-slate-400">
        {children}
      </code>
    ),
    a: (props) => {
      return (
        <a
          href={props.href}
          target="_blank"
          className="text-base text-slate-400 hover:text-slate-300"
        >
          {props.children}
        </a>
      )
    },
    ...components,
  }
}

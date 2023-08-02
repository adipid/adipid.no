import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { CSS, render } from "gfm/mod.ts";
import { extract } from "$std/front_matter/any.ts";

interface BlogPostProps {
  markdown: string;
  frontMatter: {
    title: string;
  };
}

export const handler: Handlers = {
  async GET(_req, ctx) {
    const slug = ctx.params.slug;

    const blogPath = new URL(`../../content/blog`, import.meta.url);
    let postPath: string | URL = "";
    const blogDir = Deno.readDir(blogPath);
    for await (const entry of blogDir) {
      const YYYY_MM_DD_REGEX = new RegExp(/^\d{4}-\d{2}-\d{2}-/);
      const postWithoutDate = entry.name.replace(YYYY_MM_DD_REGEX, "").replace(
        ".md",
        "",
      );
      if (postWithoutDate === slug) {
        const isNested = entry.isDirectory;
        postPath = new URL(
          `../../content/blog/${
            isNested ? `${entry.name}/index.md` : entry.name
          }`,
          import.meta.url,
        );
      }
    }

    const fileContent = await Deno.readTextFile(postPath);
    const { body, attrs } = extract(fileContent);
    const page: BlogPostProps = {
      markdown: body,
      frontMatter: attrs as BlogPostProps["frontMatter"] ?? {},
    };
    const resp = ctx.render(page);
    return resp;
  },
};

export default function BlogPost({ data }: PageProps<BlogPostProps>) {
  const { markdown, frontMatter } = data;
  const body = render(markdown);
  const title = frontMatter.title;
  const css = `
    ${CSS}
    .markdown-body {
      background-color: rgba(24,24,27,var(--tw-bg-opacity)); // bg-zinc-900
    }
    .markdown-body ul {
      list-style: disc;
    }
  `;

  return (
    <>
      <Head>
        <title>{title} - Blog - Tim Hårek</title>
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </Head>
      <article
        data-color-mode="dark"
        data-dark-theme="dark"
        class="max-w-screen-md mx-auto px-4 mb-4 markdown-body"
      >
        <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: body }}></div>
      </article>
    </>
  );
}

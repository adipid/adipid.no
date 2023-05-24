import { config } from "../config.ts";

export function Footer() {
  const navigation = config.navigation.footer;
  return (
    <footer class="max-w-screen-md mx-auto px-4 flex justify-between">
      <div>
        Last deploy: (date-coming)
      </div>

      <nav class="footer__nav" aria-label="Secondary navigation">
        <ul class="flex gap-4">
          {navigation.map((item) => (
            <li>
              <a href={item.path}>{item.title}</a>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}

import { Banner } from './_components/banner';
import { Header } from './_components/header';

export default function HomeV2() {
  return (
    <main
      className={`h-[3000px]`}
      style={{
        fontFamily:
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      }}
    >
      <Header />
      <Banner />
    </main>
  );
}

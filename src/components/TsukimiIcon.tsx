import tsukimiUrl from "@/assets/tsukimi.svg";

// Ícone 🎑 em SVG (Noto Emoji, Google — licença Apache 2.0).
// Substitui o emoji de texto para o desenho ser igual em qualquer sistema.
export function TsukimiIcon({ className }: { className?: string }) {
  return <img src={tsukimiUrl} alt="" aria-hidden="true" draggable={false} className={className} />;
}

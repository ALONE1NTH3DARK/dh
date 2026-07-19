import heroBg from "../assets/hero-bg.png";

export default function HeroBackground() {
  return (
    <div aria-hidden className="absolute inset-0 z-[1] overflow-hidden">
      <div className="absolute inset-0 bg-void" />

      <div
        className="hero-photo absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* плавная смена цвета поверх — без масштаба */}
      <div className="hero-color-shift" />

      <div className="absolute inset-0 bg-gradient-to-r from-void via-void/70 to-void/15" />
      <div className="absolute inset-0 bg-gradient-to-b from-void/55 via-transparent to-void/95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,transparent_10%,rgba(6,4,10,0.55)_75%)]" />
    </div>
  );
}

import { ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  onScrollToPersonalizer: () => void;
}

export function HeroSection({ onScrollToPersonalizer }: HeroSectionProps) {
  return (
    <section className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Navigation */}
      <nav className="w-full px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/image-2.png" alt="InspoGrid" className="h-5 w-5 object-contain rounded-md" />
          <span className="text-sm font-medium tracking-tight">InspoGrid</span>
        </div>
        <div className="flex items-center gap-8">
          <button
            onClick={onScrollToPersonalizer}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            create
          </button>
        </div>
      </nav>

      {/* Main Hero Content - Manifesto Style */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-5xl">
        <div className="space-y-12 md:space-y-16">
          {/* Opening Hook */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-[1.1] animate-fade-in">
            The average human lives
            <br />
            <span className="italic">4,000 weeks.</span>
          </h1>

          {/* The Philosophy */}
          <div className="space-y-8 max-w-2xl animate-fade-in-delay-1">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              That's it. A grid of tiny dots, each representing a week of your existence.
              Some are already behind you. The rest await.
            </p>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              <span className="text-foreground font-medium">InspoGrid</span> visualizes your life in weeks.
              A wallpaper that updates daily,
              showing exactly where you stand in the story of your life.
            </p>
          </div>

          {/* Decorative weeks visualization */}
          <div className="py-8 animate-fade-in-delay-2">
            <div className="flex flex-wrap gap-[3px] max-w-md">
              {Array.from({ length: 80 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-sm transition-colors ${
                    i < 52 ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 tracking-wide">
              Each dot = one week of your life
            </p>
          </div>

          {/* CTA - scroll indicator */}
          <div className="animate-fade-in-delay-3">
            <ChevronDown
              onClick={onScrollToPersonalizer}
              className="w-6 h-6 text-muted-foreground hover:text-foreground transition-colors cursor-pointer animate-bounce"
            />
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
    </section>
  );
}

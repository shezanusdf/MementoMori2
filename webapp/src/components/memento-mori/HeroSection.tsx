import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      </nav>

      {/* Main Hero Content - Left Aligned */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-5xl">
        <div className="space-y-10 md:space-y-12">
          {/* Opening Hook */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-[1.1] animate-fade-in">
            The average human lives
            <br />
            <span className="italic text-primary">4,000 weeks.</span>
          </h1>

          {/* The Philosophy */}
          <div className="space-y-6 max-w-2xl animate-fade-in-delay-1">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              How many have you spent? How many remain?
            </p>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              <span className="text-foreground font-medium">InspoGrid</span> turns your life into a single image. One dot per week. Updated daily. Always on your lock screen.
            </p>
          </div>

          {/* CTA Button */}
          <div className="animate-fade-in-delay-2">
            <Button
              onClick={onScrollToPersonalizer}
              className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8 py-6 text-base font-medium"
            >
              Create Your Wallpaper
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Free. No signup required.
            </p>
          </div>

          {/* Decorative weeks visualization */}
          <div className="py-6 animate-fade-in-delay-3">
            <div className="flex flex-wrap gap-[4px]">
              {Array.from({ length: 52 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i < 35 ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Each dot = one week of your life
            </p>
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
    </section>
  );
}

import { useState, useRef } from 'react';
import { HeroSection } from '@/components/memento-mori/HeroSection';
import { IPhoneMockup } from '@/components/memento-mori/IPhoneMockup';
import { PersonalizerForm } from '@/components/memento-mori/PersonalizerForm';
import { WallpaperCanvas, useWallpaperDownload } from '@/components/memento-mori/WallpaperGenerator';
import { WallpaperSettings, calculateWeeksLived, calculateTotalWeeks, getThemeColors } from '@/components/memento-mori/types';
import { ChevronDown } from 'lucide-react';

// Default birth date (30 years ago)
const getDefaultBirthDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 30);
  return date.toISOString().split('T')[0];
};

export default function Index() {
  const personalizerRef = useRef<HTMLDivElement>(null);
  const { setCanvas, download } = useWallpaperDownload();

  const [settings, setSettings] = useState<WallpaperSettings>({
    birthDate: getDefaultBirthDate(),
    lifeExpectancy: 77,
    device: 'iphone-15-pro',
    shape: 'circle',
    widgetPosition: 'none',
    theme: 'light',
    showLabels: true,
  });

  const scrollToPersonalizer = () => {
    personalizerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const weeksLived = calculateWeeksLived(settings.birthDate);
  const totalWeeks = calculateTotalWeeks(settings.lifeExpectancy);
  const percentLived = Math.round((weeksLived / totalWeeks) * 100);
  const colors = getThemeColors(settings);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection onScrollToPersonalizer={scrollToPersonalizer} />

      {/* Personalizer Section */}
      <section
        ref={personalizerRef}
        id="create"
        className="py-8 sm:py-24 px-4 sm:px-6 md:px-12 lg:px-24 border-t border-border"
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Header - more compact on mobile */}
          <div className="mb-6 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-foreground mb-2 sm:mb-4">
              Make it yours.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-md">
              Choose your theme, enter your birth date, and watch your life unfold in weeks.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-16 lg:gap-24 items-start">
            {/* iPhone Mockup - Top on mobile, Right on desktop */}
            <div className="flex flex-col items-center order-1 lg:order-2 lg:sticky lg:top-8">
              <div className="animate-float scale-[0.75] sm:scale-90 lg:scale-100 -my-8 sm:my-0">
                <IPhoneMockup settings={settings} />
              </div>
              {/* Scroll hint on mobile */}
              <div className="flex flex-col items-center mt-2 sm:hidden text-muted-foreground/60">
                <span className="text-xs">Scroll to customize</span>
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </div>
            </div>

            {/* Form - Bottom on mobile, Left on desktop */}
            <div className="order-2 lg:order-1">
              <PersonalizerForm
                settings={settings}
                onSettingsChange={setSettings}
                onDownload={download}
              />

              {/* Stats below form - more compact on mobile */}
              <div className="mt-6 sm:mt-12 pt-4 sm:pt-8 border-t border-border">
                <div className="flex flex-wrap items-center gap-3 sm:gap-8 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-sm"
                      style={{ backgroundColor: colors.lived }}
                    />
                    <span className="text-muted-foreground">
                      {weeksLived.toLocaleString()} lived
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-sm"
                      style={{ backgroundColor: colors.future }}
                    />
                    <span className="text-muted-foreground">
                      {(totalWeeks - weeksLived).toLocaleString()} remaining
                    </span>
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 sm:mt-3">
                  {percentLived}% of your expected life has passed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden canvas for wallpaper generation */}
        <WallpaperCanvas settings={settings} onCanvasReady={setCanvas} />
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-16 px-4 sm:px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex justify-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            made with <span className="text-red-500">❤️</span> by{' '}
            <a
              href="https://shezan.neocities.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              Shezan
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}

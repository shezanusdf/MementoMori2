import { useState, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Circle, Square, RectangleHorizontal, Download, Smartphone, Palette, Settings2, X, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  WallpaperSettings,
  DotShape,
  WidgetPosition,
  ThemeId,
  ThemeColors,
  DEVICE_SPECS,
  COUNTRIES,
  THEMES,
  getThemeColors,
} from './types';

interface PersonalizerFormProps {
  settings: WallpaperSettings;
  onSettingsChange: (settings: WallpaperSettings) => void;
  onDownload: () => void;
}

export function PersonalizerForm({ settings, onSettingsChange, onDownload }: PersonalizerFormProps) {
  const [showShortcutModal, setShowShortcutModal] = useState(false);
  const [showCustomColors, setShowCustomColors] = useState(settings.theme === 'custom');
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Generate a unique token for this user's settings (base64url encoded JSON)
  const userToken = useMemo(() => {
    const data = JSON.stringify(settings);
    // Use base64url encoding (browser compatible)
    return btoa(data)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }, [settings]);

  // Build the wallpaper URL for iOS Shortcut
  const wallpaperUrl = useMemo(() => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  return `${backendUrl}/api/wallpaper?token=${userToken}`;
  }, [userToken]);


  const handleCopyToken = async () => {
    await navigator.clipboard.writeText(wallpaperUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = <K extends keyof WallpaperSettings>(
    key: K,
    value: WallpaperSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const handleThemeChange = (themeId: ThemeId) => {
    if (themeId === 'custom') {
      setShowCustomColors(true);
      const currentColors = getThemeColors(settings);
      onSettingsChange({
        ...settings,
        theme: themeId,
        customColors: settings.customColors ?? currentColors,
      });
    } else {
      setShowCustomColors(false);
      onSettingsChange({ ...settings, theme: themeId });
    }
  };

  const handleCustomColorChange = (colorKey: keyof ThemeColors, value: string) => {
    const currentCustom = settings.customColors ?? getThemeColors(settings);
    onSettingsChange({
      ...settings,
      customColors: { ...currentCustom, [colorKey]: value },
    });
  };

  const handleCountryChange = (countryCode: string) => {
    const country = COUNTRIES.find(c => c.code === countryCode);
    if (country) {
      onSettingsChange({
        ...settings,
        lifeExpectancy: country.lifeExpectancy,
      });
    }
  };

  const currentColors = getThemeColors(settings);

  return (
    <div className="space-y-6 sm:space-y-8 overflow-x-hidden">
      {/* Theme Selection */}
      <div className="space-y-3">
        <Label className="text-sm text-muted-foreground flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Theme
        </Label>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 sm:gap-2">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`relative group p-0.5 sm:p-1 rounded-lg border-2 transition-all ${
                settings.theme === theme.id
                  ? 'border-foreground'
                  : 'border-transparent hover:border-muted'
              }`}
            >
              <div
                className="w-full aspect-[9/16] rounded-md overflow-hidden"
                style={{ backgroundColor: theme.colors.background }}
              >
                <div className="p-1.5 sm:p-2 flex flex-wrap gap-[2px] sm:gap-[2px]">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-[3px] h-[3px] sm:w-1 sm:h-1 rounded-[0.5px] sm:rounded-[1px]"
                      style={{
                        backgroundColor: i < 5 ? theme.colors.lived : theme.colors.future,
                      }}
                    />
                  ))}
                </div>
              </div>
              <span className="text-[8px] sm:text-[10px] text-muted-foreground mt-0.5 sm:mt-1 block text-center truncate">
                {theme.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Pickers */}
      {showCustomColors && (
        <div className="space-y-3 p-3 sm:p-4 bg-secondary/50 rounded-lg border border-border">
          <Label className="text-sm text-muted-foreground">Custom Colors</Label>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Background</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.customColors?.background ?? '#ffffff'}
                  onChange={(e) => handleCustomColorChange('background', e.target.value)}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded cursor-pointer border border-border"
                />
                <Input
                  value={settings.customColors?.background ?? '#ffffff'}
                  onChange={(e) => handleCustomColorChange('background', e.target.value)}
                  className="flex-1 text-xs font-mono h-8 sm:h-10"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Lived Weeks</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.customColors?.lived ?? '#000000'}
                  onChange={(e) => handleCustomColorChange('lived', e.target.value)}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded cursor-pointer border border-border"
                />
                <Input
                  value={settings.customColors?.lived ?? '#000000'}
                  onChange={(e) => handleCustomColorChange('lived', e.target.value)}
                  className="flex-1 text-xs font-mono h-8 sm:h-10"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Future Weeks</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.customColors?.future ?? '#e5e5e5'}
                  onChange={(e) => handleCustomColorChange('future', e.target.value)}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded cursor-pointer border border-border"
                />
                <Input
                  value={settings.customColors?.future ?? '#e5e5e5'}
                  onChange={(e) => handleCustomColorChange('future', e.target.value)}
                  className="flex-1 text-xs font-mono h-8 sm:h-10"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Birth Date, Country & iPhone Model - stacked on mobile, row on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="birthDate" className="text-sm text-muted-foreground">
            Birth Date
          </Label>
          <Input
            id="birthDate"
            type="date"
            value={settings.birthDate}
            onChange={(e) => handleChange('birthDate', e.target.value)}
            className="bg-background border-border h-11 w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Country
          </Label>
          <Select onValueChange={handleCountryChange} defaultValue="US">
            <SelectTrigger className="bg-background border-border h-11 w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name} ({country.lifeExpectancy} yrs)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5" />
            iPhone Model
          </Label>
          <Select
            value={settings.device}
            onValueChange={(value) => handleChange('device', value)}
          >
            <SelectTrigger className="bg-background border-border h-11 w-full">
              <SelectValue placeholder="Select device" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DEVICE_SPECS).map(([key, spec]) => (
                <SelectItem key={key} value={key}>
                  {spec.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Advanced Settings - Collapsible by default */}
      <div className="space-y-3">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-left"
        >
          <Label className="text-sm text-muted-foreground flex items-center gap-2 cursor-pointer">
            <Settings2 className="w-4 h-4" />
            Advanced Settings
          </Label>
          {showAdvanced ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {/* Collapsible content */}
        <div className={`space-y-4 p-3 sm:p-4 bg-secondary/30 rounded-lg ${!showAdvanced ? 'hidden' : ''}`}>
          {/* Dot Shape */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Dot Shape</label>
            <RadioGroup
              value={settings.shape}
              onValueChange={(value) => handleChange('shape', value as DotShape)}
              className="flex flex-wrap gap-3 sm:gap-4"
            >
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <RadioGroupItem value="circle" id="circle" />
                <Label htmlFor="circle" className="flex items-center gap-1 cursor-pointer text-foreground text-xs sm:text-sm">
                  <Circle className="w-3 h-3" />
                  Circle
                </Label>
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <RadioGroupItem value="rounded" id="rounded" />
                <Label htmlFor="rounded" className="flex items-center gap-1 cursor-pointer text-foreground text-xs sm:text-sm">
                  <RectangleHorizontal className="w-3 h-3" />
                  Rounded
                </Label>
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <RadioGroupItem value="square" id="square" />
                <Label htmlFor="square" className="flex items-center gap-1 cursor-pointer text-foreground text-xs sm:text-sm">
                  <Square className="w-3 h-3" />
                  Square
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Widget Position */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">
              Lock Screen Widgets
            </label>
            <RadioGroup
              value={settings.widgetPosition}
              onValueChange={(value) => handleChange('widgetPosition', value as WidgetPosition)}
              className="flex flex-wrap gap-3 sm:gap-4"
            >
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none" className="cursor-pointer text-foreground text-xs sm:text-sm">None</Label>
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <RadioGroupItem value="top" id="top" />
                <Label htmlFor="top" className="cursor-pointer text-foreground text-xs sm:text-sm">Top</Label>
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <RadioGroupItem value="bottom" id="bottom" />
                <Label htmlFor="bottom" className="cursor-pointer text-foreground text-xs sm:text-sm">Bottom</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Show Labels Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-xs text-muted-foreground">
              Show Labels
            </label>
            <Switch
              checked={settings.showLabels}
              onCheckedChange={(checked) => handleChange('showLabels', checked)}
            />
          </div>
        </div>
      </div>

      {/* Action Button - Fixed on mobile */}
      <div className="pt-2 sm:pt-4">
        <Button
          onClick={() => setShowShortcutModal(true)}
          className="w-full bg-foreground text-background hover:bg-foreground/90 font-medium rounded-full h-12 sm:h-14 text-sm sm:text-base active:scale-[0.98] transition-transform"
        >
          <Download className="w-4 h-4 mr-2" />
          Install for iOS
        </Button>
      </div>

      {/* iOS Shortcut Modal - Optimized for mobile */}
      {showShortcutModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100]"
          onClick={() => setShowShortcutModal(false)}
        >
          <div
            className="bg-background border-t sm:border border-border rounded-t-3xl sm:rounded-2xl p-5 sm:p-8 w-full sm:max-w-lg relative max-h-[85vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-serif text-foreground">
                Auto-Update Wallpaper
              </h3>
              <button
                onClick={() => setShowShortcutModal(false)}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/50 sm:hidden pointer-events-none animate-bounce">
              <ChevronDown className="w-5 h-5" />
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 -mx-5 px-5 sm:-mx-8 sm:px-8 pb-2">
              <div className="space-y-5 sm:space-y-6">
                {/* Step 1: Copy URL */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs sm:text-sm font-medium shrink-0">
                    1
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium mb-1 text-sm sm:text-base">Copy your wallpaper URL</p>
                    <div
                      onClick={handleCopyToken}
                      className="flex items-center gap-2 bg-secondary/80 hover:bg-secondary px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl cursor-pointer transition-colors group active:scale-[0.98]"
                    >
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <p className="text-xs sm:text-sm font-mono text-foreground truncate">
                          {wallpaperUrl}
                        </p>
                      </div>
                      <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-background flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                        {copied ? <Check className="w-4 h-4 text-green-500 group-hover:text-background" /> : <Copy className="w-4 h-4" />}
                      </div>
                    </div>
                    {copied && (
                      <p className="text-xs text-green-600 mt-1.5 ml-1">Copied!</p>
                    )}
                  </div>
                </div>

                {/* Step 2: Create Automation */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs sm:text-sm font-medium shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground font-medium mb-1 text-sm sm:text-base">Create Automation</p>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Open <span className="font-medium text-foreground">Shortcuts</span> app → <span className="font-medium text-foreground">Automation</span> tab → New Automation → <span className="font-medium text-foreground">Time of Day</span> → 6:00 AM → Repeat <span className="font-medium text-foreground">"Daily"</span> → Select <span className="font-medium text-foreground">"Run Immediately"</span> → <span className="font-medium text-foreground">"Create New Shortcut"</span>
                    </p>
                  </div>
                </div>

                {/* Step 3: Create Shortcut */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs sm:text-sm font-medium shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground font-medium mb-2 text-sm sm:text-base">Add these actions</p>
                    <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                      <p>
                        3.1 <span className="font-medium text-foreground">"Get Contents of URL"</span> → paste the URL from step 1
                      </p>
                      <p>
                        3.2 <span className="font-medium text-foreground">"Set Wallpaper Photo"</span> → choose "Lock Screen"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Important Note */}
                <div className="bg-amber-900/80 border border-amber-700 rounded-xl p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-amber-100">
                    <span className="font-semibold text-amber-300">Important:</span> In "Set Wallpaper Photo", tap the arrow (→) to show options → disable both <span className="font-bold text-white">"Crop to Subject"</span> and <span className="font-bold text-white">"Show Preview"</span>
                  </p>
                  <p className="text-[10px] sm:text-xs text-amber-200/80 mt-2">
                    This prevents iOS from cropping and asking for confirmation each time
                  </p>
                </div>
              </div>
            </div>

            {/* Done button for mobile */}
            <div className="pt-4 sm:hidden">
              <Button
                onClick={() => setShowShortcutModal(false)}
                className="w-full bg-foreground text-background rounded-full h-12 font-medium"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
import { Circle, Square, RectangleHorizontal, Download, Smartphone, Palette, Settings2, X, Copy, Check, Share2 } from 'lucide-react';
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
    return `${backendUrl}/api/wallpaper/${userToken}`;
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
    <div className="space-y-8">
      {/* Theme Selection */}
      <div className="space-y-3">
        <Label className="text-sm text-muted-foreground flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Theme
        </Label>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`relative group p-1 rounded-lg border-2 transition-all ${
                settings.theme === theme.id
                  ? 'border-foreground'
                  : 'border-transparent hover:border-muted'
              }`}
            >
              <div
                className="w-full aspect-[9/16] rounded-md overflow-hidden"
                style={{ backgroundColor: theme.colors.background }}
              >
                <div className="p-1.5 flex flex-wrap gap-[1px]">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-1 rounded-[1px]"
                      style={{
                        backgroundColor: i < 7 ? theme.colors.lived : theme.colors.future,
                      }}
                    />
                  ))}
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 block text-center">
                {theme.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Pickers */}
      {showCustomColors && (
        <div className="space-y-3 p-4 bg-secondary/50 rounded-lg border border-border">
          <Label className="text-sm text-muted-foreground">Custom Colors</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Background</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.customColors?.background ?? '#ffffff'}
                  onChange={(e) => handleCustomColorChange('background', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-border"
                />
                <Input
                  value={settings.customColors?.background ?? '#ffffff'}
                  onChange={(e) => handleCustomColorChange('background', e.target.value)}
                  className="flex-1 text-xs font-mono"
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
                  className="w-10 h-10 rounded cursor-pointer border border-border"
                />
                <Input
                  value={settings.customColors?.lived ?? '#000000'}
                  onChange={(e) => handleCustomColorChange('lived', e.target.value)}
                  className="flex-1 text-xs font-mono"
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
                  className="w-10 h-10 rounded cursor-pointer border border-border"
                />
                <Input
                  value={settings.customColors?.future ?? '#e5e5e5'}
                  onChange={(e) => handleCustomColorChange('future', e.target.value)}
                  className="flex-1 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Birth Date */}
      <div className="space-y-2">
        <Label htmlFor="birthDate" className="text-sm text-muted-foreground">
          Birth Date
        </Label>
        <Input
          id="birthDate"
          type="date"
          value={settings.birthDate}
          onChange={(e) => handleChange('birthDate', e.target.value)}
          className="bg-background border-border"
        />
      </div>

      {/* Country / Life Expectancy */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">
          Country
          <span className="ml-1 text-xs opacity-60">(sets life expectancy)</span>
        </Label>
        <Select onValueChange={handleCountryChange} defaultValue="US">
          <SelectTrigger className="bg-background border-border">
            <SelectValue placeholder="Select country" />
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

      {/* Device */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          iPhone Model
        </Label>
        <Select
          value={settings.device}
          onValueChange={(value) => handleChange('device', value)}
        >
          <SelectTrigger className="bg-background border-border">
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

      {/* Appearance Options */}
      <div className="space-y-4 p-4 bg-secondary/30 rounded-lg">
        <Label className="text-sm text-muted-foreground flex items-center gap-2">
          <Settings2 className="w-4 h-4" />
          Appearance
        </Label>

        {/* Dot Shape */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Dot Shape</label>
          <RadioGroup
            value={settings.shape}
            onValueChange={(value) => handleChange('shape', value as DotShape)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="circle" id="circle" />
              <Label htmlFor="circle" className="flex items-center gap-1.5 cursor-pointer text-foreground text-sm">
                <Circle className="w-3 h-3" />
                Circle
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rounded" id="rounded" />
              <Label htmlFor="rounded" className="flex items-center gap-1.5 cursor-pointer text-foreground text-sm">
                <RectangleHorizontal className="w-3 h-3" />
                Rounded
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="square" id="square" />
              <Label htmlFor="square" className="flex items-center gap-1.5 cursor-pointer text-foreground text-sm">
                <Square className="w-3 h-3" />
                Square
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Widget Position */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">
            Lock Screen Widgets <span className="opacity-60">(adjusts grid)</span>
          </label>
          <RadioGroup
            value={settings.widgetPosition}
            onValueChange={(value) => handleChange('widgetPosition', value as WidgetPosition)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none" />
              <Label htmlFor="none" className="cursor-pointer text-foreground text-sm">None</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="top" id="top" />
              <Label htmlFor="top" className="cursor-pointer text-foreground text-sm">Top</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bottom" id="bottom" />
              <Label htmlFor="bottom" className="cursor-pointer text-foreground text-sm">Bottom</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Show Labels Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-xs text-muted-foreground">
            Show Labels <span className="opacity-60">(axis numbers & titles)</span>
          </label>
          <Switch
            checked={settings.showLabels}
            onCheckedChange={(checked) => handleChange('showLabels', checked)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={onDownload}
          className="flex-1 bg-foreground text-background hover:bg-foreground/90 font-medium rounded-full h-12"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Wallpaper
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowShortcutModal(true)}
          className="flex-1 border-border text-foreground hover:bg-secondary rounded-full h-12"
        >
          <Share2 className="w-4 h-4 mr-2" />
          iOS Shortcut
        </Button>
      </div>

      {/* iOS Shortcut Modal */}
      {showShortcutModal && (
        <div
          className="fixed inset-0 bg-foreground/60 flex items-center justify-center z-50 p-4"
          onClick={() => setShowShortcutModal(false)}
        >
          <div
            className="bg-background border border-border rounded-2xl p-8 max-w-lg w-full relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowShortcutModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-serif text-foreground mb-6">
              Auto-Update Your Wallpaper
            </h3>

            <div className="space-y-6">
              {/* Step 1: Copy URL */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium shrink-0">
                  1
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-medium mb-1">Copy URL</p>
                  <p className="text-sm text-muted-foreground mb-3">Configure your wallpaper above and copy the generated URL</p>
                  <div
                    onClick={handleCopyToken}
                    className="flex items-center gap-2 bg-secondary/80 hover:bg-secondary px-4 py-3 rounded-xl cursor-pointer transition-colors group"
                  >
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="text-sm font-mono text-foreground truncate">
                        {wallpaperUrl}
                      </p>
                    </div>
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-background flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                      {copied ? <Check className="w-4 h-4 text-green-500 group-hover:text-background" /> : <Copy className="w-4 h-4" />}
                    </div>
                  </div>
                  {copied && (
                    <p className="text-xs text-green-600 mt-1.5 ml-1">Copied to clipboard!</p>
                  )}
                </div>
              </div>

              {/* Step 2: Create Automation */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-foreground font-medium mb-1">Create Automation</p>
                  <p className="text-sm text-muted-foreground">
                    Open <span className="font-medium text-foreground">Shortcuts</span> app → Go to <span className="font-medium text-foreground">Automation</span> tab → New Automation → <span className="font-medium text-foreground">Time of Day</span> → <span className="font-medium text-foreground">6:00 AM</span> → Repeat <span className="font-medium text-foreground">"Daily"</span> → Select <span className="font-medium text-foreground">"Run Immediately"</span> → <span className="font-medium text-foreground">"Create New Shortcut"</span>
                  </p>
                </div>
              </div>

              {/* Step 3: Create Shortcut */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-foreground font-medium mb-1">Create Shortcut</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Add these actions:</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    3.1 <span className="font-medium text-foreground">"Get Contents of URL"</span> → paste the URL from step 1
                  </p>
                  <p className="text-sm text-muted-foreground">
                    3.2 <span className="font-medium text-foreground">"Set Wallpaper Photo"</span> → choose "Lock Screen"
                  </p>
                </div>
              </div>

              {/* Important Note */}
              <div className="bg-amber-900/80 border border-amber-700 rounded-xl p-4">
                <p className="text-sm text-amber-100">
                  <span className="font-semibold text-amber-300">Important:</span> In "Set Wallpaper Photo", tap the arrow (→) to show options → disable both <span className="font-bold text-white">"Crop to Subject"</span> and <span className="font-bold text-white">"Show Preview"</span>
                </p>
                <p className="text-xs text-amber-200/80 mt-2">
                  This prevents iOS from cropping and asking for confirmation each time
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Keyboard, Pressable, StyleSheet, Text as RNText, TextInput as RNTextInput, TextInputProps, TextProps, TextStyle, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useApp } from './store';
import { Theme } from './theme';

// Text and TextInput that pick the theme's font family from fontWeight (custom fonts need one family per weight).
function familyFor(theme: Theme, weight: unknown, explicit?: string) {
  if (explicit) return explicit;
  const w = String(weight ?? '400');
  const f = theme.fonts;
  return w === '700' || w === 'bold' ? f.bold : w === '800' || w === '900' ? f.extrabold : w === '600' ? f.semibold : w === '500' ? f.medium : f.regular;
}
export function Text({ style, ...rest }: TextProps) {
  const { theme } = useApp();
  const f = StyleSheet.flatten(style) ?? {};
  const fam = familyFor(theme, f.fontWeight, f.fontFamily);
  return <RNText {...rest} style={[style, fam ? { fontFamily: fam, fontWeight: undefined } : null]} />;
}
export function TextInput({ style, ...rest }: TextInputProps) {
  const { theme } = useApp();
  const f = StyleSheet.flatten(style) ?? {};
  const fam = familyFor(theme, f.fontWeight, f.fontFamily);
  return <RNTextInput {...rest} style={[style, fam ? { fontFamily: fam, fontWeight: undefined } : null]} />;
}

// Screen frame that never ends up under the Android status bar or gesture bar.
export function Screen({ children, bottom = true }: { children: React.ReactNode; bottom?: boolean }) {
  const { theme } = useApp();
  const i = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, paddingTop: i.top + 12, paddingBottom: bottom ? i.bottom + 12 : 0, paddingHorizontal: 16, gap: 14 }}>
      {children}
    </View>
  );
}

export function H1({ children, size = 28 }: { children: React.ReactNode; size?: number }) {
  const { theme } = useApp();
  return <Text style={{ fontFamily: theme.fonts.heading, fontWeight: '600', fontSize: size, color: theme.ink, letterSpacing: -0.4 }}>{children}</Text>;
}
export function Sub({ children }: { children: React.ReactNode }) {
  const { theme } = useApp();
  return <Text style={{ fontSize: 14, color: theme.muted, marginTop: 2 }}>{children}</Text>;
}
export function Label({ children, color }: { children: React.ReactNode; color?: string }) {
  const { theme } = useApp();
  return <Text style={{ fontSize: 12, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: color ?? theme.accent }}>{children}</Text>;
}
export function Body({ children, muted, style }: { children: React.ReactNode; muted?: boolean; style?: TextStyle }) {
  const { theme } = useApp();
  return <Text selectable style={[{ fontSize: 15, lineHeight: 22, color: muted ? theme.muted : theme.ink }, style]}>{children}</Text>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { theme } = useApp();
  return <View style={[{ backgroundColor: theme.card, borderColor: theme.line, borderWidth: 1, borderRadius: 22, padding: 16, gap: 12 }, style]}>{children}</View>;
}

/** One look for every button, like the menu at the bottom: a gold tint, a thin gold border and gold text. */
export function useButtonLook() {
  const { theme } = useApp();
  return {
    bg: theme.dark ? 'rgba(232,176,74,0.12)' : theme.chip,
    border: theme.dark ? 'rgba(232,176,74,0.55)' : theme.primary,
    fg: theme.tabActive,
  };
}

export function Btn({ title, onPress, kind = 'primary', disabled }: { title: string; onPress: () => void; kind?: 'primary' | 'secondary' | 'danger'; disabled?: boolean }) {
  const { theme } = useApp();
  const look = useButtonLook();
  const danger = kind === 'danger';
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled: !!disabled }} disabled={disabled} onPress={onPress}
      style={({ pressed }) => ({ minHeight: 52, paddingHorizontal: 16, borderRadius: 16, backgroundColor: danger ? 'transparent' : look.bg, opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: danger ? theme.danger : look.border })}>
      <Text style={{ color: danger ? theme.danger : look.fg, fontSize: 16, fontWeight: kind === 'primary' ? '700' : '600' }}>{title}</Text>
    </Pressable>
  );
}

export function SmallBtn({ title, onPress, onLongPress, tone, disabled }: { title: string; onPress: () => void; onLongPress?: () => void; tone?: 'accent'; disabled?: boolean }) {
  const { theme } = useApp();
  const look = useButtonLook();
  // tone 'accent' marks the chosen one: a stronger gold border and bold text.
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} onLongPress={onLongPress}
      style={({ pressed }) => ({ minHeight: 40, paddingHorizontal: 14, borderRadius: 12, backgroundColor: tone === 'accent' ? look.bg : theme.chip, borderWidth: 1, borderColor: tone === 'accent' ? theme.tabActive : look.border, alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.5 : pressed ? 0.8 : 1 })}>
      <Text style={{ color: look.fg, fontWeight: tone === 'accent' ? '700' : '600', fontSize: 14 }}>{title}</Text>
    </Pressable>
  );
}

export function Header({ title, sub, onBack, right }: { title: string; sub?: string; onBack: () => void; right?: React.ReactNode }) {
  const { theme, t } = useApp();
  const look = useButtonLook();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Pressable accessibilityLabel={t.back} accessibilityRole="button" onPress={onBack}
        style={({ pressed }) => ({ width: 44, height: 44, borderRadius: 14, borderWidth: 1, borderColor: look.border, backgroundColor: look.bg, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.8 : 1 })}>
        <Text style={{ color: look.fg, fontSize: 24, marginTop: -2 }}>‹</Text>
      </Pressable>
      <View style={{ flex: 1 }}>
        <H1 size={22}>{title}</H1>
        {sub ? <Sub>{sub}</Sub> : null}
      </View>
      {right}
    </View>
  );
}

export function Row({ title, sub, right, onPress, danger }: { title: string; sub?: string; right?: string; onPress?: () => void; danger?: boolean }) {
  const { theme } = useApp();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 44, opacity: pressed ? 0.7 : 1 })}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: danger ? theme.danger : theme.ink }}>{title}</Text>
        {sub ? <Text style={{ fontSize: 13, color: theme.muted }}>{sub}</Text> : null}
      </View>
      {right ? <Text style={{ fontSize: 13, fontWeight: '600', color: theme.muted, maxWidth: 150, textAlign: 'right' }} numberOfLines={1}>{right}</Text> : null}
      <Text style={{ color: theme.muted, fontSize: 18 }}>›</Text>
    </Pressable>
  );
}

/** A choice in a list: radio dot, title and description. */
export function Choice({ title, sub, on, onPress, children }: { title: string; sub?: string; on: boolean; onPress: () => void; children?: React.ReactNode }) {
  const { theme } = useApp();
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ checked: on }} onPress={onPress}
      style={{ flexDirection: 'row', gap: 12, alignItems: 'center', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: on ? theme.primary : theme.line, backgroundColor: on ? theme.chip : theme.card }}>
      <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: on ? theme.primary : theme.muted, alignItems: 'center', justifyContent: 'center' }}>
        {on ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: theme.primary }} /> : null}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: theme.ink }}>{title}</Text>
        {sub ? <Text style={{ fontSize: 13, color: theme.muted, lineHeight: 18 }}>{sub}</Text> : null}
        {children}
      </View>
    </Pressable>
  );
}

/** Options side by side, in the same see-through look as the menu at the bottom. */
export function Segmented<T extends string>({ options, value, onChange }: { options: [T, string][]; value: T; onChange: (v: T) => void }) {
  const { theme } = useApp();
  const glass = theme.dark ? 'rgba(19,34,37,0.78)' : 'rgba(250,248,244,0.86)';
  const gold = theme.dark ? 'rgba(232,176,74,0.5)' : theme.line;
  return (
    <View style={{ flexDirection: 'row', backgroundColor: glass, borderColor: theme.dark ? 'rgba(232,176,74,0.22)' : theme.line, borderWidth: 1, borderRadius: 20, padding: 4, gap: 2 }}>
      {options.map(([k, label]) => {
        const on = k === value;
        return (
          <Pressable key={k} accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => onChange(k)}
            style={{ flex: 1, minHeight: 44, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 2, paddingHorizontal: 4,
              backgroundColor: on ? (theme.dark ? 'rgba(232,176,74,0.12)' : theme.chip) : 'transparent', borderWidth: on ? 1 : 0, borderColor: gold }}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={{ fontSize: 13, fontWeight: on ? '700' : '600', color: on ? theme.tabActive : theme.muted }}>{label}</Text>
            {on ? <View style={{ width: 16, height: 3, borderRadius: 2, backgroundColor: theme.tabActive }} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

export function Toggle({ title, on, onChange }: { title: string; on: boolean; onChange: (v: boolean) => void }) {
  const { theme } = useApp();
  return (
    <Pressable accessibilityRole="switch" accessibilityState={{ checked: on }} onPress={() => onChange(!on)} style={{ flexDirection: 'row', alignItems: 'center', minHeight: 44, gap: 12 }}>
      <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: theme.ink }}>{title}</Text>
      <View style={{ width: 48, height: 28, borderRadius: 14, padding: 3, backgroundColor: on ? theme.primary : theme.chip, alignItems: on ? 'flex-end' : 'flex-start' }}>
        <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: on ? theme.onPrimary : theme.muted }} />
      </View>
    </Pressable>
  );
}

/** True while the on-screen keyboard is open, so bars that would cover a field can be hidden. */
export function useKeyboardOpen() {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setOpen(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setOpen(false));
    return () => { show.remove(); hide.remove(); };
  }, []);
  return open;
}

export type TabName = 'home' | 'eval' | 'docs';

/** Room at the bottom of a tab page, so the last line can be scrolled up above the floating menu. */
export const TAB_SPACE = 96;

// Two-tone icons for the bottom bar (24 x 24): soft fill and a line in the tab's color.
function TabIcon({ tab, color, fill }: { tab: TabName; color: string; fill: string }) {
  const line = { stroke: color, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24">
      {tab === 'home' ? <>
        <Path {...line} fill={fill} d="M4 11.2 12 4.5l8 6.7V19a1.5 1.5 0 0 1-1.5 1.5H15v-5.5H9v5.5H5.5A1.5 1.5 0 0 1 4 19z" />
        <Path fill={color} d="M11.4 9.2l.6-.6.6.6-.6.6z" />
      </> : null}
      {tab === 'eval' ? <>
        <Path {...line} fill={fill} d="M7 3.5h7l4.5 4.5v11.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1z" />
        <Path {...line} fill="none" d="M14 3.5V8h4.5" />
        <Path {...line} fill="none" strokeWidth={1.8} d="M9 14l2 2 4-4" />
      </> : null}
      {tab === 'docs' ? <>
        <Rect x={7.5} y={3.5} width={12} height={15} rx={2} fill={fill} stroke={color} strokeWidth={1.6} />
        <Path {...line} fill="none" d="M5 7v12a1.5 1.5 0 0 0 1.5 1.5H15" />
        <Path {...line} strokeWidth={1.4} d="M10.5 8.5h6M10.5 11.5h6M10.5 14.5h3.5" />
      </> : null}
    </Svg>
  );
}

/** The bottom menu: floats over the page and is slightly see-through, so long pages show faintly behind it. */
export function TabBar({ tab, setTab }: { tab: TabName; setTab: (t: TabName) => void }) {
  const { theme, t } = useApp();
  const i = useSafeAreaInsets();
  const items: [TabName, string][] = [['home', t.tabHome], ['eval', t.tabEval], ['docs', t.tabDocs]];
  const glass = theme.dark ? 'rgba(19,34,37,0.78)' : 'rgba(250,248,244,0.86)';
  return (
    <View accessibilityLabel={t.mainMenu} style={{ position: 'absolute', left: 12, right: 12, bottom: i.bottom + 8, flexDirection: 'row', gap: 2, backgroundColor: glass, borderColor: theme.dark ? 'rgba(232,176,74,0.22)' : theme.line, borderWidth: 1, borderRadius: 24, padding: 5, elevation: 8, shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 6 } }}>
      {items.map(([k, label]) => {
        const on = tab === k, color = on ? theme.tabActive : theme.muted;
        const fill = on ? (theme.dark ? 'rgba(232,176,74,0.22)' : 'rgba(38,35,31,0.12)') : (theme.dark ? 'rgba(183,198,195,0.08)' : 'rgba(106,99,88,0.08)');
        return (
          <Pressable key={k} accessibilityRole="tab" accessibilityLabel={label} accessibilityState={{ selected: on }} onPress={() => setTab(k)}
            style={{ flex: 1, minHeight: 60, borderRadius: 19, alignItems: 'center', justifyContent: 'center', gap: 2, backgroundColor: on ? (theme.dark ? 'rgba(232,176,74,0.12)' : theme.chip) : 'transparent', borderWidth: on ? 1 : 0, borderColor: theme.dark ? 'rgba(232,176,74,0.5)' : theme.line }}>
            <TabIcon tab={k} color={color} fill={fill} />
            <Text numberOfLines={1} style={{ fontSize: 10.5, fontWeight: on ? '700' : '600', color, maxWidth: '100%', paddingHorizontal: 1 }}>{label}</Text>
            {on ? <View style={{ width: 16, height: 3, borderRadius: 2, backgroundColor: theme.tabActive }} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

/** Gear in the top right corner that opens Settings; a ring glows around it when a new version is out. */
export function GearButton({ onPress, glow }: { onPress: () => void; glow?: boolean }) {
  const { theme, t } = useApp();
  const look = useButtonLook();
  const c = look.fg;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={glow ? `${t.settings} · ${t.newVersion}` : t.settings} onPress={onPress} hitSlop={8}
      style={({ pressed }) => ({ width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', backgroundColor: look.bg, borderWidth: glow ? 2 : 1, borderColor: glow ? '#E8B04A' : look.border, opacity: pressed ? 0.8 : 1,
        shadowColor: '#E8B04A', shadowOpacity: glow ? 0.9 : 0, shadowRadius: glow ? 10 : 0, elevation: glow ? 10 : 0 })}>
      <Svg width={24} height={24} viewBox="0 0 24 24">
        <Path d="M12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8z" stroke={c} strokeWidth={1.7} fill="none" />
        <Path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.5-2-3.4-2.3.9a7.5 7.5 0 0 0-2.6-1.5L14.1 2.5h-4l-.4 2.5a7.5 7.5 0 0 0-2.6 1.5l-2.3-.9-2 3.4 2 1.5a7.6 7.6 0 0 0 0 3l-2 1.5 2 3.4 2.3-.9a7.5 7.5 0 0 0 2.6 1.5l.4 2.5h4l.4-2.5a7.5 7.5 0 0 0 2.6-1.5l2.3.9 2-3.4z" stroke={c} strokeWidth={1.5} strokeLinejoin="round" fill="none" />
      </Svg>
      {glow ? <View style={{ position: 'absolute', top: 2, right: 2, width: 10, height: 10, borderRadius: 5, backgroundColor: '#E8B04A', borderWidth: 2, borderColor: theme.card }} /> : null}
    </Pressable>
  );
}

/** Title of a tab page with the gear on the right. */
export function PageTitle({ title, sub, onGear, glow, right }: { title: string; sub?: string; onGear: () => void; glow?: boolean; right?: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <View style={{ flex: 1 }}><H1>{title}</H1>{sub ? <Sub>{sub}</Sub> : null}</View>
      {right}
      <GearButton onPress={onGear} glow={glow} />
    </View>
  );
}

/** Small preview of a theme (used in the theme picker). */
export function ThemePreview({ th }: { th: Theme }) {
  return (
    <View style={{ width: 120, height: 200, borderRadius: 16, backgroundColor: th.bg, borderWidth: 1, borderColor: th.line, padding: 10, gap: 8 }}>
      <View style={{ height: 10, width: 60, borderRadius: 5, backgroundColor: th.ink }} />
      <View style={{ height: 46, borderRadius: 10, backgroundColor: th.card, borderWidth: 1, borderColor: th.line, alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: 8 }}>
        <RNText style={{ fontFamily: th.fonts.display, fontSize: 16, letterSpacing: 3, color: th.dark ? '#F3D9A0' : th.accent }}>ATS</RNText>
      </View>
      <View style={{ height: 8, width: 70, borderRadius: 4, backgroundColor: th.accent }} />
      <View style={{ height: 8, width: 90, borderRadius: 4, backgroundColor: th.muted }} />
      <View style={{ flex: 1 }} />
      <View style={{ height: 28, borderRadius: 10, backgroundColor: th.primary }} />
    </View>
  );
}

/** The ATS mark: a gold ring with an eight-pointed star and a document. */
export function AtsMark({ size = 54 }: { size?: number }) {
  const { theme } = useApp();
  const gold = theme.dark ? '#E8B04A' : theme.accent;
  const pale = theme.dark ? '#F3D9A0' : theme.accent;
  const mint = theme.dark ? '#5FC4B4' : theme.good;
  return (
    <Svg width={size} height={size} viewBox="0 0 160 160">
      <Path d="M48.9 48.9h62.2v62.2H48.9zM80 36l44 44-44 44-44-44z" stroke={gold} strokeOpacity={0.45} strokeWidth={1.4} fill="none" />
      <Circle cx={80} cy={80} r={56} stroke={gold} strokeWidth={4} fill="none" />
      <Path d="M65 54h22l10 10v40a2 2 0 0 1-2 2H65a2 2 0 0 1-2-2V56a2 2 0 0 1 2-2z" fill={theme.dark ? '#132225' : theme.card} stroke={gold} strokeWidth={2.4} strokeLinejoin="round" />
      <Path d="M87 54v10h10" fill="none" stroke={gold} strokeWidth={2.4} strokeLinejoin="round" />
      <Path d="M70 74h18M70 90h18M70 98h10" stroke={pale} strokeWidth={2.4} strokeLinecap="round" />
      <Path d="M70 82h14" stroke={mint} strokeWidth={2.8} strokeLinecap="round" />
    </Svg>
  );
}

export const styles = StyleSheet.create({ fill: { flex: 1 } });

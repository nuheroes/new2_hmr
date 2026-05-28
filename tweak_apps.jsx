// tweaks-app.jsx — minimal tweaks for the strict 3-color Hanmir deck.
// Brand palette is locked (black · white · #FF4713). Tweaks adjust
// orange intensity, hairline weight, and a few presentational choices.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "orangeShade": "FF4713",
  "ruleWeight": "medium",
  "darkSlides": "title-end",
  "ruleStyle": "horizontal"
}/*EDITMODE-END*/;

const ORANGE_SHADES = {
  "FF4713": { label: "FF4713", hex: "#FF4713" },
  "E63900": { label: "E63900", hex: "#E63900" },
  "FF6A3D": { label: "FF6A3D", hex: "#FF6A3D" },
};

const RULE_WEIGHTS = {
  hairline: { thick: "1px", thin: "1px",   accent: "4px" },
  medium:   { thick: "2px", thin: "1px",   accent: "6px" },
  bold:     { thick: "3px", thin: "1.5px", accent: "8px" },
};

function applyTweaks(t) {
  const root = document.documentElement;

  // Orange shade
  const sh = ORANGE_SHADES[t.orangeShade] || ORANGE_SHADES["FF4713"];
  root.style.setProperty("--orange", sh.hex);

  // Rule weight — adjusts dividers, top/bottom borders, accent bars
  const rw = RULE_WEIGHTS[t.ruleWeight] || RULE_WEIGHTS.medium;
  document.querySelectorAll(".rule:not(.accent):not(.thin)").forEach(el => el.style.height = rw.thick);
  document.querySelectorAll(".rule.accent").forEach(el => el.style.height = rw.accent);

  // Dark slides — toggle which slides use black background
  const allSlides = document.querySelectorAll("deck-stage > section.slide");
  allSlides.forEach((el, i) => el.classList.remove("dark"));
  if (t.darkSlides === "title-end") {
    allSlides[0]?.classList.add("dark");
    allSlides[allSlides.length - 1]?.classList.add("dark");
  } else if (t.darkSlides === "title-only") {
    allSlides[0]?.classList.add("dark");
  } else if (t.darkSlides === "all") {
    allSlides.forEach(el => el.classList.add("dark"));
  } else if (t.darkSlides === "alternate") {
    allSlides.forEach((el, i) => { if (i % 2 === 1) el.classList.add("dark"); });
  }
  // 'none' → already cleared
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => { applyTweaks(t); }, [t]);

  return (
    <TweaksPanel title="Tweaks · 한미르">
      <TweakSection label="브랜드 컬러" />
      <TweakColor
        label="오렌지 톤"
        value={ORANGE_SHADES[t.orangeShade]?.hex || "#FF4713"}
        options={["#FF4713", "#E63900", "#FF6A3D"]}
        onChange={(v) => {
          const k = Object.keys(ORANGE_SHADES).find(key => ORANGE_SHADES[key].hex === v) || "FF4713";
          setTweak("orangeShade", k);
        }}
      />

      <TweakSection label="레이아웃" />
      <TweakRadio
        label="구분선 굵기"
        value={t.ruleWeight}
        options={[
          { value: "hairline", label: "얇게" },
          { value: "medium",   label: "중간" },
          { value: "bold",     label: "굵게" },
        ]}
        onChange={(v) => setTweak("ruleWeight", v)}
      />
      <TweakSelect
        label="블랙 슬라이드"
        value={t.darkSlides}
        options={[
          { value: "title-end",  label: "타이틀 · 엔드 (기본)" },
          { value: "title-only", label: "타이틀만" },
          { value: "alternate",  label: "홀짝 교차" },
          { value: "all",        label: "전체 블랙" },
          { value: "none",       label: "전체 화이트" },
        ]}
        onChange={(v) => setTweak("darkSlides", v)}
      />
    </TweaksPanel>
  );
}

const root = ReactDOM.createRoot(document.getElementById("tweaks-root"));
root.render(<App />);
